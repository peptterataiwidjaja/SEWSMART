import React from "react";
import {
  Layers,
  X,
  CheckCircle2,
  Users,
  Sparkles,
  Zap,
  Info,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { LineProductionData, Operator, HourlyProductionRow } from "../types";

interface MultiProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineData: LineProductionData;
  operators: Operator[];
  onApplyMultiProcessBundle?: (updatedRows: HourlyProductionRow[]) => void;
}

export const MultiProcessModal: React.FC<MultiProcessModalProps> = ({
  isOpen,
  onClose,
  lineData,
  operators,
  onApplyMultiProcessBundle,
}) => {
  if (!isOpen) return null;

  // Build operator workload mapping
  const opWorkloadMap: Record<
    string,
    { count: number; rows: HourlyProductionRow[]; totalSMV: number }
  > = {};

  lineData.rows.forEach((r) => {
    if (r.operatorName && r.operatorName !== "— KOSONG (Operator Absen) —") {
      if (!opWorkloadMap[r.operatorName]) {
        opWorkloadMap[r.operatorName] = { count: 0, rows: [], totalSMV: 0 };
      }
      opWorkloadMap[r.operatorName].count += 1;
      opWorkloadMap[r.operatorName].rows.push(r);
      opWorkloadMap[r.operatorName].totalSMV += r.smv || 0;
    }
  });

  const singleProcessOps = Object.entries(opWorkloadMap).filter(([_, w]) => w.count === 1);
  const doubleProcessOps = Object.entries(opWorkloadMap).filter(([_, w]) => w.count === 2);
  const tripleProcessOps = Object.entries(opWorkloadMap).filter(([_, w]) => w.count >= 3);

  // Auto Bundle Algorithm: Pairs small SMV operations into 2-3 processes per person
  const handleAutoBundle = () => {
    if (!onApplyMultiProcessBundle) return;

    // Clone rows
    const newRows = [...lineData.rows];
    const presentOps = operators.filter((o) => o.attendanceStatus === "HADIR");

    if (presentOps.length === 0) return;

    // Reset operators across rows and assign based on SMV balancing
    // Sort rows by SMV (high SMV get dedicated op; low SMVs get paired)
    const sortedRowIndices = newRows
      .map((r, idx) => ({ ...r, originalIdx: idx }))
      .sort((a, b) => b.smv - a.smv);

    // Operator load tracker
    const opLoads = presentOps.map((op) => ({
      op,
      assignedCount: 0,
      totalSMV: 0,
    }));

    sortedRowIndices.forEach((item) => {
      // Find operator with < 3 processes and lowest total SMV
      opLoads.sort((a, b) => {
        if (a.assignedCount >= 3 && b.assignedCount < 3) return 1;
        if (b.assignedCount >= 3 && a.assignedCount < 3) return -1;
        return a.totalSMV - b.totalSMV;
      });

      const chosen = opLoads[0];
      if (chosen && chosen.assignedCount < 3) {
        newRows[item.originalIdx] = {
          ...newRows[item.originalIdx],
          operatorId: chosen.op.id,
          operatorName: chosen.op.name,
          operatorGrade: chosen.op.grade,
          operatorAttendance: chosen.op.attendanceStatus,
          status: "normal",
        };
        chosen.assignedCount += 1;
        chosen.totalSMV += item.smv || 0;
      }
    });

    onApplyMultiProcessBundle(newRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pengaturan Multi-Proses (1 Orang Melakukan 2 - 3 Proses)
              </h3>
              <p className="text-xs text-slate-500">
                Alokasi cerdas ketika breakdown operasi melebihi 26 stasiun fisik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Information banner */}
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3 text-purple-950">
            <Info className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold">Konsep Industrial Engineering Garment:</span>
              <p className="text-[11px] leading-relaxed text-purple-900">
                Pada produk tertentu (seperti Jas, Jaket, Blazer, atau Kemeja kompleks), jumlah proses breakdown sering kali melebihi batas 26 meja fisik. Sistem memungkinkan 1 operator terampil menangani 2 hingga 3 proses ringan (Double / Triple Job) dengan menggabungkan operasi ber-SMV kecil atau mesin sejenis.
              </p>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                1 Proses Tunggal
              </span>
              <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">
                {singleProcessOps.length} Orang
              </div>
              <span className="text-[10px] text-slate-500">Standar 1 Stasiun</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">
                2 Proses (Double Job)
              </span>
              <div className="text-xl font-extrabold text-blue-700 font-mono mt-1">
                {doubleProcessOps.length} Orang
              </div>
              <span className="text-[10px] text-blue-600 font-medium">Beban SMV Terbagi</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">
                3 Proses (Triple Job)
              </span>
              <div className="text-xl font-extrabold text-purple-700 font-mono mt-1">
                {tripleProcessOps.length} Orang
              </div>
              <span className="text-[10px] text-purple-600 font-medium">Maksimal Rekomendasi</span>
            </div>
          </div>

          {/* List of Operators with 2-3 Processes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Daftar Operator yang Memegang Multi-Proses Saat Ini:
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Total {doubleProcessOps.length + tripleProcessOps.length} Operator Multi-Proses
              </span>
            </div>

            {doubleProcessOps.length === 0 && tripleProcessOps.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Semua operator saat ini memegang 1 proses tunggal.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Jika proses melebihi 26, klik tombol otomatisasi di bawah untuk mengelompokkan 2-3 proses per operator.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {[...tripleProcessOps, ...doubleProcessOps].map(([opName, data]) => {
                  const isTriple = data.count >= 3;
                  return (
                    <div
                      key={opName}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                        isTriple
                          ? "bg-purple-50/70 border-purple-200"
                          : "bg-blue-50/70 border-blue-200"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{opName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isTriple
                                ? "bg-purple-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {data.count} Proses ({isTriple ? "Triple Job" : "Double Job"})
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Total SMV: <strong>{data.totalSMV.toFixed(2)}m</strong>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex flex-wrap gap-1">
                          {data.rows.map((r) => (
                            <span
                              key={r.no}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-[10px]"
                            >
                              #{r.no} {r.process} ({r.smv ? `${r.smv}m` : `${((r.cycleTime || 45) / 60).toFixed(2)}m`} - {r.machine})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors"
          >
            Tutup
          </button>

          {onApplyMultiProcessBundle && (
            <button
              onClick={handleAutoBundle}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
              title="Otomatisasi alokasi 1 orang 2-3 proses berdasarkan waktu SMV terkecil"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Otomatisasi 1 Orang 2-3 Proses (IE Multi-Job)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
