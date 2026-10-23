import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Shield,
  Copy,
  Check,
  Plus,
  Trash2,
  Power,
  RefreshCw,
  Terminal,
  Activity,
  Send,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Tv,
  FileCode2,
} from "lucide-react";
import { ApiKeyItem, LineNumber } from "../types";

interface ApiKeyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLine?: LineNumber;
  onRefreshData?: () => void;
}

export const ApiKeyManagerModal: React.FC<ApiKeyManagerModalProps> = ({
  isOpen,
  onClose,
  currentLine = 1,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<"keys" | "tester" | "docs">("keys");
  const [keysList, setKeysList] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // New Key Form State
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyRole, setNewKeyRole] = useState<"admin_line" | "production_engineer" | "viewer">("admin_line");
  const [newKeyLine, setNewKeyLine] = useState<number>(currentLine);
  const [newKeyPermissions, setNewKeyPermissions] = useState<("read" | "write" | "admin")[]>(["read", "write"]);
  const [newKeyNotes, setNewKeyNotes] = useState("");
  const [formMsg, setFormMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Live Tester State
  const [selectedApiKey, setSelectedApiKey] = useState<string>("");
  const [testLineId, setTestLineId] = useState<number>(currentLine);
  const [testProcessNo, setTestProcessNo] = useState<number>(1);
  const [testHour, setTestHour] = useState<number>(1);
  const [testActual, setTestActual] = useState<number>(12);
  const [testDefect, setTestDefect] = useState<number>(0);
  const [testTargetPerHour, setTestTargetPerHour] = useState<number>(12);
  const [testerAction, setTesterAction] = useState<"input_hourly" | "input_target" | "get_monitoring">("get_monitoring");
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any[]>([]);

  // Fetch Keys
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/keys", {
        headers: {
          "x-api-key": "sew_live_pe_master_2026",
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.keys)) {
        setKeysList(data.keys);
        if (!selectedApiKey && data.keys.length > 0) {
          setSelectedApiKey(data.keys[0].rawKey || data.keys[0].key);
        }
      }
    } catch (e) {
      console.error("Error fetching keys:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchKeys();
      loadMonitoringSummary();
    }
  }, [isOpen]);

  const loadMonitoringSummary = async () => {
    try {
      const res = await fetch("/api/v1/monitoring", {
        headers: {
          "x-api-key": selectedApiKey || "sew_live_pe_master_2026",
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.summary)) {
        setMonitoringData(data.summary);
      }
    } catch (e) {}
  };

  // Create Key
  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!newKeyName.trim()) {
      setFormMsg({ type: "error", text: "Nama / label kunci API wajib diisi." });
      return;
    }

    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName.trim(),
          role: newKeyRole,
          assignedLine: newKeyRole === "production_engineer" || newKeyRole === "viewer" ? undefined : newKeyLine,
          permissions: newKeyPermissions,
          notes: newKeyNotes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: "success", text: `Kunci API baru berhasil dibuat: ${data.key.key}` });
        setNewKeyName("");
        setNewKeyNotes("");
        setIsAddingKey(false);
        fetchKeys();
      } else {
        setFormMsg({ type: "error", text: data.message || "Gagal membuat kunci API." });
      }
    } catch (e: any) {
      setFormMsg({ type: "error", text: e.message || "Koneksi server gagal." });
    }
  };

  // Toggle Active
  const handleToggleActive = async (keyItem: ApiKeyItem) => {
    try {
      const res = await fetch(`/api/v1/keys/${keyItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !keyItem.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setKeysList((prev) =>
          prev.map((k) => (k.id === keyItem.id ? { ...k, isActive: !k.isActive } : k))
        );
      }
    } catch (e) {}
  };

  // Delete Key
  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Cabut / hapus kunci API ini? Pengguna yang memakai kunci ini tidak akan bisa mengakses lagi.")) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/keys/${keyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setKeysList((prev) => prev.filter((k) => k.id !== keyId));
      } else {
        alert(data.message || "Gagal menghapus kunci.");
      }
    } catch (e) {}
  };

  // Copy Key to Clipboard
  const handleCopyKey = (keyString: string, keyId: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Run Tester Action
  const handleRunTester = async () => {
    setTestLoading(true);
    setTestResponse(null);

    const activeKeyToUse = selectedApiKey || "sew_live_pe_master_2026";

    try {
      if (testerAction === "get_monitoring") {
        const res = await fetch("/api/v1/monitoring", {
          headers: { "x-api-key": activeKeyToUse },
        });
        const data = await res.json();
        setTestResponse(data);
        if (data.summary) setMonitoringData(data.summary);
      } else if (testerAction === "input_hourly") {
        const res = await fetch(`/api/v1/lines/${testLineId}/input`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": activeKeyToUse,
          },
          body: JSON.stringify({
            processNo: Number(testProcessNo),
            hour: Number(testHour),
            actual: Number(testActual),
            defect: Number(testDefect),
          }),
        });
        const data = await res.json();
        setTestResponse(data);
        loadMonitoringSummary();
        if (onRefreshData) onRefreshData();
      } else if (testerAction === "input_target") {
        const res = await fetch(`/api/v1/lines/${testLineId}/input`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": activeKeyToUse,
          },
          body: JSON.stringify({
            targetPerHour: Number(testTargetPerHour),
          }),
        });
        const data = await res.json();
        setTestResponse(data);
        loadMonitoringSummary();
        if (onRefreshData) onRefreshData();
      }
    } catch (e: any) {
      setTestResponse({ error: e.message || "Request gagal" });
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  Kunci API & Integrasi Monitoring
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold border border-blue-400/30 font-mono">
                  v1 REST API
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola API Key untuk input data terotorisasi dan pemantauan hasil produksi secara real-time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("keys")}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === "keys"
                  ? "bg-white text-blue-700 border-blue-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Daftar Kunci API</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
                {keysList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("tester");
                loadMonitoringSummary();
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === "tester"
                  ? "bg-white text-blue-700 border-blue-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live API Tester & Monitoring</span>
            </button>

            <button
              onClick={() => setActiveTab("docs")}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
                activeTab === "docs"
                  ? "bg-white text-blue-700 border-blue-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 border-transparent"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Dokumentasi Endpoint</span>
            </button>
          </div>

          <button
            onClick={() => {
              fetchKeys();
              loadMonitoringSummary();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white text-xs font-semibold flex items-center space-x-1 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {formMsg && (
            <div
              className={`mb-4 p-3.5 rounded-2xl border text-xs flex items-center space-x-2.5 ${
                formMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                  : "bg-rose-50 text-rose-900 border-rose-200"
              }`}
            >
              {formMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{formMsg.text}</span>
            </div>
          )}

          {/* TAB 1: DAFTAR KUNCI API */}
          {activeTab === "keys" && (
            <div className="space-y-5">
              {/* Top Banner / Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
                    Otorisasi Akses API & Perangkat
                  </h3>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Gunakan API Key ini untuk login cepat tanpa password, atau sertakan header{" "}
                    <code className="px-1 py-0.5 bg-white rounded font-mono font-bold text-slate-900">
                      x-api-key
                    </code>{" "}
                    saat mengirim inputan dari tablet lantai produksi.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingKey(!isAddingKey)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center space-x-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingKey ? "Batal" : "Buat API Key Baru"}</span>
                </button>
              </div>

              {/* Form Tambah Key */}
              {isAddingKey && (
                <form
                  onSubmit={handleCreateKey}
                  className="bg-white p-5 rounded-2xl border-2 border-blue-400 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      <span>Form Buat Kunci API Baru</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingKey(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nama / Identitas Kunci *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Tablet Scanner Line 4"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Peran Akses (Role)
                      </label>
                      <select
                        value={newKeyRole}
                        onChange={(e) => setNewKeyRole(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="admin_line">Supervisor Line (Input & Monitor)</option>
                        <option value="production_engineer">Production Engineer (Akses Penuh Seluruh Line)</option>
                        <option value="viewer">Viewer Display (Hanya Baca / TV Monitoring)</option>
                      </select>
                    </div>

                    {newKeyRole === "admin_line" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Alokasi Line Produksi
                        </label>
                        <select
                          value={newKeyLine}
                          onChange={(e) => setNewKeyLine(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white font-mono font-bold"
                        >
                          <option value={1}>Line 1 (TW1)</option>
                          <option value={3}>Line 3 (TW1)</option>
                          <option value={4}>Line 4 (TW38)</option>
                          <option value={5}>Line 5 (TW38)</option>
                          <option value={6}>Line 6 (TW38)</option>
                          <option value={7}>Line 7 (TW38)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Catatan / Kegunaan (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Digunakan oleh QC Inspector Line 1"
                        value={newKeyNotes}
                        onChange={(e) => setNewKeyNotes(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan & Generate Kunci</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingKey(false)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              {/* Cards List of Keys */}
              <div className="space-y-3">
                {keysList.map((item) => {
                  const isMaster = item.id === "key-pe-master";
                  const displayKey = (item as any).rawKey || item.key;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.isActive
                          ? "bg-white border-slate-200 shadow-2xs hover:border-blue-300"
                          : "bg-slate-50/70 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">
                              {item.name}
                            </span>

                            {item.role === "production_engineer" ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                                PE Master
                              </span>
                            ) : item.role === "viewer" ? (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                TV Viewer
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Line {item.assignedLine || "Semua"}
                              </span>
                            )}

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {item.isActive ? "Aktif" : "Nonaktif"}
                            </span>

                            <span className="text-[10px] text-slate-400 font-mono">
                              Dipakai: {item.usageCount || 0}x
                            </span>
                          </div>

                          {/* Key Display & Copy Box */}
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex-1 flex items-center bg-slate-900 text-blue-300 px-3 py-1.5 rounded-xl font-mono text-xs border border-slate-800 select-all overflow-x-auto scrollbar-none">
                              <span className="truncate">{displayKey}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyKey(displayKey, item.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200"
                              title="Salin Kunci API"
                            >
                              {copiedKeyId === item.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>

                          {item.notes && (
                            <p className="text-[11px] text-slate-500 mt-1 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-1.5 self-end md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              item.isActive
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                            }`}
                            title={item.isActive ? "Nonaktifkan Kunci" : "Aktifkan Kunci"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {!isMaster && (
                            <button
                              type="button"
                              onClick={() => handleDeleteKey(item.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                              title="Hapus / Cabut Kunci"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE API TESTER & MONITORING */}
          {activeTab === "tester" && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Uji Coba API Langsung (Interactive Playground)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Endpoint: /api/v1/lines/:id/input & /api/v1/monitoring
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Kunci API yang Digunakan
                    </label>
                    <select
                      value={selectedApiKey}
                      onChange={(e) => setSelectedApiKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 font-mono"
                    >
                      {keysList.map((k) => (
                        <option key={k.id} value={(k as any).rawKey || k.key}>
                          {k.name} ({k.key.substring(0, 14)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Aksi Uji Coba
                    </label>
                    <select
                      value={testerAction}
                      onChange={(e) => setTesterAction(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="get_monitoring">1. Ambil Data Live Monitoring (GET)</option>
                      <option value="input_hourly">2. Kirim Output Jam Stasiun (POST)</option>
                      <option value="input_target">3. Update Target per Jam Line (POST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Target Line
                    </label>
                    <select
                      value={testLineId}
                      onChange={(e) => setTestLineId(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 font-mono font-bold"
                    >
                      <option value={1}>Line 1 (TW1)</option>
                      <option value={3}>Line 3 (TW1)</option>
                      <option value={4}>Line 4 (TW38)</option>
                      <option value={5}>Line 5 (TW38)</option>
                      <option value={6}>Line 6 (TW38)</option>
                      <option value={7}>Line 7 (TW38)</option>
                    </select>
                  </div>
                </div>

                {testerAction === "input_hourly" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Stasiun No</label>
                      <input
                        type="number"
                        min="1"
                        max="35"
                        value={testProcessNo}
                        onChange={(e) => setTestProcessNo(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Jam Ke (1-8)</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={testHour}
                        onChange={(e) => setTestHour(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Output Aktual (pcs)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={testActual}
                        onChange={(e) => setTestActual(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Defect (pcs)</label>
                      <input
                        type="number"
                        min="0"
                        value={testDefect}
                        onChange={(e) => setTestDefect(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                )}

                {testerAction === "input_target" && (
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <label className="block text-[10px] text-slate-400 mb-0.5">
                      Target / Jam Baru (pcs/jam)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={testTargetPerHour}
                      onChange={(e) => setTestTargetPerHour(Number(e.target.value))}
                      className="w-40 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white font-bold"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRunTester}
                    disabled={testLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${testLoading ? "animate-pulse" : ""}`} />
                    <span>{testLoading ? "Mengirim Request..." : "Jalankan Request API"}</span>
                  </button>
                </div>

                {/* Response Viewer */}
                {testResponse && (
                  <div className="mt-3 bg-black/80 rounded-xl p-3 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                      <span>HTTP 200 Response Payload</span>
                      <span className="text-emerald-400">Status: OK</span>
                    </div>
                    <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                      {JSON.stringify(testResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Real-time Monitoring Cards (Hasil Input Terlihat Langsung) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Tv className="w-4 h-4 text-blue-600" />
                    <span>Hasil Monitoring Produksi Real-Time (Live)</span>
                  </h4>
                  <button
                    onClick={loadMonitoringSummary}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Refresh Monitoring
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {monitoringData.map((item) => {
                    const isCritical = item.status === "CRITICAL";
                    const isWarning = item.status === "WARNING";

                    return (
                      <div
                        key={item.lineId}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCritical
                            ? "bg-rose-50/60 border-rose-300"
                            : isWarning
                            ? "bg-amber-50/60 border-amber-300"
                            : "bg-white border-slate-200 shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-slate-900">
                            {item.name}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${
                              isCritical
                                ? "bg-rose-600 text-white"
                                : isWarning
                                ? "bg-amber-600 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Target / Jam</span>
                            <span className="font-mono font-bold text-slate-800">
                              {item.targetPerHour} pcs
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Aktual Output</span>
                            <span className="font-mono font-black text-blue-700">
                              {item.actualOutput} pcs
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Efisiensi</span>
                            <span className="font-mono font-black text-slate-900">
                              {item.efficiency}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Defect</span>
                            <span className="font-mono font-bold text-rose-600">
                              {item.totalDefects} pcs
                            </span>
                          </div>
                        </div>

                        {item.bottlenecksCount > 0 && (
                          <div className="mt-2 text-[10px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">
                            ⚠️ {item.bottlenecksCount} Stasiun Bottleneck
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI ENDPOINT */}
          {activeTab === "docs" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Panduan Integrasi REST API
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Aplikasi ini menyediakan REST API lengkap untuk menerima inputan produksi dari perangkat luar
                    (tablet Android, barcode scanner, sistem ERP, mesin jahit IoT) dan menampilkan hasil monitoring secara real-time.
                  </p>
                </div>

                {/* Endpoint 1 */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-black text-[10px]">
                      GET
                    </span>
                    <code className="text-xs font-mono font-bold text-slate-900">
                      /api/v1/monitoring
                    </code>
                  </div>
                  <p className="text-xs text-slate-600">
                    Mengambil data ringkasan monitoring real-time seluruh line produksi (output, target, efisiensi, defect, status bottleneck).
                  </p>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    <code>{`curl -H "x-api-key: sew_live_pe_master_2026" \\
  https://YOUR-APP-URL/api/v1/monitoring`}</code>
                  </div>
                </div>

                {/* Endpoint 2 */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-black text-[10px]">
                      POST
                    </span>
                    <code className="text-xs font-mono font-bold text-slate-900">
                      /api/v1/lines/:lineId/input
                    </code>
                  </div>
                  <p className="text-xs text-slate-600">
                    Mengirim inputan output produksi per jam untuk stasiun tertentu.
                  </p>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    <code>{`curl -X POST https://YOUR-APP-URL/api/v1/lines/1/input \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sew_live_line1_input_2026" \\
  -d '{
    "processNo": 1,
    "hour": 3,
    "actual": 12.5,
    "defect": 0
  }'`}</code>
                  </div>
                </div>

                {/* Endpoint 3 */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-mono font-black text-[10px]">
                      POST
                    </span>
                    <code className="text-xs font-mono font-bold text-slate-900">
                      /api/v1/auth/verify-key
                    </code>
                  </div>
                  <p className="text-xs text-slate-600">
                    Verifikasi kunci API untuk otentikasi login aplikasi secara otomatis.
                  </p>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    <code>{`curl -X POST https://YOUR-APP-URL/api/v1/auth/verify-key \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey": "sew_live_line1_input_2026"}'`}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Terproteksi RBAC & API Key Middleware</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
