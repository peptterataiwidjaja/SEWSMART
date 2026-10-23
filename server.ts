import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  DEFAULT_USERS,
  DEFAULT_NAV_BARS,
  INITIAL_OPERATORS,
  VALID_LINES,
  generateInitialLineRows,
} from "./src/data/defaultData";
import {
  DEFAULT_LINES_BP,
  INITIAL_SEPTEMBER_2026_LOGS,
} from "./src/data/lineBPData";
import {
  User,
  LineNumber,
  LineProductionData,
  Operator,
  LineBPData,
  DailyReportLog,
  NavBarConfig,
} from "./src/types";

dotenv.config();

const app = express();
// AI Studio container environment routes inbound traffic through Nginx (port 8080) to the app on port 3000.
// Do not bind to 8080 as that causes EADDRINUSE collisions with Nginx.
const PORT = parseInt(process.env.DEFAULT_APP_PORT || "3000", 10);

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  }
  return aiClient;
}

// Healthcheck endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Google Apps Script Web App Proxy Endpoint
// Proxies sync requests to avoid browser CORS / 302 redirect issues with script.google.com
app.post("/api/google-script-sync", async (req, res) => {
  const { scriptUrl, action, payload } = req.body;

  if (!scriptUrl || typeof scriptUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "URL Google Apps Script Web App tidak valid atau belum diisi.",
    });
  }

  try {
    const postBody = JSON.stringify({
      action: action || "SYNC_HOURLY",
      timestamp: new Date().toISOString(),
      payload: payload || {},
    });

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postBody,
      redirect: "follow",
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Google Apps Script mengembalikan status ${response.status}`,
        details: data,
      });
    }

    return res.json({
      success: true,
      message: data?.message || "Data berhasil disinkronkan ke Google Spreadsheet via Google Apps Script.",
      data,
    });
  } catch (error: any) {
    console.error("Error proxying to Google Apps Script:", error);
    return res.status(500).json({
      success: false,
      message: `Gagal menghubungi Google Apps Script: ${error?.message || "Koneksi terputus"}`,
    });
  }
});

// Endpoint to test or ping Google Apps Script (GET)
app.get("/api/google-script-test", async (req, res) => {
  const scriptUrl = req.query.url as string;
  if (!scriptUrl) {
    return res.status(400).json({ success: false, message: "Parameter URL diperlukan." });
  }

  try {
    const separator = scriptUrl.includes("?") ? "&" : "?";
    const testUrl = `${scriptUrl}${separator}action=PING&timestamp=${Date.now()}`;
    const response = await fetch(testUrl, {
      method: "GET",
      redirect: "follow",
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return res.json({
      success: response.ok,
      message: response.ok ? "Koneksi Google Apps Script berhasil dan aktif!" : `Respon ${response.status}`,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Koneksi gagal: ${error?.message || "Tidak dapat menghubungi server"}`,
    });
  }
});

// AI Bottleneck & Target Shortfall Analysis endpoint
app.post("/api/analyze-target", async (req, res) => {
  const { line, target, actual, shortfall, bottlenecks, lowGradingOps, summaryData } = req.body;

  try {
    const ai = getAIClient();
    if (ai) {
      const prompt = `Anda adalah Industrial Engineering & Sewing Production Expert di industri garmen manufaktur.
Analisis data kegagalan pencapaian target produksi pada Line ${line}:
- Target Kumulatif: ${target} pcs
- Aktual Tercapai: ${actual} pcs
- Selisih / Defisit: ${shortfall} pcs (${target > 0 ? ((shortfall / target) * 100).toFixed(1) : 0}% di bawah target)
- Proses Bottleneck Terparah:
${(bottlenecks || [])
  .map(
    (b: any) =>
      `  * No ${b.no} - ${b.process} (Mesin: ${b.machine}): Target ${b.target} pcs, Aktual ${b.actual} pcs (Defisit: ${b.shortfall}), Output/jam: ${b.hourlyRate} pcs, Defect: ${b.defects || 0} pcs`
  )
  .join("\n")}
- Operator Membutuhkan Pendampingan (Grade C/D):
${(lowGradingOps || [])
  .map(
    (op: any) =>
      `  * ${op.name} (Grade: ${op.grade}, Efisiensi: ${op.efficiency}%, Defect: ${op.defects}) pada proses ${op.process}`
  )
  .join("\n")}

Format output yang dibutuhkan (gunakan bahasa Indonesia yang ringkas, teknis, dan solutif ala Supervisor Pabrik Garmen):
1. **Analisis Akar Masalah (4M: Man, Machine, Method, Material)**
2. **Identifikasi Bottleneck Utama & Efek Domino ke Proses Selanjutnya**
3. **Langkah Taktis Penyelamatan Line (Immediate Action Plan - 1 s/d 2 Jam Ke Depan)**
4. **Rekomendasi Penyeimbangan Line (Line Balancing & Relokasi Helper / Operator Cadangan)**

Buatlah dalam format Markdown yang rapi dan mudah dibaca supervisor di lantai produksi.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      if (response.text) {
        return res.json({
          source: "gemini",
          analysis: response.text,
        });
      }
    }
  } catch (error: any) {
    console.warn("Gemini API call failed or not configured, using expert rule-based diagnostic engine:", error?.message);
  }

  // Expert Heuristic Fallback Analysis
  const topBottleneck = bottlenecks?.[0] || { process: "Operasi Jahit Utama", machine: "SN", shortfall: shortfall || 15 };
  const fallbackAnalysis = `### 🔍 Analisis Diagnostik Otomatis Line ${line} (Sistem IE Garmen)

#### 1. Ringkasan Kesenjangan Target (Gap Summary)
* **Status Produksi:** Line ${line} mengalami defisit sebesar **${shortfall} pcs** terhadap target (${actual}/${target} pcs).
* **Efisiensi Line Aktual:** ${target > 0 ? ((actual / target) * 100).toFixed(1) : 0}%.
* **Stasiun Penghambat Terbesar:** **${topBottleneck.process}** (Mesin ${topBottleneck.machine}) dengan defisit per jam yang menumpuk.

#### 2. Akar Masalah Berdasarkan Analisis 4M:
* **Man (Tenaga Kerja):** Operator pada stasiun bottleneck mengalami kendala ritme kerja atau kesulitan pada bagian rumit (cycle time melampaui SMV standar). ${lowGradingOps?.length ? `Terdapat ${lowGradingOps.length} operator berkategori Grade C/D yang memerlukan bantuan.` : "Fluktuasi ritme kerja operator jam ke jam terlihat menurun di paruh kedua jam kerja."}
* **Machine (Mesin):** Kebutuhan alat jahit tipe **${topBottleneck.machine}** memiliki beban SMV tinggi. Perlu pemeriksaan tension benang, jarum tumpul, atau rpm mesin yang belum maksimal.
* **Method (Metode Kerja):** Penumpukan WIP (Work In Process) terjadi sebelum stasiun ${topBottleneck.process}, mengindikasikan ketidakseimbangan beban kerja (line imbalance).
* **Material:** Pastikan bundle potongan kain dan aksesoris (benang, padding, interlining) telah siap di feeding table tanpa jeda pencarian potongan.

#### 3. Rencana Aksi Segera (Action Plan Supervisor):
1. **Terapkan Bantuan Floating Helper / Operator Serbabisa:** Alokasikan 1 orang Helper cadangan untuk membantu trimming, penataan potongan, atau bundling di stasiun ${topBottleneck.process}.
2. **Breakdown Elemen Gerak:** Periksa apakah operator melakukan gerakan non-value-added (misal menjangkau komponen terlalu jauh atau memotong benang manual berulang).
3. **Pemberian Target Mini per 30 Menit:** Pasang target visual jangka pendek untuk memacu ritme kerja kembali normal.
4. **Maintenance Check:** Lakukan quick check pada mesin ${topBottleneck.machine} untuk memastikan tidak ada loncatan jahitan atau benang putus berulang.`;

  return res.json({
    source: "heuristic-expert",
    analysis: fallbackAnalysis,
  });
});

// ============================================================================
// API KEY MANAGEMENT & REAL-TIME MONITORING API (V1)
// ============================================================================

interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  role: "production_engineer" | "admin_line" | "viewer";
  assignedLine?: number; // 1, 3, 4, 5, 6, 7 or undefined for all
  permissions: ("read" | "write" | "admin")[];
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
  isActive: boolean;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), "data-store");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn("Could not create data-store dir:", e);
  }
}

const API_KEYS_FILE = path.join(DATA_DIR, "api_keys.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PRODUCTION_STORE_FILE = path.join(DATA_DIR, "production_store.json");
const OPERATORS_FILE = path.join(DATA_DIR, "operators.json");
const LINES_BP_FILE = path.join(DATA_DIR, "lines_bp.json");
const DAILY_LOGS_FILE = path.join(DATA_DIR, "daily_logs.json");
const NAV_BARS_FILE = path.join(DATA_DIR, "nav_bars.json");

// System version counter for incremental syncing
let systemVersion = Date.now();

const DEFAULT_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key-pe-master",
    key: "sew_live_pe_master_2026",
    name: "Master Key (Production Engineer / PE)",
    role: "production_engineer",
    permissions: ["read", "write", "admin"],
    createdAt: "2026-09-26T00:00:00.000Z",
    usageCount: 0,
    isActive: true,
    notes: "Kunci akses penuh untuk Production Engineer & Head Office",
  },
  {
    id: "key-line-1",
    key: "sew_live_line1_input_2026",
    name: "Supervisor Input Key - Line 1 Sewing (TW1)",
    role: "admin_line",
    assignedLine: 1,
    permissions: ["read", "write"],
    createdAt: "2026-09-26T00:00:00.000Z",
    usageCount: 0,
    isActive: true,
    notes: "Kunci input aktual & monitoring khusus Line 1",
  },
  {
    id: "key-line-3",
    key: "sew_live_line3_input_2026",
    name: "Supervisor Input Key - Line 3 Sewing (TW1)",
    role: "admin_line",
    assignedLine: 3,
    permissions: ["read", "write"],
    createdAt: "2026-09-26T00:00:00.000Z",
    usageCount: 0,
    isActive: true,
    notes: "Kunci input aktual & monitoring khusus Line 3",
  },
  {
    id: "key-monitor-tv",
    key: "sew_live_monitor_display_2026",
    name: "Display TV Monitoring Real-Time (All Lines)",
    role: "viewer",
    permissions: ["read"],
    createdAt: "2026-09-26T00:00:00.000Z",
    usageCount: 0,
    isActive: true,
    notes: "Kunci akses baca (read-only) untuk layar TV monitoring lantai produksi",
  },
];

// In-memory store variables pre-declared before initialization
let apiKeysStore: ApiKeyRecord[] = [];
let usersStore: User[] = [];
let operatorsStore: Operator[] = [];
let linesBPStore: Record<LineNumber, LineBPData> = {} as any;
let productionLinesStore: Record<number, any> = {};
let dailyLogsStore: DailyReportLog[] = [];
let navBarsStore: NavBarConfig[] = [];

// 1. API KEYS
function loadApiKeys(): ApiKeyRecord[] {
  try {
    if (fs.existsSync(API_KEYS_FILE)) {
      const data = fs.readFileSync(API_KEYS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading API keys file:", err);
  }
  return DEFAULT_API_KEYS;
}

function saveApiKeys(keys: ApiKeyRecord[]): void {
  apiKeysStore = keys;
  try {
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving API keys file:", err);
  }
}

// 2. USERS (Multi-user accounts saved centrally on server)
function loadUsers(): User[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading users file:", err);
  }
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

function saveUsers(users: User[]): void {
  usersStore = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving users file:", err);
  }
}

// 3. OPERATORS (Attendance, skill matrix, grading)
function loadOperators(): Operator[] {
  try {
    if (fs.existsSync(OPERATORS_FILE)) {
      const data = fs.readFileSync(OPERATORS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading operators file:", e);
  }
  saveOperators(INITIAL_OPERATORS);
  return INITIAL_OPERATORS;
}

function saveOperators(ops: Operator[]): void {
  operatorsStore = ops;
  try {
    fs.writeFileSync(OPERATORS_FILE, JSON.stringify(ops, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving operators file:", e);
  }
}

// 4. LINES BREAKDOWN DATA (BP)
function loadLinesBP(): Record<LineNumber, LineBPData> {
  try {
    if (fs.existsSync(LINES_BP_FILE)) {
      const data = fs.readFileSync(LINES_BP_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading lines BP file:", e);
  }
  saveLinesBP(DEFAULT_LINES_BP);
  return DEFAULT_LINES_BP;
}

function saveLinesBP(bp: Record<LineNumber, LineBPData>): void {
  linesBPStore = bp;
  try {
    fs.writeFileSync(LINES_BP_FILE, JSON.stringify(bp, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving lines BP file:", e);
  }
}

// 5. PRODUCTION STORE (Lines 1, 3, 4, 5, 6, 7 Hourly Production Control Sheets)
function generateInitialProductionData(): Record<number, any> {
  const initial: Record<number, any> = {};
  VALID_LINES.forEach((lineId) => {
    const bp = linesBPStore[lineId] || DEFAULT_LINES_BP[lineId] || DEFAULT_LINES_BP[1];
    const ops = operatorsStore.filter((o) => o.line === lineId);
    initial[lineId] = generateInitialLineRows(lineId, bp.processes, ops);
  });
  return initial;
}

function loadProductionStore(): Record<number, any> {
  try {
    if (fs.existsSync(PRODUCTION_STORE_FILE)) {
      const data = fs.readFileSync(PRODUCTION_STORE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  const initial = generateInitialProductionData();
  saveProductionStore(initial);
  return initial;
}

function saveProductionStore(lines: Record<number, any>): void {
  productionLinesStore = lines;
  try {
    fs.writeFileSync(PRODUCTION_STORE_FILE, JSON.stringify(lines, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving production store:", e);
  }
}

// 6. DAILY LOGS
function loadDailyLogs(): DailyReportLog[] {
  try {
    if (fs.existsSync(DAILY_LOGS_FILE)) {
      const data = fs.readFileSync(DAILY_LOGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading daily logs file:", e);
  }
  saveDailyLogs(INITIAL_SEPTEMBER_2026_LOGS);
  return INITIAL_SEPTEMBER_2026_LOGS;
}

function saveDailyLogs(logs: DailyReportLog[]): void {
  dailyLogsStore = logs;
  try {
    fs.writeFileSync(DAILY_LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving daily logs file:", e);
  }
}

// 7. NAV BARS CONFIG
function loadNavBars(): NavBarConfig[] {
  try {
    if (fs.existsSync(NAV_BARS_FILE)) {
      const data = fs.readFileSync(NAV_BARS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading nav bars file:", e);
  }
  saveNavBars(DEFAULT_NAV_BARS);
  return DEFAULT_NAV_BARS;
}

function saveNavBars(bars: NavBarConfig[]): void {
  navBarsStore = bars;
  try {
    fs.writeFileSync(NAV_BARS_FILE, JSON.stringify(bars, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving nav bars file:", e);
  }
}

// Initialize all stores in proper dependency order
apiKeysStore = loadApiKeys();
usersStore = loadUsers();
operatorsStore = loadOperators();
linesBPStore = loadLinesBP();
productionLinesStore = loadProductionStore();
dailyLogsStore = loadDailyLogs();
navBarsStore = loadNavBars();

// Middleware: Authenticate Request via API Key
function extractApiKey(req: express.Request): string | null {
  const headerKey = req.headers["x-api-key"];
  if (typeof headerKey === "string" && headerKey.trim()) {
    return headerKey.trim();
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  const queryKey = req.query.api_key;
  if (typeof queryKey === "string" && queryKey.trim()) {
    return queryKey.trim();
  }
  return null;
}

function verifyApiKeyRecord(rawKey: string): ApiKeyRecord | null {
  apiKeysStore = loadApiKeys();
  const matched = apiKeysStore.find((k) => k.key === rawKey);
  if (!matched) return null;
  if (!matched.isActive) return null;

  matched.usageCount = (matched.usageCount || 0) + 1;
  matched.lastUsedAt = new Date().toISOString();
  saveApiKeys(apiKeysStore);
  return matched;
}

// 1. Verify API Key & Login endpoint
app.post("/api/v1/auth/verify-key", (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== "string") {
    return res.status(400).json({
      success: false,
      message: "API Key diperlukan.",
    });
  }

  const keyRecord = verifyApiKeyRecord(apiKey.trim());
  if (!keyRecord) {
    return res.status(401).json({
      success: false,
      message: "Kunci API tidak valid atau telah dinonaktifkan.",
    });
  }

  const userName =
    keyRecord.role === "production_engineer"
      ? "Production Engineer (Via API Key)"
      : keyRecord.role === "viewer"
      ? "Monitoring Display (Via API Key)"
      : `Supervisor Line ${keyRecord.assignedLine || 1} (Via API Key)`;

  return res.json({
    success: true,
    message: `Kunci API valid! Masuk sebagai ${keyRecord.name}.`,
    key: {
      id: keyRecord.id,
      name: keyRecord.name,
      role: keyRecord.role,
      assignedLine: keyRecord.assignedLine,
      permissions: keyRecord.permissions,
      lastUsedAt: keyRecord.lastUsedAt,
    },
    user: {
      id: `user-key-${keyRecord.id}`,
      username: keyRecord.name,
      name: userName,
      role: keyRecord.role === "viewer" ? "admin_line" : keyRecord.role,
      assignedLine: keyRecord.assignedLine,
      title: `${keyRecord.name} (API Auth)`,
      lastLogin: new Date().toISOString().replace("T", " ").substring(0, 16),
      isApiKeyAuth: true,
      apiKeyPermissions: keyRecord.permissions,
    },
  });
});

// 2. Get All API Keys (Admin / PE access or Master Key)
app.get("/api/v1/keys", (req, res) => {
  const rawKey = extractApiKey(req);
  apiKeysStore = loadApiKeys();

  // If caller provided a valid master key or PE key, show unmasked keys; else show masked
  let isAuthorizedMaster = false;
  if (rawKey) {
    const callerKey = apiKeysStore.find((k) => k.key === rawKey && k.isActive);
    if (callerKey && (callerKey.role === "production_engineer" || callerKey.permissions.includes("admin"))) {
      isAuthorizedMaster = true;
    }
  }

  const list = apiKeysStore.map((k) => ({
    id: k.id,
    key: isAuthorizedMaster ? k.key : `${k.key.substring(0, 9)}****${k.key.slice(-4)}`,
    rawKey: isAuthorizedMaster ? k.key : undefined,
    name: k.name,
    role: k.role,
    assignedLine: k.assignedLine,
    permissions: k.permissions,
    createdAt: k.createdAt,
    lastUsedAt: k.lastUsedAt,
    usageCount: k.usageCount || 0,
    isActive: k.isActive,
    notes: k.notes,
  }));

  return res.json({
    success: true,
    keys: list,
  });
});

// 3. Create a New API Key
app.post("/api/v1/keys", (req, res) => {
  const { name, role, assignedLine, permissions, notes } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      success: false,
      message: "Nama / Label Kunci API wajib diisi.",
    });
  }

  const randomPart = crypto.randomBytes(8).toString("hex");
  const linePrefix = assignedLine ? `line${assignedLine}` : role === "viewer" ? "view" : "pe";
  const newGeneratedKey = `sew_live_${linePrefix}_${randomPart}`;

  const validRole = role === "production_engineer" || role === "admin_line" || role === "viewer" ? role : "admin_line";
  const validPermissions = Array.isArray(permissions) && permissions.length > 0 ? permissions : ["read", "write"];

  const newRecord: ApiKeyRecord = {
    id: `key-${Date.now()}-${randomPart.substring(0, 4)}`,
    key: newGeneratedKey,
    name: name.trim(),
    role: validRole,
    assignedLine: assignedLine ? Number(assignedLine) : undefined,
    permissions: validPermissions,
    createdAt: new Date().toISOString(),
    usageCount: 0,
    isActive: true,
    notes: notes || `Dibuat untuk integrasi input & monitoring ${name}`,
  };

  apiKeysStore = loadApiKeys();
  apiKeysStore.unshift(newRecord);
  saveApiKeys(apiKeysStore);

  return res.status(201).json({
    success: true,
    message: "Kunci API baru berhasil dibuat!",
    key: newRecord,
  });
});

// 4. Update / Toggle API Key
app.patch("/api/v1/keys/:id", (req, res) => {
  const { id } = req.params;
  const { isActive, name, notes, permissions } = req.body;

  apiKeysStore = loadApiKeys();
  const index = apiKeysStore.findIndex((k) => k.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Kunci API tidak ditemukan." });
  }

  if (typeof isActive === "boolean") apiKeysStore[index].isActive = isActive;
  if (name && typeof name === "string") apiKeysStore[index].name = name.trim();
  if (notes && typeof notes === "string") apiKeysStore[index].notes = notes;
  if (Array.isArray(permissions)) apiKeysStore[index].permissions = permissions;

  saveApiKeys(apiKeysStore);

  return res.json({
    success: true,
    message: "Status Kunci API berhasil diperbarui.",
    key: apiKeysStore[index],
  });
});

// 5. Delete / Revoke API Key
app.delete("/api/v1/keys/:id", (req, res) => {
  const { id } = req.params;
  apiKeysStore = loadApiKeys();

  // Prevent deleting the default master key
  if (id === "key-pe-master") {
    return res.status(400).json({
      success: false,
      message: "Master Key PE default tidak dapat dihapus demi keamanan sistem.",
    });
  }

  const initialLen = apiKeysStore.length;
  apiKeysStore = apiKeysStore.filter((k) => k.id !== id);

  if (apiKeysStore.length === initialLen) {
    return res.status(404).json({ success: false, message: "Kunci API tidak ditemukan." });
  }

  saveApiKeys(apiKeysStore);
  return res.json({
    success: true,
    message: "Kunci API berhasil dihapus / dicabut.",
  });
});

// 6. REAL-TIME MONITORING ENDPOINT (GET /api/v1/monitoring)
// Can be monitored by dashboards, TVs, external viewers, or supervisor screens
app.get("/api/v1/monitoring", (req, res) => {
  const rawKey = extractApiKey(req);
  if (rawKey) {
    verifyApiKeyRecord(rawKey); // increment usage stats
  }

  const linesList = [1, 3, 4, 5, 6, 7];
  const summary = linesList.map((lineId) => {
    const lineData = productionLinesStore[lineId];
    const location = lineId === 1 || lineId === 3 ? "TW1" : "TW38";
    const supervisor = lineData?.supervisor || `Supervisor Line ${lineId}`;
    const targetPerHour = lineData?.targetPerHour || 10;
    const targetPerDay = lineData?.targetPerDay || targetPerHour * 8;

    let actualOutput = 0;
    let totalDefects = 0;
    let bottlenecksCount = 0;
    let presentOperators = 24;
    let totalOperators = 26;

    if (lineData && Array.isArray(lineData.rows) && lineData.rows.length > 0) {
      totalOperators = lineData.rows.length;
      presentOperators = lineData.rows.filter(
        (r: any) => r.operatorAttendance === "HADIR" || !r.operatorAttendance
      ).length;

      // Sum of row hourly actuals
      const rowAvgs = lineData.rows.map((r: any) => {
        const sum = (r.hourlyActual || []).slice(0, 8).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
        return sum;
      });
      actualOutput = rowAvgs.length > 0 ? Number((rowAvgs.reduce((a: number, b: number) => a + b, 0) / rowAvgs.length).toFixed(2)) : 0;
      totalDefects = lineData.rows.reduce((sum: number, r: any) => sum + (Number(r.totalDefects) || 0), 0);
      bottlenecksCount = lineData.rows.filter(
        (r: any) => r.status === "bottleneck" || r.status === "unassigned" || (r.balanceTarget && r.balanceTarget < -5)
      ).length;
    } else {
      // Default baseline estimation if line not yet populated
      actualOutput = targetPerHour * 3.5;
      totalDefects = 2;
    }

    const efficiency = targetPerDay > 0 ? Number(((actualOutput / targetPerDay) * 100).toFixed(1)) : 0;
    const defectRate = actualOutput > 0 ? Number(((totalDefects / actualOutput) * 100).toFixed(1)) : 0;

    let status: "NORMAL" | "WARNING" | "CRITICAL" = "NORMAL";
    if (bottlenecksCount >= 3 || defectRate >= 5 || efficiency < 50) {
      status = "CRITICAL";
    } else if (bottlenecksCount > 0 || defectRate >= 2.5 || efficiency < 75) {
      status = "WARNING";
    }

    return {
      lineId,
      name: `Line ${lineId} (${location})`,
      location,
      supervisor,
      targetPerHour,
      targetPerDay,
      actualOutput,
      efficiency,
      totalDefects,
      defectRate,
      bottlenecksCount,
      presentOperators,
      totalOperators,
      status,
      lastUpdated: lineData?.lastUpdated || new Date().toISOString(),
    };
  });

  return res.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary,
    totalLines: linesList.length,
    activeMonitoringLines: summary.length,
  });
});

// 7. GET LINE DETAILS (GET /api/v1/lines/:lineId)
app.get("/api/v1/lines/:lineId", (req, res) => {
  const lineId = parseInt(req.params.lineId, 10);
  if (![1, 3, 4, 5, 6, 7].includes(lineId)) {
    return res.status(400).json({ success: false, message: `Line ${lineId} tidak valid.` });
  }

  const rawKey = extractApiKey(req);
  if (rawKey) {
    verifyApiKeyRecord(rawKey);
  }

  const lineData = productionLinesStore[lineId];
  return res.json({
    success: true,
    lineId,
    data: lineData || {
      lineId,
      message: "Data Line belum tersinkronisasi dari client. Buka aplikasi web untuk sinkronisasi awal.",
    },
  });
});

// 8. POST PRODUCTION INPUT (POST /api/v1/lines/:lineId/input)
// Accepts hourly outputs, targets, defects, or batch values via API Key
app.post("/api/v1/lines/:lineId/input", (req, res) => {
  const lineId = parseInt(req.params.lineId, 10);
  if (![1, 3, 4, 5, 6, 7].includes(lineId)) {
    return res.status(400).json({ success: false, message: `Line ${lineId} tidak valid.` });
  }

  const rawKey = extractApiKey(req);
  if (!rawKey) {
    return res.status(401).json({
      success: false,
      message: "Header 'x-api-key' atau Authorization Bearer diperlukan untuk mengirim inputan data.",
    });
  }

  const keyRecord = verifyApiKeyRecord(rawKey);
  if (!keyRecord) {
    return res.status(403).json({
      success: false,
      message: "Kunci API tidak valid atau dinonaktifkan.",
    });
  }

  if (!keyRecord.permissions.includes("write") && !keyRecord.permissions.includes("admin")) {
    return res.status(403).json({
      success: false,
      message: "Kunci API hanya memiliki izin BACA (Read-Only). Tidak diizinkan mengirim input.",
    });
  }

  if (keyRecord.role === "admin_line" && keyRecord.assignedLine && keyRecord.assignedLine !== lineId) {
    return res.status(403).json({
      success: false,
      message: `Kunci API ini hanya memiliki akses untuk Line ${keyRecord.assignedLine}, bukan Line ${lineId}.`,
    });
  }

  const {
    processNo,
    hour,
    hourIndex,
    actual,
    defect,
    targetPerHour,
    batchHour,
    batchHourIndex,
    batchValue,
  } = req.body;

  let lineObj = productionLinesStore[lineId] || {
    lineId,
    rows: [],
    targetPerHour: 10,
    targetPerDay: 80,
    lastUpdated: new Date().toISOString(),
  };

  let updateMessage = "";

  // A. Set Target / Jam
  if (typeof targetPerHour === "number" && targetPerHour >= 0) {
    lineObj.targetPerHour = Number(targetPerHour.toFixed(2));
    lineObj.targetPerDay = Number((targetPerHour * 8).toFixed(2));
    if (Array.isArray(lineObj.rows)) {
      lineObj.rows = lineObj.rows.map((r: any) => ({
        ...r,
        targetPerHour: lineObj.targetPerHour,
        target: lineObj.targetPerHour,
        balanceTarget: Number(((r.totalActual || 0) - lineObj.targetPerHour).toFixed(2)),
      }));
    }
    updateMessage = `Target/Jam Line ${lineId} diubah menjadi ${lineObj.targetPerHour} pcs/jam.`;
  }

  // B. Single Station Hourly Output
  const resolvedHourIndex =
    typeof hourIndex === "number" ? hourIndex : typeof hour === "number" ? hour - 1 : -1;

  if (processNo && resolvedHourIndex >= 0 && resolvedHourIndex < 8 && typeof actual === "number") {
    if (Array.isArray(lineObj.rows)) {
      lineObj.rows = lineObj.rows.map((r: any) => {
        if (r.no === processNo) {
          const newHourly = [...(r.hourlyActual || [0, 0, 0, 0, 0, 0, 0, 0])];
          const newDefects = [...(r.hourlyDefects || [0, 0, 0, 0, 0, 0, 0, 0])];
          newHourly[resolvedHourIndex] = Number(actual.toFixed(2));
          if (typeof defect === "number") {
            newDefects[resolvedHourIndex] = Math.max(0, defect);
          }
          const totalActual = Number(newHourly.slice(0, 8).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2));
          const totalDefects = Number(newDefects.slice(0, 8).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2));
          const target = r.targetPerHour || lineObj.targetPerHour || 10;
          const balance = Number((totalActual - target).toFixed(2));
          const isBottleneck = actual < target;

          return {
            ...r,
            hourlyActual: newHourly,
            hourlyDefects: newDefects,
            totalActual,
            totalDefects,
            balanceTarget: balance,
            status: isBottleneck ? "bottleneck" : "normal",
          };
        }
        return r;
      });
    }
    updateMessage = `Output Stasiun #${processNo} Jam ke-${resolvedHourIndex + 1} diupdate: ${actual} pcs.`;
  }

  // C. Batch Fill Output for a Given Hour
  const resolvedBatchHourIdx =
    typeof batchHourIndex === "number" ? batchHourIndex : typeof batchHour === "number" ? batchHour - 1 : -1;

  if (resolvedBatchHourIdx >= 0 && resolvedBatchHourIdx < 8 && typeof batchValue === "number") {
    if (Array.isArray(lineObj.rows)) {
      lineObj.rows = lineObj.rows.map((r: any) => {
        const newHourly = [...(r.hourlyActual || [0, 0, 0, 0, 0, 0, 0, 0])];
        newHourly[resolvedBatchHourIdx] = Number(batchValue.toFixed(2));
        const totalActual = Number(newHourly.slice(0, 8).reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2));
        return {
          ...r,
          hourlyActual: newHourly,
          totalActual,
          balanceTarget: Number((totalActual - (r.targetPerHour || lineObj.targetPerHour || 10)).toFixed(2)),
        };
      });
    }
    updateMessage = `Batch input Jam ke-${resolvedBatchHourIdx + 1} diisi ${batchValue} pcs untuk seluruh stasiun.`;
  }

  lineObj.lastUpdated = new Date().toISOString();
  lineObj.updatedBy = keyRecord.name;
  productionLinesStore[lineId] = lineObj;
  saveProductionStore(productionLinesStore);

  return res.json({
    success: true,
    message: updateMessage || `Data inputan berhasil diterima dan dicatat pada Line ${lineId}.`,
    inputtedBy: keyRecord.name,
    timestamp: lineObj.lastUpdated,
    lineData: lineObj,
  });
});

// 9. CLIENT TWO-WAY SYNC (GET & POST /api/v1/sync)
app.post("/api/v1/sync", (req, res) => {
  const { linesData } = req.body;
  if (linesData && typeof linesData === "object") {
    productionLinesStore = {
      ...productionLinesStore,
      ...linesData,
    };
    saveProductionStore(productionLinesStore);
    systemVersion = Date.now();
    return res.json({
      success: true,
      message: "Data produksi tersinkronisasi ke server.",
      timestamp: new Date().toISOString(),
      version: systemVersion,
    });
  }
  return res.status(400).json({ success: false, message: "Payload linesData tidak valid." });
});

app.get("/api/v1/sync", (_req, res) => {
  return res.json({
    success: true,
    linesData: productionLinesStore,
    timestamp: new Date().toISOString(),
    version: systemVersion,
  });
});

// ============================================================================
// CENTRALIZED MULTI-USER ACCESS & PERSISTENT DATA STORAGE ENDPOINTS (V1)
// ============================================================================

// 10. Multi-User Login Validation (Real-time against server store)
app.post("/api/v1/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan Password wajib diisi.",
    });
  }

  const trimmedUser = String(username).trim().toLowerCase();
  const trimmedPass = String(password).trim();

  // Refresh users from store
  usersStore = loadUsers();

  const matchedUser = usersStore.find((u) => {
    const uName = (u.username || "").toLowerCase();
    const fullName = (u.name || "").toLowerCase();
    const isNameMatch =
      uName === trimmedUser ||
      fullName === trimmedUser ||
      (u.role === "production_engineer" && (trimmedUser === "pe" || trimmedUser === "pe_head"));

    return isNameMatch && (u.password || "") === trimmedPass;
  });

  if (!matchedUser) {
    return res.status(401).json({
      success: false,
      message: "User atau Password tidak sesuai.",
    });
  }

  // Update lastLogin
  matchedUser.lastLogin = new Date().toISOString().replace("T", " ").substring(0, 16);
  saveUsers(usersStore);
  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Selamat datang, ${matchedUser.name}!`,
    user: matchedUser,
  });
});

// 11. Complete Central System State (For multi-device real-time hydration)
app.get("/api/v1/system/state", (_req, res) => {
  return res.json({
    success: true,
    timestamp: new Date().toISOString(),
    version: systemVersion,
    users: usersStore,
    linesData: productionLinesStore,
    operators: operatorsStore,
    linesBP: linesBPStore,
    dailyLogs: dailyLogsStore,
    navBars: navBarsStore,
  });
});

// 12. Full System Delta/Bulk Sync (Persists all inputs from any connected user)
app.post("/api/v1/system/sync", (req, res) => {
  const { linesData, operators, linesBP, dailyLogs, navBars, users } = req.body;
  let hasChanges = false;

  if (linesData && typeof linesData === "object") {
    productionLinesStore = { ...productionLinesStore, ...linesData };
    saveProductionStore(productionLinesStore);
    hasChanges = true;
  }

  if (Array.isArray(operators) && operators.length > 0) {
    operatorsStore = operators;
    saveOperators(operatorsStore);
    hasChanges = true;
  }

  if (linesBP && typeof linesBP === "object") {
    linesBPStore = { ...linesBPStore, ...linesBP };
    saveLinesBP(linesBPStore);
    hasChanges = true;
  }

  if (Array.isArray(dailyLogs)) {
    dailyLogsStore = dailyLogs;
    saveDailyLogs(dailyLogsStore);
    hasChanges = true;
  }

  if (Array.isArray(navBars) && navBars.length > 0) {
    navBarsStore = navBars;
    saveNavBars(navBarsStore);
    hasChanges = true;
  }

  if (Array.isArray(users) && users.length > 0) {
    usersStore = users;
    saveUsers(usersStore);
    hasChanges = true;
  }

  if (hasChanges) {
    systemVersion = Date.now();
  }

  return res.json({
    success: true,
    message: "Seluruh data berhasil disinkronkan ke server penyimpanan pusat.",
    timestamp: new Date().toISOString(),
    version: systemVersion,
    state: {
      users: usersStore,
      linesData: productionLinesStore,
      operators: operatorsStore,
      linesBP: linesBPStore,
      dailyLogs: dailyLogsStore,
      navBars: navBarsStore,
    },
  });
});

// 13. Users Management CRUD
app.get("/api/v1/users", (_req, res) => {
  return res.json({
    success: true,
    users: usersStore,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/v1/users", (req, res) => {
  const { username, password, name, role, assignedLine, allowedTabs, title } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({
      success: false,
      message: "Username, Password, dan Nama Lengkap wajib diisi.",
    });
  }

  const trimmedUsername = String(username).trim();
  const duplicate = usersStore.find(
    (u) => (u.username || "").toLowerCase() === trimmedUsername.toLowerCase()
  );

  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: `Username '${trimmedUsername}' sudah digunakan. Gunakan username lain.`,
    });
  }

  const newUser: User = {
    id: `user-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    username: trimmedUsername,
    password: String(password).trim(),
    name: String(name).trim(),
    role: role === "production_engineer" ? "production_engineer" : "admin_line",
    assignedLine: assignedLine ? Number(assignedLine) as LineNumber : undefined,
    allowedTabs: Array.isArray(allowedTabs) ? allowedTabs : undefined,
    title:
      title ||
      (role === "production_engineer"
        ? "Production Engineer (Akses Penuh)"
        : `Supervisor Line ${assignedLine || 1}`),
    lastLogin: "-",
  };

  usersStore = [...usersStore, newUser];
  saveUsers(usersStore);

  // Sync supervisor name to assigned line if admin_line
  if (newUser.role === "admin_line" && newUser.assignedLine) {
    const lId = newUser.assignedLine;
    if (productionLinesStore[lId]) {
      productionLinesStore[lId].supervisor = newUser.name;
      saveProductionStore(productionLinesStore);
    }
    if (linesBPStore[lId]) {
      linesBPStore[lId].metadata.supervisor = newUser.name;
      saveLinesBP(linesBPStore);
    }
  }

  systemVersion = Date.now();

  return res.status(201).json({
    success: true,
    message: `Akun '${newUser.name}' berhasil dibuat dan tersimpan di database.`,
    user: newUser,
    version: systemVersion,
  });
});

app.put("/api/v1/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, password, name, role, assignedLine, allowedTabs, title } = req.body;

  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Akun pengguna tidak ditemukan." });
  }

  const existing = usersStore[index];
  const updatedUser: User = {
    ...existing,
    username: username ? String(username).trim() : existing.username,
    password: password ? String(password).trim() : existing.password,
    name: name ? String(name).trim() : existing.name,
    role: role || existing.role,
    assignedLine: assignedLine ? (Number(assignedLine) as LineNumber) : existing.assignedLine,
    allowedTabs: Array.isArray(allowedTabs) ? allowedTabs : existing.allowedTabs,
    title: title ? String(title).trim() : existing.title,
  };

  usersStore[index] = updatedUser;
  saveUsers(usersStore);

  // Sync supervisor name to assigned line if admin_line
  if (updatedUser.role === "admin_line" && updatedUser.assignedLine) {
    const lId = updatedUser.assignedLine;
    if (productionLinesStore[lId]) {
      productionLinesStore[lId].supervisor = updatedUser.name;
      saveProductionStore(productionLinesStore);
    }
    if (linesBPStore[lId]) {
      linesBPStore[lId].metadata.supervisor = updatedUser.name;
      saveLinesBP(linesBPStore);
    }
  }

  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Akun '${updatedUser.name}' berhasil diperbarui.`,
    user: updatedUser,
    version: systemVersion,
  });
});

app.delete("/api/v1/users/:id", (req, res) => {
  const { id } = req.params;
  const target = usersStore.find((u) => u.id === id);

  if (!target) {
    return res.status(404).json({ success: false, message: "Akun tidak ditemukan." });
  }

  const peCount = usersStore.filter((u) => u.role === "production_engineer").length;
  if (target.role === "production_engineer" && peCount <= 1) {
    return res.status(400).json({
      success: false,
      message: "Minimal harus ada 1 akun Production Engineer (PE) aktif.",
    });
  }

  usersStore = usersStore.filter((u) => u.id !== id);
  saveUsers(usersStore);
  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Akun '${target.name}' berhasil dihapus.`,
    version: systemVersion,
  });
});

// 14. Operators Attendance & Management Endpoints
app.get("/api/v1/operators", (_req, res) => {
  return res.json({
    success: true,
    operators: operatorsStore,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/v1/operators/attendance", (req, res) => {
  const { operatorId, status, notes } = req.body;
  if (!operatorId || !status) {
    return res.status(400).json({ success: false, message: "operatorId dan status diperlukan." });
  }

  let matchedOpName = "";
  let opLine: number | undefined;

  operatorsStore = operatorsStore.map((op) => {
    if (op.id === operatorId) {
      matchedOpName = op.name;
      opLine = op.line;
      return {
        ...op,
        attendanceStatus: status,
        attendanceNotes: notes || (status === "HADIR" ? "" : op.attendanceNotes),
      };
    }
    return op;
  });

  saveOperators(operatorsStore);

  // Sync with productionLinesStore rows if operator is assigned
  if (opLine && productionLinesStore[opLine] && Array.isArray(productionLinesStore[opLine].rows)) {
    productionLinesStore[opLine].rows = productionLinesStore[opLine].rows.map((row: any) => {
      if (row.operatorName === matchedOpName || row.operatorId === operatorId) {
        return {
          ...row,
          operatorAttendance: status,
          status:
            status !== "HADIR"
              ? "unassigned"
              : row.balanceTarget < -10
              ? "bottleneck"
              : "normal",
        };
      }
      return row;
    });
    saveProductionStore(productionLinesStore);
  }

  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Presensi ${matchedOpName || operatorId} diupdate menjadi ${status}.`,
    version: systemVersion,
  });
});

app.post("/api/v1/operators/batch-attendance", (req, res) => {
  const { lineId, status } = req.body;
  const numLine = Number(lineId);
  const targetStatus = status || "HADIR";

  operatorsStore = operatorsStore.map((op) => {
    if (op.line === numLine) {
      return {
        ...op,
        attendanceStatus: targetStatus,
        attendanceNotes: targetStatus === "HADIR" ? "" : op.attendanceNotes,
      };
    }
    return op;
  });

  saveOperators(operatorsStore);

  if (productionLinesStore[numLine] && Array.isArray(productionLinesStore[numLine].rows)) {
    productionLinesStore[numLine].rows = productionLinesStore[numLine].rows.map((row: any) => ({
      ...row,
      operatorAttendance: targetStatus,
      status: targetStatus !== "HADIR" ? "unassigned" : "normal",
    }));
    saveProductionStore(productionLinesStore);
  }

  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Seluruh operator Line ${numLine} diset ${targetStatus}.`,
    version: systemVersion,
  });
});

// 15. Line Breakdown Processes (BP) Save
app.post("/api/v1/lines/:lineId/bp", (req, res) => {
  const lineId = parseInt(req.params.lineId, 10) as LineNumber;
  const { bp } = req.body;

  if (!bp || typeof bp !== "object") {
    return res.status(400).json({ success: false, message: "Data BP tidak valid." });
  }

  linesBPStore[lineId] = bp;
  saveLinesBP(linesBPStore);
  systemVersion = Date.now();

  return res.json({
    success: true,
    message: `Breakdown Process Line ${lineId} berhasil disimpan di server.`,
    version: systemVersion,
  });
});

// 16. Daily Report Logs Save
app.post("/api/v1/daily-logs", (req, res) => {
  const { log } = req.body;
  if (!log || !log.date || !log.lineId) {
    return res.status(400).json({ success: false, message: "Data Daily Log tidak valid." });
  }

  const index = dailyLogsStore.findIndex(
    (l) => l.date === log.date && l.lineId === log.lineId
  );

  if (index >= 0) {
    dailyLogsStore[index] = log;
  } else {
    dailyLogsStore = [log, ...dailyLogsStore];
  }

  saveDailyLogs(dailyLogsStore);
  systemVersion = Date.now();

  return res.json({
    success: true,
    message: "Laporan harian berhasil disimpan di server.",
    version: systemVersion,
  });
});

// 17. Navigation Bar Labels Save
app.post("/api/v1/nav-bars", (req, res) => {
  const { navBars } = req.body;
  if (!Array.isArray(navBars) || navBars.length === 0) {
    return res.status(400).json({ success: false, message: "Data NavBars tidak valid." });
  }

  navBarsStore = navBars;
  saveNavBars(navBarsStore);
  systemVersion = Date.now();

  return res.json({
    success: true,
    message: "Konfigurasi label navigasi berhasil disimpan di server.",
    version: systemVersion,
  });
});

// Setup Vite dev server or serve production build
async function startServer() {

  const distPath = path.join(process.cwd(), "dist");
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (process.env.NODE_ENV !== "development" && fs.existsSync(path.join(distPath, "index.html")));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT} (mode: ${isProduction ? "production" : "development"})`);
  });
}

startServer();
