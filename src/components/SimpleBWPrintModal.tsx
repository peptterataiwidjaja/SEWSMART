import React, { useState } from "react";
import {
  Printer,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Table,
  Users,
  FileSpreadsheet,
  Layers,
  BarChart3,
  Building2,
  Info,
} from "lucide-react";
import {
  LineProductionData,
  StyleMetadata,
  Operator,
  ProcessItem,
  MachineRequirement,
  LineNumber,
} from "../types";

interface SimpleBWPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBar?: "hourly" | "attendance" | "excel" | "layout" | "daily" | "pe-dashboard";
  selectedLine: LineNumber;
  lineData: LineProductionData;
  metadata: StyleMetadata;
  operators: Operator[];
  processes: ProcessItem[];
  machineRequirements: MachineRequirement[];
}

export const SimpleBWPrintModal: React.FC<SimpleBWPrintModalProps> = ({
  isOpen,
  onClose,
  activeBar = "hourly",
  selectedLine,
  lineData,
  metadata,
  operators,
  processes,
  machineRequirements,
}) => {
  const [selectedPrintView, setSelectedPrintView] = useState<
    "hourly" | "attendance" | "excel" | "layout" | "daily" | "pe-dashboard"
  >(activeBar);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const lineOperators = operators.filter((o) => o.line === selectedLine);
  const hadirCount = lineOperators.filter((o) => o.attendanceStatus === "HADIR").length;
  const absentCount = lineOperators.length - hadirCount;
  const isSaturday = lineData.workSchedule === "sabtu" || lineData.workingHours === 5;
  const hoursCount = isSaturday ? 5 : 8;

  // Multi-Process calculation: check which operators do 2-3 processes
  const operatorProcessCountMap: Record<string, number> = {};
  lineData.rows.forEach((r) => {
    if (r.operatorName) {
      operatorProcessCountMap[r.operatorName] =
        (operatorProcessCountMap[r.operatorName] || 0) + 1;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none print:max-w-none print:rounded-none">
        {/* Modal Toolbar (Hidden when printing) */}
        <div className="no-print px-6 py-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Print Sederhana (Hitam Putih A4)
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300">
                  Hemat Tinta &bull; Siap Arsip
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Format bersih hitam-putih, mendukung pemecahan multi-lembar otomatis tanpa teks terpotong
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Cetak Sekarang (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Hidden when printing) */}
        <div className="no-print px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] shrink-0">
            Pilih Lembar:
          </span>
          <button
            onClick={() => setSelectedPrintView("hourly")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "hourly"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            1. Hourly Control (F-SEW-005)
          </button>
          <button
            onClick={() => setSelectedPrintView("attendance")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "attendance"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            2. Presensi & Grading (26 Op)
          </button>
          <button
            onClick={() => setSelectedPrintView("excel")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "excel"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            3. Breakdown Proses & Mesin
          </button>
          <button
            onClick={() => setSelectedPrintView("layout")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "layout"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            4. Layout 26 Stasiun
          </button>
          <button
            onClick={() => setSelectedPrintView("daily")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "daily"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            5. Rekap Laporan Harian
          </button>
          <button
            onClick={() => setSelectedPrintView("pe-dashboard")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedPrintView === "pe-dashboard"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            6. Analisis PE (Pareto & 6M)
          </button>
        </div>

        {/* Scrollable Printable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white font-sans text-black print:p-0 print:overflow-visible">
          {/* ================================================================= */}
          {/* FORMAL FACTORY BLACK & WHITE HEADER                               */}
          {/* ================================================================= */}
          <div className="border-b-2 border-black pb-3 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-black tracking-tight text-black uppercase">
                  PT. SEWSMART GARMENT INDONESIA
                </h1>
                <p className="text-xs text-black font-semibold">
                  Divisi Industrial Engineering & Quality Control &bull; Sewing Plant
                </p>
              </div>
              <div className="text-right border border-black px-3 py-1 rounded text-xs font-mono">
                <div className="font-bold">DOKUMEN PABRIK</div>
                <div>No. Form: F-SEW-005-00</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-black/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="font-bold">Line Produksi:</span> Sewing Line {selectedLine}
              </div>
              <div>
                <span className="font-bold">Tanggal:</span> {lineData.date || metadata.sewingDate}
              </div>
              <div>
                <span className="font-bold">Buyer / Style:</span> {metadata.buyer} / {metadata.style}
              </div>
              <div>
                <span className="font-bold">Jadwal Kerja:</span>{" "}
                {isSaturday ? "Sabtu (5 Jam Kerja)" : "Senin - Jumat (8 Jam Kerja)"}
              </div>
              <div>
                <span className="font-bold">Supervisor:</span> {lineData.supervisor}
              </div>
              <div>
                <span className="font-bold">QC Inspector:</span> {lineData.qcInspector}
              </div>
              <div>
                <span className="font-bold">Target / Jam:</span> {metadata.lineTargetPerHour || 10} Pcs
              </div>
              <div>
                <span className="font-bold">Kehadiran Op:</span> {hadirCount}/{lineOperators.length} Hadir
                {absentCount > 0 && ` (${absentCount} Absen)`}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: HOURLY CONTROL TABLE                                       */}
          {/* ================================================================= */}
          {selectedPrintView === "hourly" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Lembar Kontrol Hasil Produksi Per Jam (Hourly Control F-SEW-005)
                </h2>
                <span className="text-xs font-mono">Total {lineData.rows.length} Stasiun</span>
              </div>

              <table className="w-full text-[10px] border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                    <th className="border border-black p-1 w-7">No</th>
                    <th className="border border-black p-1 text-left">Nama Proses / Operasi</th>
                    <th className="border border-black p-1 w-16">Mesin</th>
                    <th className="border border-black p-1 text-left w-28">Nama Operator</th>
                    <th className="border border-black p-1 w-10">Target</th>
                    {Array.from({ length: hoursCount }, (_, i) => (
                      <th key={i} className="border border-black p-1 w-8">
                        J{i + 1}
                      </th>
                    ))}
                    <th className="border border-black p-1 w-10">Total</th>
                    <th className="border border-black p-1 w-10">Defect</th>
                    <th className="border border-black p-1 w-10">+/-</th>
                    <th className="border border-black p-1 text-left w-28">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {lineData.rows.map((row, idx) => {
                    const procCount = operatorProcessCountMap[row.operatorName] || 1;
                    const isMulti = procCount >= 2;
                    return (
                      <tr
                        key={row.no}
                        className={`border-b border-black ${idx % 2 === 1 ? "bg-gray-50" : ""}`}
                      >
                        <td className="border border-black p-1 text-center font-mono font-bold">
                          {row.no}
                        </td>
                        <td className="border border-black p-1 font-medium">
                          {row.process}
                          {isMulti && (
                            <span className="ml-1 font-bold font-mono text-[9px] border border-black px-1 rounded">
                              [{procCount} Proses]
                            </span>
                          )}
                        </td>
                        <td className="border border-black p-1 text-center font-mono">
                          {row.machine}
                        </td>
                        <td className="border border-black p-1 truncate">
                          {row.operatorName}
                        </td>
                        <td className="border border-black p-1 text-center font-mono font-bold">
                          {row.target}
                        </td>
                        {Array.from({ length: hoursCount }, (_, h) => (
                          <td key={h} className="border border-black p-1 text-center font-mono">
                            {row.hourlyActual[h] || 0}
                          </td>
                        ))}
                        <td className="border border-black p-1 text-center font-mono font-bold">
                          {row.totalActual}
                        </td>
                        <td className="border border-black p-1 text-center font-mono text-black">
                          {row.totalDefects}
                        </td>
                        <td className="border border-black p-1 text-center font-mono font-bold">
                          {row.balanceTarget > 0
                            ? `+${row.balanceTarget}`
                            : row.balanceTarget}
                        </td>
                        <td className="border border-black p-1 text-[9px] truncate">
                          {row.keterangan || (isMulti ? "Multi-Proses Operator" : "-")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-black bg-gray-200 font-bold text-center">
                    <td colSpan={4} className="border border-black p-1 text-right">
                      TOTAL HASIL LINE {selectedLine}:
                    </td>
                    <td className="border border-black p-1 font-mono">
                      {lineData.rows.reduce((s, r) => s + r.target, 0)}
                    </td>
                    {Array.from({ length: hoursCount }, (_, h) => (
                      <td key={h} className="border border-black p-1 font-mono">
                        {lineData.rows.reduce((s, r) => s + (r.hourlyActual[h] || 0), 0)}
                      </td>
                    ))}
                    <td className="border border-black p-1 font-mono">
                      {lineData.rows.reduce((s, r) => s + r.totalActual, 0)}
                    </td>
                    <td className="border border-black p-1 font-mono">
                      {lineData.rows.reduce((s, r) => s + r.totalDefects, 0)}
                    </td>
                    <td className="border border-black p-1 font-mono">
                      {lineData.rows.reduce((s, r) => s + r.balanceTarget, 0)}
                    </td>
                    <td className="border border-black p-1"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ATTENDANCE & GRADING OPERATOR TABLE                        */}
          {/* ================================================================= */}
          {selectedPrintView === "attendance" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Daftar Presensi, Grade & Alokasi Operator (Maksimal 26 Operator)
                </h2>
                <span className="text-xs font-mono">Total {lineOperators.length} Karyawan</span>
              </div>

              <table className="w-full text-xs border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-8">No</th>
                    <th className="border border-black p-1.5 w-24">NIK</th>
                    <th className="border border-black p-1.5 text-left">Nama Operator</th>
                    <th className="border border-black p-1.5 w-16">Grade</th>
                    <th className="border border-black p-1.5 w-24">Status Presensi</th>
                    <th className="border border-black p-1.5 text-left">Keahlian Utama</th>
                    <th className="border border-black p-1.5 w-16">Efisiensi</th>
                    <th className="border border-black p-1.5 w-16">Defect</th>
                    <th className="border border-black p-1.5 text-left">Alokasi Proses (Multi-Job)</th>
                  </tr>
                </thead>
                <tbody>
                  {lineOperators.map((op, idx) => {
                    const procCount = operatorProcessCountMap[op.name] || 0;
                    return (
                      <tr
                        key={op.id}
                        className={`border-b border-black ${idx % 2 === 1 ? "bg-gray-50" : ""}`}
                      >
                        <td className="border border-black p-1.5 text-center font-mono">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center font-mono">{op.nik}</td>
                        <td className="border border-black p-1.5 font-bold">{op.name}</td>
                        <td className="border border-black p-1.5 text-center font-bold font-mono">
                          Grade {op.grade}
                        </td>
                        <td className="border border-black p-1.5 text-center font-bold">
                          {op.attendanceStatus}
                        </td>
                        <td className="border border-black p-1.5">{op.primarySkill || "Single Needle"}</td>
                        <td className="border border-black p-1.5 text-center font-mono">
                          {op.efficiency}%
                        </td>
                        <td className="border border-black p-1.5 text-center font-mono">
                          {op.defectRate}%
                        </td>
                        <td className="border border-black p-1.5">
                          {procCount > 1 ? (
                            <span className="font-bold">
                              {procCount} Proses (Multi-Process / Double Job)
                            </span>
                          ) : procCount === 1 ? (
                            "1 Proses Standar"
                          ) : (
                            "Cadangan / Float"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: BREAKDOWN PROSES & KEBUTUHAN MESIN                         */}
          {/* ================================================================= */}
          {selectedPrintView === "excel" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Breakdown Operasi & Analisis Kebutuhan Mesin (Balance Pattern)
                </h2>
                <span className="text-xs font-mono">{processes.length} Operasi Breakdown</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-xs border border-black p-2 bg-gray-50">
                <div>
                  <span className="font-bold">Total SMV:</span>{" "}
                  {processes.reduce((s, p) => s + p.smv, 0).toFixed(2)} Menit
                </div>
                <div>
                  <span className="font-bold">Total SAM (Allowance 15%):</span>{" "}
                  {processes.reduce((s, p) => s + (p.sam || p.smv * 1.15), 0).toFixed(2)} Menit
                </div>
                <div>
                  <span className="font-bold">Kapasitas Maksimal Meja:</span> 26 Meja Jahit
                </div>
                <div>
                  <span className="font-bold">Strategi IE:</span>{" "}
                  {processes.length > 26
                    ? `${processes.length - 26} Proses digabung (1 Orang melakukan 2-3 Proses)`
                    : "1 Operator per 1 Proses"}
                </div>
              </div>

              <table className="w-full text-xs border-collapse border border-black">
                <thead>
                  <tr className="bg-gray-200 border-b border-black text-center font-bold">
                    <th className="border border-black p-1.5 w-8">No</th>
                    <th className="border border-black p-1.5 w-24">Bagian</th>
                    <th className="border border-black p-1.5 text-left">Nama Proses / Operasi</th>
                    <th className="border border-black p-1.5 w-28">Jenis Mesin</th>
                    <th className="border border-black p-1.5 w-16">Cycle (s)</th>
                    <th className="border border-black p-1.5 w-16">SMV</th>
                    <th className="border border-black p-1.5 w-16">SAM</th>
                    <th className="border border-black p-1.5 w-24">Rekomendasi</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((proc, idx) => (
                    <tr
                      key={proc.no}
                      className={`border-b border-black ${idx % 2 === 1 ? "bg-gray-50" : ""}`}
                    >
                      <td className="border border-black p-1.5 text-center font-mono">{proc.no}</td>
                      <td className="border border-black p-1.5 text-center">{proc.section}</td>
                      <td className="border border-black p-1.5 font-medium">{proc.process}</td>
                      <td className="border border-black p-1.5 text-center font-mono">{proc.machine}</td>
                      <td className="border border-black p-1.5 text-center font-mono">{proc.cycleTime}s</td>
                      <td className="border border-black p-1.5 text-center font-mono">{proc.smv.toFixed(2)}</td>
                      <td className="border border-black p-1.5 text-center font-mono">
                        {(proc.sam || proc.smv * 1.15).toFixed(2)}
                      </td>
                      <td className="border border-black p-1.5 text-center font-mono text-[11px]">
                        {proc.no > 26 ? "Bundled (Multi-Op)" : "Meja Standar"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: LAYOUT 26 STASIUN                                          */}
          {/* ================================================================= */}
          {selectedPrintView === "layout" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Tata Letak Mesin & Alur Produksi (Layout 26 Meja Line {selectedLine})
                </h2>
                <span className="text-xs font-mono">26 Stasiun Fisik</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {Array.from({ length: 26 }, (_, i) => {
                  const stNo = i + 1;
                  const row = lineData.rows[i];
                  return (
                    <div
                      key={stNo}
                      className="border border-black p-2 rounded bg-white flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <span className="border border-black px-1.5 py-0.2 rounded font-mono">
                            Meja #{stNo}
                          </span>
                          <span>{row ? row.machine : "SN"}</span>
                        </div>
                        <div className="font-medium text-black mt-1">
                          {row ? row.process : `Proses Stasiun ${stNo}`}
                        </div>
                        <div className="text-[11px] text-gray-700">
                          Operator: <strong>{row ? row.operatorName : "-"}</strong>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <div>Target: {row ? row.target : 80}</div>
                        <div>Hasil: {row ? row.totalActual : 0}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: REKAP LAPORAN HARIAN                                       */}
          {/* ================================================================= */}
          {selectedPrintView === "daily" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Rekapitulasi Hasil Laporan Harian & Kualitas Sewing Line {selectedLine}
                </h2>
                <span className="text-xs font-mono">Status Harian</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                <div className="border border-black p-3 text-center">
                  <div className="text-[11px] font-bold text-gray-600">TOTAL OUTPUT ACTUAL</div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {lineData.rows.reduce((s, r) => s + r.totalActual, 0)} Pcs
                  </div>
                </div>
                <div className="border border-black p-3 text-center">
                  <div className="text-[11px] font-bold text-gray-600">TOTAL CACAT / DEFECT</div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {lineData.rows.reduce((s, r) => s + r.totalDefects, 0)} Pcs
                  </div>
                </div>
                <div className="border border-black p-3 text-center">
                  <div className="text-[11px] font-bold text-gray-600">EFISIENSI LINE RATA-RATA</div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {lineData.rows.reduce((s, r) => s + r.target, 0) > 0
                      ? Math.round(
                          (lineData.rows.reduce((s, r) => s + r.totalActual, 0) /
                            lineData.rows.reduce((s, r) => s + r.target, 0)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: ANALISIS PE (PARETO & 6M)                                  */}
          {/* ================================================================= */}
          {selectedPrintView === "pe-dashboard" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Analisis Kualitas PE & Tindakan Korektif (Pareto Defect & 6M)
                </h2>
                <span className="text-xs font-mono">PE Engineering Sheet</span>
              </div>

              <div className="border border-black p-3 mb-3">
                <h3 className="font-bold text-xs uppercase mb-2">5 Cacat Terbesar (Pareto Defect):</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="border border-black p-2 text-center">
                    <div className="font-bold">Jahitan Loncat</div>
                    <div className="text-lg font-mono font-bold mt-1">42%</div>
                  </div>
                  <div className="border border-black p-2 text-center">
                    <div className="font-bold">Kerapatan Berubah</div>
                    <div className="text-lg font-mono font-bold mt-1">26%</div>
                  </div>
                  <div className="border border-black p-2 text-center">
                    <div className="font-bold">Puckering / Kerut</div>
                    <div className="text-lg font-mono font-bold mt-1">15%</div>
                  </div>
                  <div className="border border-black p-2 text-center">
                    <div className="font-bold">Kotor Minyak</div>
                    <div className="text-lg font-mono font-bold mt-1">10%</div>
                  </div>
                  <div className="border border-black p-2 text-center">
                    <div className="font-bold">Beda Ukuran</div>
                    <div className="text-lg font-mono font-bold mt-1">7%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* FORMAL SIGNATURE BLOCKS (TANDA TANGAN PENGESAHAN)                 */}
          {/* ================================================================= */}
          <div className="avoid-break mt-8 pt-4 border-t-2 border-black">
            <div className="text-xs font-bold uppercase mb-4 text-center">
              Pengesahan Lembar Kerja Produksi &bull; Sewing Line {selectedLine}
            </div>

            <div className="grid grid-cols-4 gap-4 text-center text-xs">
              <div className="border border-black p-2 rounded">
                <div className="font-bold text-gray-700">Dibuat Oleh:</div>
                <div className="h-14"></div>
                <div className="font-bold border-t border-black pt-1">
                  Admin Line {selectedLine}
                </div>
                <div className="text-[10px] text-gray-600">Admin Sewing</div>
              </div>

              <div className="border border-black p-2 rounded">
                <div className="font-bold text-gray-700">Diperiksa Oleh:</div>
                <div className="h-14"></div>
                <div className="font-bold border-t border-black pt-1">
                  {lineData.qcInspector || "Fylaily Izmi"}
                </div>
                <div className="text-[10px] text-gray-600">QC Line Inspector</div>
              </div>

              <div className="border border-black p-2 rounded">
                <div className="font-bold text-gray-700">Disetujui Oleh:</div>
                <div className="h-14"></div>
                <div className="font-bold border-t border-black pt-1">
                  {lineData.supervisor || "Supervisor"}
                </div>
                <div className="text-[10px] text-gray-600">Supervisor Sewing</div>
              </div>

              <div className="border border-black p-2 rounded">
                <div className="font-bold text-gray-700">Mengetahui:</div>
                <div className="h-14"></div>
                <div className="font-bold border-t border-black pt-1">
                  Fikri Putra, S.T.
                </div>
                <div className="text-[10px] text-gray-600">PE Engineering Head</div>
              </div>
            </div>

            <div className="text-center text-[9px] text-gray-500 mt-4">
              Dicetak secara digital melalui SewSmart Pro IE System &bull; Dokumen sah operasional pabrik garment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
