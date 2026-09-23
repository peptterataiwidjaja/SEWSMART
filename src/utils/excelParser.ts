import * as XLSX from "xlsx";
import { ProcessItem, StyleMetadata, MachineRequirement, LineBPData } from "../types";
import {
  STANDARD_26_PROCESSES,
  DEFAULT_STYLE_METADATA,
} from "../data/defaultData";
import { FACTORY_MACHINE_INVENTORY } from "./lineBalancing";
import {
  getLineFactoryLocation,
  getCoLocatedLines,
  getAvailableStockForLine,
  getFactoryNormalStock,
  normalizeMachineGroupKey,
} from "../data/factoryMachineInventory";

export interface ParsedBreakdownResult {
  metadata: StyleMetadata;
  processes: ProcessItem[];
  machineRequirements: MachineRequirement[];
  totalSMV: number;
  totalSAM: number;
}

/**
 * Parse uploaded Excel or CSV file
 */
export async function parseExcelOrCsv(
  file: File,
  allowancePercentage: number = 15
): Promise<ParsedBreakdownResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let buyer = DEFAULT_STYLE_METADATA.buyer;
  let style = DEFAULT_STYLE_METADATA.style;
  let workingHours = DEFAULT_STYLE_METADATA.workingHours;
  let targetPerManpowerPerDay = DEFAULT_STYLE_METADATA.targetPerManpowerPerDay;
  let totalSMVFromHeader = 0;

  const processes: ProcessItem[] = [];
  let currentSection = "SEWING";
  let currentSubSection = "";

  // Iterate rows to scan metadata and process entries
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const firstCol = String(row[0] || "").trim();
    const secondCol = String(row[1] || "").trim();

    // Check Metadata rows
    if (firstCol.toLowerCase().includes("buyer")) {
      const match = (row[1] || row[2] || "").toString().replace(/^[:\s]+/, "");
      if (match) buyer = match;
    }
    if (firstCol.toLowerCase().includes("style")) {
      const match = (row[1] || row[2] || "").toString().replace(/^[:\s]+/, "");
      if (match) style = match;
    }
    if (firstCol.toLowerCase().includes("jam kerja")) {
      const num = parseFloat((row[1] || row[2] || "").toString().replace(/[^0-9.]/g, ""));
      if (!isNaN(num) && num > 0) workingHours = num;
    }
    if (firstCol.toLowerCase().includes("target/manpower")) {
      const num = parseFloat((row[1] || row[2] || "").toString().replace(/[^0-9.]/g, ""));
      if (!isNaN(num) && num > 0) targetPerManpowerPerDay = num;
    }
    if (firstCol.toLowerCase().includes("total smv")) {
      const smvVal = parseFloat(String(row[5] || row[4] || row[3] || "").replace(",", "."));
      if (!isNaN(smvVal)) totalSMVFromHeader = smvVal;
    }

    // Section header identification (e.g. SEWING, AUTOMACHINE, TRIMMING, HELPER)
    const upperFirst = firstCol.toUpperCase();
    if (["SEWING", "AUTOMACHINE", "TRIMMING", "HELPER"].includes(upperFirst)) {
      currentSection = upperFirst;
      continue;
    }

    // Sub-section identification (e.g., ,PITA,,,, or ,SHELL DEPAN,,,,)
    if (!firstCol && secondCol && isNaN(Number(secondCol)) && !secondCol.toLowerCase().includes("process")) {
      currentSubSection = secondCol;
      continue;
    }

      // Data Row: check if first column is numeric (No 1, 2, 3...)
    const noNum = parseInt(firstCol, 10);
    if (!isNaN(noNum) && noNum > 0) {
      const processName = String(row[1] || row[2] || "").trim();
      const machine = String(row[3] || row[2] || "SN").trim();
      const cycleTimeStr = String(row[4] || row[3] || "0").replace(",", ".");
      const smvStr = String(row[5] || row[4] || "0").replace(",", ".");

      const cycleTime = parseFloat(cycleTimeStr) || 0;
      let smv = parseFloat(smvStr) || 0;
      if (smv === 0 && cycleTime > 0) {
        smv = Number((cycleTime / 60).toFixed(2));
      }

      const sam = Number((smv * (1 + allowancePercentage / 100)).toFixed(2));

      // ATURAN STRICT: Hanya memasukkan semua kategori KECUALI Automachine dan helper untuk plot line
      if (
        isPlottableSewingProcess({
          section: currentSection,
          subSection: currentSubSection,
          process: processName,
          machine,
        })
      ) {
        processes.push({
          no: processes.length + 1,
          section: currentSection || "SEWING",
          subSection: currentSubSection,
          process: processName,
          machine: machine || "SN",
          cycleTime,
          smv,
          sam,
        });
      }
    }
  }

  // Fallback if parsing didn't find rows
  const finalProcesses = processes.length > 0 ? processes : STANDARD_26_PROCESSES.filter((p) =>
    isPlottableSewingProcess({ section: p.section, subSection: p.subSection, process: p.process, machine: p.machine })
  );
  const calculatedTotalSMV = finalProcesses.reduce((sum, p) => sum + p.smv, 0);
  const totalSMV = totalSMVFromHeader > 0 ? totalSMVFromHeader : Number(calculatedTotalSMV.toFixed(2));
  const totalSAM = Number((totalSMV * (1 + allowancePercentage / 100)).toFixed(2));

  const metadata: StyleMetadata = {
    buyer,
    style,
    workingHours,
    targetPerManpowerPerDay,
    lineTargetPerHour: targetPerManpowerPerDay,
    lineTargetPerDay: targetPerManpowerPerDay * workingHours,
    totalSMV,
    totalSAM,
    allowancePercentage,
    supervisor: DEFAULT_STYLE_METADATA.supervisor,
    qualityControl: DEFAULT_STYLE_METADATA.qualityControl,
    sampleSpv: DEFAULT_STYLE_METADATA.sampleSpv,
    rndHead: DEFAULT_STYLE_METADATA.rndHead,
    sewingDate: new Date().toISOString().split("T")[0],
    sewingDays: "Senin - Sabtu (Hari Kerja 1)",
  };

  const machineRequirements = calculateMachineRequirements(
    finalProcesses,
    metadata.lineTargetPerDay,
    workingHours,
    allowancePercentage
  );

  return {
    metadata,
    processes: finalProcesses,
    machineRequirements,
    totalSMV,
    totalSAM,
  };
}

/**
 * Filter Helper: Hanya memasukkan semua kategori KECUALI Automachine dan helper untuk plot line sewing.
 */
export function isPlottableSewingProcess(item: {
  section?: string;
  subSection?: string;
  process?: string;
  machine?: string;
}): boolean {
  const s = (item.section || "").toLowerCase().trim();
  const sub = (item.subSection || "").toLowerCase().trim();
  const p = (item.process || "").toLowerCase().trim();
  const m = (item.machine || "").toLowerCase().trim();

  // 1. Exclude Kategori & Mesin Automachine
  if (
    s.includes("automachine") ||
    s.includes("auto machine") ||
    s.includes("otomatis") ||
    sub.includes("automachine") ||
    sub.includes("auto machine") ||
    m.includes("auto") ||
    m.includes("bass") ||
    p.includes("automachine") ||
    p.includes("auto machine") ||
    p.includes("mesin otomatis")
  ) {
    return false;
  }

  // 2. Exclude Kategori & Mesin Helper (termasuk helper gosok, manual finishing, qc check, packing, trimming sisa)
  if (
    s.includes("helper") ||
    sub.includes("helper") ||
    m.includes("helper") ||
    p.includes("helper") ||
    m.includes("manual") ||
    m.includes("iron") ||
    m.includes("gosok") ||
    m.includes("meja") ||
    m.includes("qc") ||
    m.includes("hand") ||
    m.includes("packing") ||
    m.includes("trim") ||
    p.includes("ironing") ||
    p.includes("gosok") ||
    p.includes("manual") ||
    p.includes("packing") ||
    p.includes("qc check") ||
    p.includes("pemeriksaan final") ||
    p.includes("trimming benang") ||
    p.includes("buang benang") ||
    p.includes("pembersihan benang") ||
    p.includes("polybag") ||
    p.includes("hangtag") ||
    p.includes("folding") ||
    p.includes("setrika")
  ) {
    return false;
  }

  return true;
}

/**
 * Helper to check if a machine / process is a pure sewing process
 * (Excludes automachine and helper as required)
 */
export function isSewingProcessMachine(machineType: string, processName?: string): boolean {
  return isPlottableSewingProcess({ machine: machineType, process: processName });
}

/**
 * Menghitung pemakaian mesin oleh line lain di pabrik
 */
export function calculateAllLinesMachineUsage(
  allLinesBP: Record<number, LineBPData>,
  excludeLineId?: number
): Record<string, number> {
  const usage: Record<string, number> = {};
  Object.values(allLinesBP).forEach((bp) => {
    if (excludeLineId !== undefined && bp.lineId === excludeLineId) return;
    (bp.machineRequirements || []).forEach((req) => {
      const norm = normalizeMachineGroupKey(req.machineType);
      usage[norm] = (usage[norm] || 0) + req.allocatedMachines;
      if (norm !== req.machineType) {
        usage[req.machineType] = (usage[req.machineType] || 0) + req.allocatedMachines;
      }
    });
  });
  return usage;
}

/**
 * Menghitung pemakaian mesin spesifik untuk lokasi pabrik (TW1 atau TW38).
 * Aturan Lokasi:
 * - TW1: Khusus untuk Line 1 dan Line 3
 * - TW38: Khusus untuk Line 4, Line 5, Line 6, Line 7
 */
export function calculateLocationSpecificUsage(
  allLinesBP: Record<number, LineBPData>,
  currentLineId: number
): {
  location: "TW1" | "TW38";
  coLocatedLineIds: number[];
  usedByCoLocatedLines: Record<string, number>;
  usedByAllOtherLines: Record<string, number>;
  totalAllLinesUsage: Record<string, number>;
} {
  const location = getLineFactoryLocation(currentLineId);
  const coLocatedLineIds = getCoLocatedLines(currentLineId).filter((id) => id !== currentLineId);

  const usedByCoLocatedLines: Record<string, number> = {};
  const usedByAllOtherLines: Record<string, number> = {};
  const totalAllLinesUsage: Record<string, number> = {};

  Object.values(allLinesBP).forEach((bp) => {
    const isCurrent = bp.lineId === currentLineId;
    const isCoLocated = coLocatedLineIds.includes(bp.lineId);

    (bp.machineRequirements || []).forEach((req) => {
      const norm = normalizeMachineGroupKey(req.machineType);
      const qty = req.allocatedMachines || 0;

      totalAllLinesUsage[norm] = (totalAllLinesUsage[norm] || 0) + qty;
      totalAllLinesUsage[req.machineType] = (totalAllLinesUsage[req.machineType] || 0) + qty;

      if (!isCurrent) {
        usedByAllOtherLines[norm] = (usedByAllOtherLines[norm] || 0) + qty;
        usedByAllOtherLines[req.machineType] = (usedByAllOtherLines[req.machineType] || 0) + qty;
      }

      if (isCoLocated) {
        usedByCoLocatedLines[norm] = (usedByCoLocatedLines[norm] || 0) + qty;
        usedByCoLocatedLines[req.machineType] = (usedByCoLocatedLines[req.machineType] || 0) + qty;
      }
    });
  });

  return {
    location,
    coLocatedLineIds,
    usedByCoLocatedLines,
    usedByAllOtherLines,
    totalAllLinesUsage,
  };
}

/**
 * Calculate Kebutuhan Alat Jahit (Sewing Machine Requirements)
 * ATURAN KHUSUS:
 * 1. Hanya untuk proses sewing (tidak termasuk automachine dan helper).
 * 2. Total alokasi mesin pada 1 line adalah TEPAT 26 unit, disesuaikan proporsional dengan analisis kebutuhan.
 * 3. Jika lokasi di TW1, peruntukan hanya untuk Line 1 dan Line 3.
 * 4. Jika lokasi di TW38, peruntukan untuk Line 4, 5, 6, 7.
 * 5. Jika mesin sudah digunakan di line sekawan dalam lokasi yang sama, ketersediaan di lokasi berkurang.
 *
 * Formula:
 * Kebutuhan Teoretis = (Total SAM per tipe mesin * Target Harian) / (Jam Kerja * 60 * Line Efficiency)
 */
export function calculateMachineRequirements(
  processes: ProcessItem[],
  targetPerDay: number = 80,
  workingHours: number = 8,
  allowancePercentage: number = 15,
  efficiencyRatio: number = 0.85, // 85% standard line efficiency
  usedByOtherLines: Record<string, number> = {},
  currentLineId: number = 1,
  coLocatedUsage: Record<string, number> = {}
): MachineRequirement[] {
  const machineMap = new Map<string, { totalSMV: number; totalSAM: number; count: number }>();

  // Filter KHUSUS: Hanya proses sewing (exclude automachine dan helper)
  const sewingProcesses = processes.filter((p) =>
    isPlottableSewingProcess({
      section: p.section,
      subSection: p.subSection,
      process: p.process,
      machine: p.machine,
    })
  );

  sewingProcesses.forEach((p) => {
    const m = p.machine.trim();
    const current = machineMap.get(m) || { totalSMV: 0, totalSAM: 0, count: 0 };
    current.totalSMV += p.smv;
    const sam = p.sam || Number((p.smv * (1 + allowancePercentage / 100)).toFixed(2));
    current.totalSAM += sam;
    current.count += 1;
    machineMap.set(m, current);
  });

  const availableMinutes = workingHours * 60 * efficiencyRatio;

  const machineNamesMap: Record<string, string> = {
    SN: "Single Needle (Jahit Jarum 1 Lockstitch)",
    DN: "Double Needle (Jahit Jarum 2 Lockstitch)",
    "Overdeck + Cr": "Overdeck / Interlock + Corong",
    Overdeck: "Mesin Overdeck / Interlock",
    "OL 3": "Overlock 3 Benang (Obras Halus)",
    "OL 5": "Overlock 5 Benang (Obras Safety)",
    DURKOPP: "Durkopp Adler (Pasang Tangan Khusus)",
    "Button Attaching": "Mesin Pasang Kancing",
    "Button Holer": "Mesin Lubang Kancing",
    Soom: "Mesin Blindstitch / Soom",
    Bartack: "Mesin Bartack Jahit Penguat",
    Kansai: "Mesin Multi-Needle Kansai Special",
  };

  const machineTypes = Array.from(machineMap.keys());
  if (machineTypes.length === 0) {
    return [];
  }

  // Hitung theoretical machines untuk setiap tipe mesin
  const rawTheoreticalMap = new Map<string, number>();
  let totalTheoretical = 0;

  machineTypes.forEach((m) => {
    const val = machineMap.get(m)!;
    const theoretical = (val.totalSAM * targetPerDay) / availableMinutes;
    rawTheoreticalMap.set(m, theoretical);
    totalTheoretical += theoretical;
  });

  // ATURAN STRICT: JUMLAH MESIN SEDIAKAN 26 UNTUK 1 LINE SESUAI ANALISIS KEBUTUHAN
  const TARGET_TOTAL_MACHINES = 26;
  const K = machineTypes.length;
  const allocatedMap = new Map<string, number>();

  if (K >= TARGET_TOTAL_MACHINES) {
    // Jika jumlah tipe mesin >= 26 (kasus ekstrem), berikan 1 per tipe sampai 26 unit
    machineTypes
      .sort((a, b) => (rawTheoreticalMap.get(b) || 0) - (rawTheoreticalMap.get(a) || 0))
      .forEach((m, idx) => {
        allocatedMap.set(m, idx < TARGET_TOTAL_MACHINES ? 1 : 0);
      });
  } else {
    // Setiap tipe mesin minimal dialokasikan 1 unit
    machineTypes.forEach((m) => {
      allocatedMap.set(m, 1);
    });

    const remainingToDistribute = TARGET_TOTAL_MACHINES - K;

    if (totalTheoretical > 0 && remainingToDistribute > 0) {
      // Metode Largest Remainder (Hare-Niemeyer): Distribusi proporsional sesuai kebutuhan teoretis/SAM
      const quotas = machineTypes.map((m) => {
        const th = rawTheoreticalMap.get(m) || 0;
        const exactQuota = (th / totalTheoretical) * remainingToDistribute;
        const baseAdd = Math.floor(exactQuota);
        const remainder = exactQuota - baseAdd;
        return { machine: m, baseAdd, remainder, theoretical: th };
      });

      let distributedCount = 0;
      quotas.forEach((q) => {
        allocatedMap.set(q.machine, 1 + q.baseAdd);
        distributedCount += q.baseAdd;
      });

      const leftover = remainingToDistribute - distributedCount;
      // Urutkan sisa berdasarkan fraksi desimal terbesar
      quotas.sort((a, b) => {
        if (Math.abs(b.remainder - a.remainder) > 0.0001) {
          return b.remainder - a.remainder;
        }
        return b.theoretical - a.theoretical;
      });

      for (let i = 0; i < leftover; i++) {
        const targetMachine = quotas[i % quotas.length].machine;
        allocatedMap.set(targetMachine, (allocatedMap.get(targetMachine) || 1) + 1);
      }
    } else if (remainingToDistribute > 0) {
      // Jika theoretical 0, tambahkan ke tipe mesin pertama
      const primary = machineTypes[0];
      allocatedMap.set(primary, (allocatedMap.get(primary) || 1) + remainingToDistribute);
    }
  }

  // Verifikasi final total alokasi tepat 26
  let currentSum = 0;
  allocatedMap.forEach((v) => (currentSum += v));
  if (currentSum !== TARGET_TOTAL_MACHINES) {
    const diff = TARGET_TOTAL_MACHINES - currentSum;
    const sorted = [...machineTypes].sort(
      (a, b) => (rawTheoreticalMap.get(b) || 0) - (rawTheoreticalMap.get(a) || 0)
    );
    const topMachine = sorted[0] || "SN";
    allocatedMap.set(topMachine, Math.max(1, (allocatedMap.get(topMachine) || 1) + diff));
  }

  const result: MachineRequirement[] = [];

  machineTypes.forEach((machineType) => {
    const val = machineMap.get(machineType)!;
    const theoretical = rawTheoreticalMap.get(machineType) || 0;
    const allocated = allocatedMap.get(machineType) || 1;

    // ATURAN KETERSEDIAAN DI LOKASI & PABRIK (TW1 vs TW38):
    // 1. Lokasi TW1 -> Line 1 & Line 3
    // 2. Lokasi TW38 -> Line 4, 5, 6, 7
    // 3. Unit terpakai di line sekawan mengurangi stok bebas di lokasi
    const normKey = normalizeMachineGroupKey(machineType);
    const location = getLineFactoryLocation(currentLineId);

    // Ketersediaan di Lokasi Spesifik
    const locationTotalNormal = getAvailableStockForLine(normKey, currentLineId);
    const usedInCoLocated = coLocatedUsage[normKey] ?? coLocatedUsage[machineType] ?? 0;
    const locationAvailable = Math.max(0, locationTotalNormal - usedInCoLocated);
    const locationShortageOrSurplus = locationAvailable - allocated;

    // Ketersediaan Global Pabrik
    const factoryInitial =
      getFactoryNormalStock(normKey) ||
      FACTORY_MACHINE_INVENTORY[normKey]?.totalInFactory ||
      FACTORY_MACHINE_INVENTORY[machineType]?.totalInFactory ||
      locationTotalNormal ||
      12;
    const usedByOthers = usedByOtherLines[normKey] ?? usedByOtherLines[machineType] ?? 0;
    const availableInFactory = Math.max(0, factoryInitial - usedByOthers);
    const shortageOrSurplus = availableInFactory - allocated;

    result.push({
      machineType,
      displayName: machineNamesMap[machineType] || machineType,
      totalSMV: Number(val.totalSMV.toFixed(2)),
      totalSAM: Number(val.totalSAM.toFixed(2)),
      processCount: val.count,
      theoreticalMachines: Number(theoretical.toFixed(2)),
      allocatedMachines: allocated,
      availableInFactory,
      shortageOrSurplus,
      utilizationPercent: allocated > 0 ? Number(((theoretical / allocated) * 100).toFixed(1)) : 0,
      recommendedOperators: allocated,
      usedInOtherLines: usedByOthers,
      factoryTotal: factoryInitial,
      // Metadata Lokasi Pabrik (TW1 vs TW38)
      location,
      locationTotalNormal,
      usedInCoLocatedLines: usedInCoLocated,
      locationAvailable,
      locationShortageOrSurplus,
    });
  });

  result.sort((a, b) => b.allocatedMachines - a.allocatedMachines);
  return result;
}

/**
 * Export Hourly Production Control Sheet to Excel (.xlsx)
 */
export function exportProductionSheetToExcel(
  metadata: StyleMetadata,
  lineId: number,
  rows: any[]
) {
  const wb = XLSX.utils.book_new();

  // Header info
  const headerData = [
    ["HOURLY PRODUCTION CONTROL (F-SEW-005-00)"],
    ["Customer / Buyer:", metadata.buyer, "Line:", `Line ${lineId}`, "Tanggal:", metadata.sewingDate || new Date().toLocaleDateString("id-ID")],
    ["Style:", metadata.style, "Supervisor:", metadata.supervisor, "Jam Kerja:", `${metadata.workingHours} Jam`],
    ["Target / Jam:", metadata.lineTargetPerHour, "Target / Hari:", metadata.lineTargetPerDay, "Total SMV:", metadata.totalSMV, "Total SAM:", metadata.totalSAM],
    [],
    [
      "No",
      "Proses",
      "Mesin",
      "Operator",
      "Kehadiran",
      "Target/Jam",
      "Menit Kerja",
      "AKM Output",
      "AKM Stock",
      "Target",
      "+/- Target",
      "Jam 1",
      "Jam 2",
      "Jam 3",
      "Jam 4",
      "Jam 5",
      "Jam 6",
      "Jam 7",
      "Jam 8",
      "Jam 9",
      "Total",
      "Keterangan",
    ],
  ];

  const tableRows = rows.map((r) => [
    r.no,
    r.process,
    r.machine,
    r.operatorName,
    r.operatorAttendance || "HADIR",
    r.targetPerHour,
    r.workingMinutes,
    r.akmOutput,
    r.akmStock,
    r.target,
    r.balanceTarget,
    r.hourlyActual?.[0] ?? 0,
    r.hourlyActual?.[1] ?? 0,
    r.hourlyActual?.[2] ?? 0,
    r.hourlyActual?.[3] ?? 0,
    r.hourlyActual?.[4] ?? 0,
    r.hourlyActual?.[5] ?? 0,
    r.hourlyActual?.[6] ?? 0,
    r.hourlyActual?.[7] ?? 0,
    r.hourlyActual?.[8] ?? 0,
    r.totalActual,
    r.keterangan,
  ]);

  const fullData = [...headerData, ...tableRows];
  const ws = XLSX.utils.aoa_to_sheet(fullData);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 10 },
    { wch: 25 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Line ${lineId} Control`);
  XLSX.writeFile(wb, `Hourly_Production_Control_Line_${lineId}_${metadata.style.replace(/\s+/g, "_")}.xlsx`);
}
