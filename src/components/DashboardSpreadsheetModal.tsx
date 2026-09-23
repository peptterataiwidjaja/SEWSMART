import React, { useState } from "react";
import {
  FileSpreadsheet,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Send,
  Sliders,
  X,
  Sparkles,
  Layers,
  BarChart3,
  Warehouse,
  ArrowRight,
  ShieldCheck,
  Link2,
  Unlink,
} from "lucide-react";
import {
  GoogleScriptConfig,
  GoogleScriptSyncLog,
  DashboardSyncPayload,
} from "../types";
import {
  getGoogleAppsScriptTemplate,
  pingGoogleScript,
  syncDashboardToGoogleScript,
} from "../utils/googleScriptService";

interface DashboardSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleScriptConfig;
  onSaveConfig: (newConfig: GoogleScriptConfig) => void;
  onAddSyncLog?: (log: GoogleScriptSyncLog) => void;
  dashboardPayload: DashboardSyncPayload;
  onSyncSuccess?: () => void;
}

export const DashboardSpreadsheetModal: React.FC<DashboardSpreadsheetModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onAddSyncLog,
  dashboardPayload,
  onSyncSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"link" | "code" | "preview">("link");
  const [webAppUrl, setWebAppUrl] = useState(config.webAppUrl || "");
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl || "");
  const [autoSync, setAutoSync] = useState(config.autoSync || false);

  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "none" | "success" | "error";
    text: string;
  }>({ type: "none", text: "" });

  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const isConnected = !!(config.webAppUrl && config.webAppUrl.trim().startsWith("http"));
  const scriptTemplate = getGoogleAppsScriptTemplate();

  const handleSaveAndLink = () => {
    const cleanWebUrl = webAppUrl.trim();
    const cleanSheetUrl = sheetUrl.trim();

    if (!cleanWebUrl) {
      setStatusMessage({
        type: "error",
        text: "URL Aplikasi Web Google Apps Script (.gs) wajib diisi agar data dasbor dapat terkirim.",
      });
      return;
    }

    const updatedConfig: GoogleScriptConfig = {
      ...config,
      webAppUrl: cleanWebUrl,
      sheetUrl: cleanSheetUrl,
      autoSync,
      lastSyncStatus: isConnected ? config.lastSyncStatus : "idle",
    };

    onSaveConfig(updatedConfig);
    setStatusMessage({
      type: "success",
      text: "Pengaturan tautan dasbor ke Google Spreadsheet berhasil disimpan!",
    });
  };

  const handleTestConnection = async () => {
    if (!webAppUrl.trim()) {
      setStatusMessage({
        type: "error",
        text: "Masukkan URL Aplikasi Web Google Apps Script terlebih dahulu.",
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage({ type: "none", text: "" });

    try {
      const res = await pingGoogleScript(webAppUrl.trim());
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: res.message || "Koneksi Google Apps Script berhasil! Webhook siap menerima data dasbor.",
        });
        if (onAddSyncLog) {
          onAddSyncLog({
            id: String(Date.now()),
            timestamp: new Date().toLocaleTimeString("id-ID"),
            action: "TEST_PING",
            status: "success",
            message: "Uji koneksi Google Apps Script dasbor sukses",
          });
        }
      } else {
        setStatusMessage({
          type: "error",
          text: res.message || "Gagal menghubungkan ke Google Apps Script. Pastikan akses diatur 'Siapa Saja (Anyone)'.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Koneksi gagal: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncDashboardNow = async () => {
    const activeWebUrl = webAppUrl.trim() || config.webAppUrl;
    if (!activeWebUrl) {
      setStatusMessage({
        type: "error",
        text: "URL Google Apps Script belum diisi. Silakan simpan URL terlebih dahulu.",
      });
      return;
    }

    setIsSyncing(true);
    setStatusMessage({ type: "none", text: "" });

    const activeConfig: GoogleScriptConfig = {
      ...config,
      webAppUrl: activeWebUrl,
      sheetUrl: sheetUrl.trim() || config.sheetUrl,
    };

    try {
      const res = await syncDashboardToGoogleScript(activeConfig, dashboardPayload);
      if (res.success) {
        const nowStr = new Date().toLocaleString("id-ID");
        const updatedConfig: GoogleScriptConfig = {
          ...activeConfig,
          lastSyncTime: nowStr,
          lastSyncStatus: "success",
          lastSyncMessage: res.message,
        };
        onSaveConfig(updatedConfig);

        setStatusMessage({
          type: "success",
          text: res.message || "Data Dasbor PE berhasil disinkronkan ke tab DASHBOARD_PE di Google Spreadsheet!",
        });

        if (onAddSyncLog) {
          onAddSyncLog({
            id: String(Date.now()),
            timestamp: new Date().toLocaleTimeString("id-ID"),
            action: "SYNC_DASHBOARD",
            status: "success",
            message: "Sinkronisasi Dasbor PE & Pareto ke Google Spreadsheet sukses",
            recordsCount: dashboardPayload.linesSummary.length,
          });
        }

        if (onSyncSuccess) {
          onSyncSuccess();
        }
      } else {
        setStatusMessage({
          type: "error",
          text: res.message || "Gagal mengirim data dasbor ke Google Spreadsheet.",
        });
        if (onAddSyncLog) {
          onAddSyncLog({
            id: String(Date.now()),
            timestamp: new Date().toLocaleTimeString("id-ID"),
            action: "SYNC_DASHBOARD",
            status: "error",
            message: `Gagal sinkronisasi dasbor: ${res.message}`,
          });
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Terjadi kendala saat mengirim data: ${err?.message || "Kesalahan jaringan"}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptTemplate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Tautkan Dasbor ke Google Spreadsheet (via .gs)
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isConnected
                      ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/40"
                      : "bg-amber-400/20 text-amber-200 border-amber-400/40"
                  }`}
                >
                  {isConnected ? "🟢 Tertaut" : "⚪ Belum Tertaut"}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Kirim otomatis KPI Multi-Line, Pareto Defect 80/20, dan Ketersediaan Mesin TW1/TW38 ke Google Spreadsheet.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-5 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-t-xl text-xs font-bold transition-colors border-t border-x -mb-px ${
              activeTab === "link"
                ? "bg-white text-emerald-700 border-slate-200 border-b-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tautkan & Sinkronkan</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-t-xl text-xs font-bold transition-colors border-t border-x -mb-px ${
              activeTab === "code"
                ? "bg-white text-emerald-700 border-slate-200 border-b-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Kode Script (Code.gs) & Panduan</span>
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-t-xl text-xs font-bold transition-colors border-t border-x -mb-px ${
              activeTab === "preview"
                ? "bg-white text-emerald-700 border-slate-200 border-b-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Pratinjau Data Dasbor ({dashboardPayload.linesSummary.length} Line)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-5">
          {/* Status Message */}
          {statusMessage.text && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{statusMessage.text}</p>
              </div>
            </div>
          )}

          {/* TAB 1: TAUTKAN & SINKRONKAN */}
          {activeTab === "link" && (
            <div className="space-y-5">
              {/* Form Input URL */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>Pengaturan URL Google Spreadsheet & Apps Script Web App</span>
                </h3>

                {/* 1. URL Google Spreadsheet */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    URL Google Spreadsheet (Opsional, untuk link pintasan cepat):
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit"
                      className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    />
                    {sheetUrl && (
                      <a
                        href={sheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Buka Spreadsheet di Tab Baru"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Tautan Google Spreadsheet Anda. Tombol "Buka Spreadsheet" di dasbor akan langsung membuka tautan ini.
                  </p>
                </div>

                {/* 2. URL Web App Google Apps Script */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      URL Aplikasi Web Google Apps Script (Wajib):
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("code")}
                      className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Belum punya script? Lihat kode .gs di sini</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={webAppUrl}
                    onChange={(e) => setWebAppUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    URL deployment Apps Script dengan format berakhiran <code>/exec</code>. Pastikan akses dipilih <strong>"Siapa Saja (Anyone)"</strong>.
                  </p>
                </div>

                {/* Auto Sync Toggle */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        Otomatis Sinkronkan Dasbor (Auto-Sync)
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Dasbor akan otomatis mengirim pembaruan data ke Spreadsheet saat target jam-jaman atau status line diperbarui.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Buttons: Test Ping & Simpan */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !webAppUrl.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-300 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                    <span>{isTesting ? "Menguji Koneksi..." : "Uji Koneksi (.gs Ping)"}</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveAndLink}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan & Tautkan Dasbor</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Box: Sinkronkan Sekarang */}
              <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center space-x-2">
                      <Send className="w-4 h-4 text-emerald-700" />
                      <span>Kirim Data Dasbor ke Google Spreadsheet Sekarang</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Mengirim rekap 6 Sewing Line (Line 1, 3, 4, 5, 6, 7), analisis Pareto cacat jahit 80/20, dan ketersediaan mesin TW1 vs TW38 ke tab <strong>DASHBOARD_PE</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {config.lastSyncTime ? (
                      <span>Terakhir Sinkron: <strong>{config.lastSyncTime}</strong></span>
                    ) : (
                      <span>Belum ada riwayat sinkronisasi dasbor.</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncDashboardNow}
                    disabled={isSyncing || (!webAppUrl.trim() && !config.webAppUrl)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-all disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSyncing ? "animate-pulse" : ""}`} />
                    <span>{isSyncing ? "Mengirim Data ke Spreadsheet..." : "⚡ Sinkronkan Dasbor Sekarang"}</span>
                  </button>
                </div>
              </div>

              {/* Status Info Card */}
              {isConnected && sheetUrl && (
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-blue-900 font-medium">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Dasbor berhasil ditautkan ke Spreadsheet. Tab <code>DASHBOARD_PE</code> siap diakses tim manajemen.</span>
                  </div>
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Buka Spreadsheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KODE SCRIPT (CODE.GS) */}
          {activeTab === "code" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Panduan Langkah Mudah Pemasangan Script di Google Sheets:</span>
                </h4>
                <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1 pl-1">
                  <li>Buka Google Spreadsheet baru atau dokumen yang ingin ditautkan.</li>
                  <li>Di menu atas Google Sheets, klik: <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.</li>
                  <li>Hapus seluruh kode default di file <code>Code.gs</code>, lalu <strong>tempelkan seluruh kode di bawah</strong>.</li>
                  <li>Simpan proyek dengan nama <em>"Sewing Production Dashboard Webhook"</em> (Ctrl + S).</li>
                  <li>Klik tombol biru <strong>Terapkan (Deploy) &gt; Penerapan baru (New deployment)</strong> di pojok kanan atas.</li>
                  <li>Pilih jenis: <strong>Aplikasi Web (Web app)</strong>.</li>
                  <li>Pilih: Jalankan sebagai: <strong>Saya</strong>, dan Yang memiliki akses: <strong>Siapa saja (Anyone)</strong> &larr; <span className="text-amber-700 font-bold">Wajib dipilih 'Anyone' agar webhook dapat menerima data</span>.</li>
                  <li>Klik <strong>Terapkan (Deploy)</strong>, lalu salin <strong>URL Aplikasi Web</strong> (berakhiran <code>/exec</code>) dan masukkan ke tab "Tautkan &amp; Sinkronkan".</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2.5 rounded-t-xl text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Google Apps Script &bull; Code.gs (Mendukung Dasbor, Jam-Jaman, Absensi &amp; Rekap)</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Seluruh Kode .gs</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 rounded-b-xl text-[11px] font-mono overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                  {scriptTemplate}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: PRATINJAU DATA DASBOR */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                <p className="font-semibold">
                  Berikut struktur data dasbor yang akan otomatis ditulis ke tab <code>DASHBOARD_PE</code> di Google Spreadsheet Anda saat disinkronkan:
                </p>
              </div>

              {/* 1. Multi Line Summary Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2 bg-blue-900 text-white font-bold text-xs flex items-center justify-between">
                  <span>1. Tabel Performa Multi-Line Sewing (F-SEW-005)</span>
                  <span className="text-[10px] bg-blue-800 px-2 py-0.5 rounded">
                    {dashboardPayload.linesSummary.length} Line Terpantau
                  </span>
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Line</th>
                        <th className="p-2">Lokasi</th>
                        <th className="p-2">Buyer / Style</th>
                        <th className="p-2 text-right">Target</th>
                        <th className="p-2 text-right">Aktual</th>
                        <th className="p-2 text-right">Efisiensi</th>
                        <th className="p-2 text-right">Defect</th>
                        <th className="p-2 text-center">Op Hadir</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardPayload.linesSummary.map((ls) => (
                        <tr key={ls.lineId} className="hover:bg-slate-50">
                          <td className="p-2 font-bold font-mono">Line {ls.lineId}</td>
                          <td className="p-2 font-mono">{ls.location}</td>
                          <td className="p-2">{ls.buyer} &bull; {ls.style}</td>
                          <td className="p-2 text-right font-mono">{ls.targetPerDay}</td>
                          <td className="p-2 text-right font-mono font-bold text-blue-700">{ls.actualOutput}</td>
                          <td className="p-2 text-right font-mono">{ls.efficiency}%</td>
                          <td className="p-2 text-right font-mono text-rose-600">{ls.totalDefects}</td>
                          <td className="p-2 text-center font-mono">{ls.presentOperators}/{ls.totalOperators}</td>
                          <td className="p-2 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {ls.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Pareto Defects Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2 bg-rose-900 text-white font-bold text-xs flex items-center justify-between">
                  <span>2. Analisis Pareto Cacat Jahit (Prinsip 80/20)</span>
                  <span className="text-[10px] bg-rose-800 px-2 py-0.5 rounded">
                    {dashboardPayload.paretoDefects.length} Jenis Defect
                  </span>
                </div>
                <div className="overflow-x-auto max-h-40">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Rank</th>
                        <th className="p-2">Jenis Cacat</th>
                        <th className="p-2 text-right">Jumlah (Pcs)</th>
                        <th className="p-2 text-right">Persentase</th>
                        <th className="p-2 text-right">Kumulatif</th>
                        <th className="p-2 text-center">Klasifikasi 80/20</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardPayload.paretoDefects.slice(0, 5).map((pd, idx) => (
                        <tr key={pd.defect} className="hover:bg-slate-50">
                          <td className="p-2 font-mono">#{idx + 1}</td>
                          <td className="p-2 font-semibold">{pd.defect}</td>
                          <td className="p-2 text-right font-mono">{pd.count}</td>
                          <td className="p-2 text-right font-mono">{pd.percentage}%</td>
                          <td className="p-2 text-right font-mono font-bold">{pd.cumulativePercentage}%</td>
                          <td className="p-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pd.cumulativePercentage <= 80 || pd.isVitalFew
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {pd.cumulativePercentage <= 80 || pd.isVitalFew ? "VITAL FEW (80%)" : "TRIVIAL MANY (20%)"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Machine Location Summary */}
              {dashboardPayload.machineLocationSummary && dashboardPayload.machineLocationSummary.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-3.5 py-2 bg-emerald-900 text-white font-bold text-xs">
                    3. Ketersediaan Mesin Berdasarkan Lokasi (TW1 vs TW38)
                  </div>
                  <div className="p-3 text-xs divide-y divide-slate-100">
                    {dashboardPayload.machineLocationSummary.map((m) => (
                      <div key={m.location} className="py-2 flex items-center justify-between">
                        <div>
                          <strong className="font-mono text-slate-800">{m.location}</strong> ({m.allocatedLines}):
                          <span className="text-slate-600 ml-2">Total Normal: {m.totalNormal} unit</span> &bull; 
                          <span className="text-amber-700 ml-1">Terpakai: {m.usedUnits} unit</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                          Sisa: {m.remainingUnits} Unit ({m.status})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Koneksi via: <strong>Google Apps Script (.gs) Webhook</strong>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Tutup
            </button>
            {activeTab === "link" && (
              <button
                type="button"
                onClick={handleSyncDashboardNow}
                disabled={isSyncing || (!webAppUrl.trim() && !config.webAppUrl)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
