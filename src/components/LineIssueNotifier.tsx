import React, { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Users,
  Flame,
  Wrench,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { HourlyProductionRow, Operator, LineNumber, MachineRequirement } from "../types";

export interface LineIssue {
  id: string;
  type: "unassigned" | "bottleneck" | "defect" | "output_drop" | "overload" | "machine_shortage";
  severity: "critical" | "warning" | "info";
  stationNo: number;
  process: string;
  machine: string;
  operatorName: string;
  title: string;
  description: string;
  actionText: string;
  actionType: "double_job" | "attendance" | "inspect_defect" | "multi_process" | "diagnose" | "machine_layout";
}

interface LineIssueNotifierProps {
  lineId: LineNumber;
  rows: HourlyProductionRow[];
  operators: Operator[];
  machineRequirements?: MachineRequirement[];
  alerts?: string[];
  onNavigateToAttendance?: () => void;
  onNavigateToLayout?: () => void;
  onOpenMultiProcess?: () => void;
  onOpenTargetAnalysis?: () => void;
  onSelectStation?: (stationNo: number) => void;
  onApplyDoubleJob?: (targetProcessNo: number, helperOperatorName: string) => void;
}

export const LineIssueNotifier: React.FC<LineIssueNotifierProps> = ({
  lineId,
  rows,
  operators,
  machineRequirements = [],
  alerts = [],
  onNavigateToAttendance,
  onNavigateToLayout,
  onOpenMultiProcess,
  onOpenTargetAnalysis,
  onSelectStation,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | LineIssue["type"]>("ALL");

  // Detect issues dynamically from current line row data + machine requirements
  const issues: LineIssue[] = React.useMemo(() => {
    const list: LineIssue[] = [];

    // 1. Check Unassigned / Absent Operators
    rows.forEach((row) => {
      const isAbsent = row.operatorAttendance !== "HADIR" || row.status === "unassigned";
      if (isAbsent) {
        list.push({
          id: `absent-${row.no}`,
          type: "unassigned",
          severity: "critical",
          stationNo: row.no,
          process: row.process,
          machine: row.machine,
          operatorName: row.operatorName || "Belum Ditugaskan",
          title: `Operator Tidak Masuk / Stasiun Kosong (#${row.no})`,
          description: `Stasiun #${row.no} (${row.process}) belum ada operator aktif (${row.operatorAttendance || "Kosong"}). Diperlukan penugasan Double Job atau pengganti.`,
          actionText: "Atur Penugasan Operator",
          actionType: "double_job",
        });
      }
    });

    // 2. Check Bottlenecks
    rows.forEach((row) => {
      const isBottleneck = row.status === "bottleneck";
      const isSeverelyLagging = row.balanceTarget <= -8 && row.totalActual > 0;
      if (isBottleneck || isSeverelyLagging) {
        list.push({
          id: `bottleneck-${row.no}`,
          type: "bottleneck",
          severity: "critical",
          stationNo: row.no,
          process: row.process,
          machine: row.machine,
          operatorName: row.operatorName,
          title: `Bottleneck Produksi (#${row.no})`,
          description: `Stasiun #${row.no} (${row.process}) mengalami perlambatan aliran kerja. Output: ${row.totalActual} pcs (Target: ${row.target} pcs, Defisit: ${Math.abs(row.balanceTarget)} pcs).`,
          actionText: "Bagi Beban Kerja / Tandem",
          actionType: "diagnose",
        });
      }
    });

    // 3. Check High Defects (>3 defects or rate > 3%)
    rows.forEach((row) => {
      const defectCount = row.totalDefects || 0;
      const defectRate = row.totalActual > 0 ? (defectCount / row.totalActual) * 100 : 0;
      if (defectCount >= 3 || defectRate >= 3) {
        list.push({
          id: `defect-${row.no}`,
          type: "defect",
          severity: defectCount >= 5 ? "critical" : "warning",
          stationNo: row.no,
          process: row.process,
          machine: row.machine,
          operatorName: row.operatorName,
          title: `Tingkat Cacat Tinggi (${defectCount} Pcs di Stasiun #${row.no})`,
          description: `Stasiun #${row.no} (${row.process}) menghasilkan ${defectCount} defect (${defectRate.toFixed(1)}%). Cek setelan mesin ${row.machine} dan keausan jarum.`,
          actionText: "Periksa Proses & Defect",
          actionType: "inspect_defect",
        });
      }
    });

    // 4. Check Output Drop in Running Hours
    rows.forEach((row) => {
      if (row.totalActual > 0 && row.operatorAttendance === "HADIR") {
        // Look for intermediate zero output after positive output
        const actuals = row.hourlyActual || [];
        let hadProduction = false;
        let droppedHours = 0;
        actuals.forEach((act) => {
          if (act > 0) hadProduction = true;
          else if (hadProduction && act === 0) droppedHours++;
        });

        if (droppedHours >= 2) {
          list.push({
            id: `drop-${row.no}`,
            type: "output_drop",
            severity: "warning",
            stationNo: row.no,
            process: row.process,
            machine: row.machine,
            operatorName: row.operatorName,
            title: `Output Berhenti Selama ${droppedHours} Jam (#${row.no})`,
            description: `Stasiun #${row.no} (${row.process}) mengalami penghentian output selama ${droppedHours} jam kerja. Periksa ketersediaan supply potongan atau kendala mesin.`,
            actionText: "Inspeksi Stasiun",
            actionType: "diagnose",
          });
        }
      }
    });

    // 5. Check Multi-Process Overload (>1.8 min SMV)
    rows.forEach((row) => {
      if (row.isMultiProcess && (row.combinedSMV || 0) > 1.8) {
        list.push({
          id: `overload-${row.no}`,
          type: "overload",
          severity: "warning",
          stationNo: row.no,
          process: row.process,
          machine: row.machine,
          operatorName: row.operatorName,
          title: `Beban Multi-Proses Melebihi Standar (${row.combinedSMV}m)`,
          description: `Operator ${row.operatorName} di Stasiun #${row.no} menangani ${row.multiProcessCount || 2} proses dengan total SMV ${row.combinedSMV} menit (melebihi rekomendasi 1.8 menit).`,
          actionText: "Sesuaikan Multi-Proses",
          actionType: "multi_process",
        });
      }
    });

    // 6. Check Machine Deficit / Shortage in Factory (Inventory deduction from other lines)
    if (machineRequirements && machineRequirements.length > 0) {
      machineRequirements.forEach((m) => {
        if (m.shortageOrSurplus < 0) {
          const shortageUnits = Math.abs(m.shortageOrSurplus);
          list.push({
            id: `machine-shortage-${m.machineType}`,
            type: "machine_shortage",
            severity: "critical",
            stationNo: 0,
            process: `Alokasi Mesin ${m.machineType} (${m.displayName})`,
            machine: m.machineType,
            operatorName: "Teknisi / Kepala Bagian Mekanik",
            title: `Defisit Mesin: ${m.machineType} Kurang ${shortageUnits} Unit di Pabrik!`,
            description: `Kebutuhan Line ${lineId} (${m.allocatedMachines} unit) melebihi ketersediaan sisa di pabrik (${m.availableInFactory} unit tersisa karena terpakai ${m.usedInOtherLines || 0} unit di line lain). Segera lakukan mobilisasi atau pinjam unit cadangan.`,
            actionText: "Buka Analisis Kebutuhan Mesin",
            actionType: "machine_layout",
          });
        }
      });
    }

    return list;
  }, [rows, machineRequirements, lineId]);

  const filteredIssues = React.useMemo(() => {
    if (filterType === "ALL") return issues;
    return issues.filter((i) => i.type === filterType);
  }, [issues, filterType]);

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  // If there are NO issues on this line
  if (issues.length === 0) {
    return (
      <div
        id="line-issue-notification-banner"
        className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-3 sm:p-4 text-emerald-900 text-xs shadow-2xs flex items-center justify-between transition-all"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
              <span>Status Line {lineId} Optimal &bull; Tidak Ada Masalah Terdeteksi</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Seluruh 26 stasiun terisi operator aktif, tidak ada kemacetan bottleneck, dan defect di bawah ambang batas toleransi.
            </p>
          </div>
        </div>
        {onOpenTargetAnalysis && (
          <button
            onClick={onOpenTargetAnalysis}
            className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diagnostik</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="line-issue-notification-banner"
      className="bg-white rounded-2xl border-2 border-rose-300 shadow-xs overflow-hidden transition-all animate-in fade-in"
    >
      {/* Header Notifikasi Masalah di Line */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50 px-4 py-3 border-b border-rose-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black text-rose-950 uppercase tracking-wide">
                Notifikasi Masalah di Sewing Line {lineId}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-2xs">
                {issues.length} Masalah
              </span>
            </div>
            <p className="text-[11px] text-rose-800 font-medium mt-0.5">
              {criticalCount > 0 && (
                <strong className="text-rose-900">{criticalCount} Kritis</strong>
              )}
              {criticalCount > 0 && warningCount > 0 && " &bull; "}
              {warningCount > 0 && (
                <span className="text-amber-900 font-bold">{warningCount} Peringatan</span>
              )}
              {" — "}Segera tindak lanjuti untuk menjaga stabilitas target harian.
            </p>
          </div>
        </div>

        {/* Action & Toggle Expand */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200 flex items-center space-x-1 transition-colors shadow-2xs"
          >
            <span>{isExpanded ? "Sembunyikan" : "Tampilkan Rincian"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Problem List */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* Filter categories */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="text-slate-400 mr-1">Filter:</span>
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua ({issues.length})
            </button>
            {issues.some((i) => i.type === "unassigned") && (
              <button
                onClick={() => setFilterType("unassigned")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterType === "unassigned"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Operator Absen ({issues.filter((i) => i.type === "unassigned").length})</span>
              </button>
            )}
            {issues.some((i) => i.type === "bottleneck") && (
              <button
                onClick={() => setFilterType("bottleneck")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterType === "bottleneck"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Bottleneck ({issues.filter((i) => i.type === "bottleneck").length})</span>
              </button>
            )}
            {issues.some((i) => i.type === "defect") && (
              <button
                onClick={() => setFilterType("defect")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterType === "defect"
                    ? "bg-rose-700 text-white"
                    : "bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Defect Tinggi ({issues.filter((i) => i.type === "defect").length})</span>
              </button>
            )}
            {issues.some((i) => i.type === "overload") && (
              <button
                onClick={() => setFilterType("overload")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterType === "overload"
                    ? "bg-purple-700 text-white"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Overload ({issues.filter((i) => i.type === "overload").length})</span>
              </button>
            )}
            {issues.some((i) => i.type === "machine_shortage") && (
              <button
                onClick={() => setFilterType("machine_shortage")}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterType === "machine_shortage"
                    ? "bg-red-700 text-white"
                    : "bg-red-50 text-red-900 hover:bg-red-100 border border-red-200"
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>Defisit Mesin ({issues.filter((i) => i.type === "machine_shortage").length})</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredIssues.map((issue) => {
              const isCrit = issue.severity === "critical";

              return (
                <div
                  key={issue.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isCrit
                      ? "bg-rose-50/50 border-rose-200 text-rose-950"
                      : "bg-amber-50/40 border-amber-200 text-amber-950"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isCrit ? "bg-rose-600 animate-ping" : "bg-amber-500"
                          }`}
                        />
                        <span className="font-mono text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-800">
                          Stasiun #{issue.stationNo}
                        </span>
                        <span className="font-bold text-xs">{issue.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          isCrit ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-normal">
                      {issue.description}
                    </p>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                      <span>Mesin: <strong className="text-slate-800 font-mono">{issue.machine}</strong></span>
                      <span>&bull;</span>
                      <span>Operator: <strong className="text-slate-800">{issue.operatorName}</strong></span>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (onSelectStation) {
                          onSelectStation(issue.stationNo);
                        }
                        const elem = document.getElementById(`row-station-${issue.stationNo}`);
                        if (elem) {
                          elem.scrollIntoView({ behavior: "smooth", block: "center" });
                          elem.classList.add("ring-2", "ring-rose-500", "ring-offset-2");
                          setTimeout(() => {
                            elem.classList.remove("ring-2", "ring-rose-500", "ring-offset-2");
                          }, 3000);
                        }
                      }}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 underline"
                    >
                      <span>Lihat Baris #{issue.stationNo}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {issue.actionType === "double_job" && onNavigateToAttendance && (
                      <button
                        onClick={onNavigateToAttendance}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <span>{issue.actionText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {issue.actionType === "multi_process" && onOpenMultiProcess && (
                      <button
                        onClick={onOpenMultiProcess}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <span>{issue.actionText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {issue.actionType === "diagnose" && onOpenTargetAnalysis && (
                      <button
                        onClick={onOpenTargetAnalysis}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <span>{issue.actionText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {issue.actionType === "inspect_defect" && (
                      <button
                        onClick={() => {
                          const elem = document.getElementById(`row-station-${issue.stationNo}`);
                          if (elem) {
                            elem.scrollIntoView({ behavior: "smooth", block: "center" });
                            elem.classList.add("ring-2", "ring-rose-500");
                            setTimeout(() => elem.classList.remove("ring-2", "ring-rose-500"), 3000);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <span>Cek Defect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {issue.actionType === "machine_layout" && onNavigateToLayout && (
                      <button
                        onClick={onNavigateToLayout}
                        className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{issue.actionText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
