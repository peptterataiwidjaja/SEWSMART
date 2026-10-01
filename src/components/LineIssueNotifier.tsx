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
  const [isExpanded, setIsExpanded] = useState(false);
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
          operatorName: row.operatorName || "Kosong",
          title: `Operator Absen`,
          description: `${row.process} (${row.operatorAttendance || "Kosong"})`,
          actionText: "Atur Operator",
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
          title: `Bottleneck`,
          description: `${row.process} · Aktual ${row.totalActual}/${row.target} pcs`,
          actionText: "Atur Tandem",
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
          title: `Defect Tinggi (${defectCount} pcs)`,
          description: `${row.process} · ${defectRate.toFixed(1)}% defect`,
          actionText: "Cek Stasiun",
          actionType: "inspect_defect",
        });
      }
    });

    // 4. Check Output Drop in Running Hours
    rows.forEach((row) => {
      if (row.totalActual > 0 && row.operatorAttendance === "HADIR") {
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
            title: `Output Berhenti (${droppedHours} Jam)`,
            description: `${row.process}`,
            actionText: "Cek Stasiun",
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
          title: `Beban Berlebih (${row.combinedSMV}m)`,
          description: `${row.operatorName} · ${row.multiProcessCount || 2} proses`,
          actionText: "Multi-Proses",
          actionType: "multi_process",
        });
      }
    });

    // 6. Check Machine Deficit / Shortage in Factory
    if (machineRequirements && machineRequirements.length > 0) {
      machineRequirements.forEach((m) => {
        if (m.shortageOrSurplus < 0) {
          const shortageUnits = Math.abs(m.shortageOrSurplus);
          list.push({
            id: `machine-shortage-${m.machineType}`,
            type: "machine_shortage",
            severity: "critical",
            stationNo: 0,
            process: `${m.machineType} (${m.displayName})`,
            machine: m.machineType,
            operatorName: "Mekanik",
            title: `Kurang ${shortageUnits} Unit ${m.machineType}`,
            description: `Butuh ${m.allocatedMachines} unit · Tersedia ${m.availableInFactory} unit`,
            actionText: "Cek Mesin",
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
        className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-emerald-900 text-xs flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Line {lineId} Optimal · Semua 26 stasiun normal
          </span>
        </div>
        {onOpenTargetAnalysis && (
          <button
            onClick={onOpenTargetAnalysis}
            className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200 transition-colors"
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
      className="bg-white rounded-xl border border-rose-200 overflow-hidden"
    >
      {/* Compact Header */}
      <div className="bg-rose-50/70 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-bold text-rose-950">
            Line {lineId}: {issues.length} Kendala
          </span>
          <span className="text-rose-700">
            ({criticalCount > 0 ? `${criticalCount} Kritis` : ""}
            {criticalCount > 0 && warningCount > 0 ? " · " : ""}
            {warningCount > 0 ? `${warningCount} Peringatan` : ""})
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 text-rose-900 text-xs font-semibold border border-rose-200 flex items-center space-x-1 transition-colors"
        >
          <span>{isExpanded ? "Tutup" : "Lihat Rincian"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Problem List */}
      {isExpanded && (
        <div className="p-3 border-t border-rose-100 space-y-2.5">
          {/* Filter categories */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
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
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "unassigned"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100"
                }`}
              >
                Absen ({issues.filter((i) => i.type === "unassigned").length})
              </button>
            )}
            {issues.some((i) => i.type === "bottleneck") && (
              <button
                onClick={() => setFilterType("bottleneck")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "bottleneck"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                Bottleneck ({issues.filter((i) => i.type === "bottleneck").length})
              </button>
            )}
            {issues.some((i) => i.type === "defect") && (
              <button
                onClick={() => setFilterType("defect")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "defect"
                    ? "bg-rose-700 text-white"
                    : "bg-rose-50 text-rose-900 hover:bg-rose-100"
                }`}
              >
                Defect ({issues.filter((i) => i.type === "defect").length})
              </button>
            )}
            {issues.some((i) => i.type === "machine_shortage") && (
              <button
                onClick={() => setFilterType("machine_shortage")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === "machine_shortage"
                    ? "bg-red-700 text-white"
                    : "bg-red-50 text-red-900 hover:bg-red-100"
                }`}
              >
                Mesin ({issues.filter((i) => i.type === "machine_shortage").length})
              </button>
            )}
          </div>

          {/* Compact Issue Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredIssues.map((issue) => {
              const isCrit = issue.severity === "critical";

              return (
                <div
                  key={issue.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                    isCrit
                      ? "bg-rose-50/40 border-rose-200 text-slate-900"
                      : "bg-amber-50/40 border-amber-200 text-slate-900"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5 font-bold">
                      {issue.stationNo > 0 && (
                        <span className="font-mono text-slate-600">#{issue.stationNo}</span>
                      )}
                      <span className={isCrit ? "text-rose-700" : "text-amber-800"}>
                        {issue.title}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-mono text-slate-700">{issue.machine}</span>
                    </div>
                    <div className="text-slate-600 truncate mt-0.5">
                      {issue.description} · {issue.operatorName}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {issue.stationNo > 0 && (
                      <button
                        onClick={() => {
                          if (onSelectStation) onSelectStation(issue.stationNo);
                          const elem = document.getElementById(`row-station-${issue.stationNo}`);
                          if (elem) {
                            elem.scrollIntoView({ behavior: "smooth", block: "center" });
                          }
                        }}
                        className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px]"
                      >
                        Lihat
                      </button>
                    )}

                    {issue.actionType === "double_job" && onNavigateToAttendance && (
                      <button
                        onClick={onNavigateToAttendance}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded"
                      >
                        {issue.actionText}
                      </button>
                    )}

                    {issue.actionType === "multi_process" && onOpenMultiProcess && (
                      <button
                        onClick={onOpenMultiProcess}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold rounded"
                      >
                        {issue.actionText}
                      </button>
                    )}

                    {issue.actionType === "diagnose" && onOpenTargetAnalysis && (
                      <button
                        onClick={onOpenTargetAnalysis}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded"
                      >
                        {issue.actionText}
                      </button>
                    )}

                    {issue.actionType === "machine_layout" && onNavigateToLayout && (
                      <button
                        onClick={onNavigateToLayout}
                        className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white text-[11px] font-semibold rounded"
                      >
                        {issue.actionText}
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
