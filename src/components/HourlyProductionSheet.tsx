import React, { useState } from "react";
import {
  HourlyProductionRow,
  StyleMetadata,
  LineProductionData,
  Operator,
  User,
  MachineRequirement,
} from "../types";
import {
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  Minus,
  Download,
  Flame,
  Award,
  Settings,
  Clock,
  Edit2,
  Lock,
  Printer,
  Calendar,
  Users,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  TrendingDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Info,
  BellRing,
  Volume2,
  VolumeX,
  Wrench,
  ArrowDown,
} from "lucide-react";
import { exportProductionSheetToExcel } from "../utils/excelParser";
import { getGradeBadge } from "../utils/grading";
import {
  formatIndoDate,
  formatIndoDateWithDay,
  offsetDate,
} from "../utils/dateUtils";
import { MultiProcessModal } from "./MultiProcessModal";
import { LineIssueNotifier } from "./LineIssueNotifier";

interface HourlyProductionSheetProps {
  metadata: StyleMetadata;
  lineData: LineProductionData;
  operators: Operator[];
  currentUser: User;
  workSchedule?: "senin_jumat" | "sabtu";
  onToggleWorkSchedule?: (schedule: "senin_jumat" | "sabtu") => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onClearLineHourlyData?: () => void;
  onApplyDoubleJob?: (stationNo: number, candidateOpName: string, originStationNo: number) => void;
  onApplyTandem?: (stationNo: number, op1Name: string, op2Name: string) => void;
  onUpdateHourlyOutput: (
    processNo: number,
    hourIndex: number,
    newActual: number,
    newDefect: number
  ) => void;
  onUpdateRowDefects?: (processNo: number, newDefects: number) => void;
  onUpdateLineTargetPerHour?: (newTargetPerHour: number, autoFillActiveHours?: boolean) => void;
  onUpdateRowTargetPerHour?: (processNo: number, newRowTarget: number) => void;
  onUpdateProcessAssignment?: (
    processNo: number,
    operatorName: string,
    machineName: string
  ) => void;
  onOpenPrintReport?: () => void;
  onOpenSimpleBWPrint?: () => void;
  onApplyMultiProcessBundle?: (updatedRows: HourlyProductionRow[]) => void;
  onUpdateSewingSchedule?: (date: string, days: string) => void;
  onNavigateToAttendance?: () => void;
  onNavigateToLayout?: () => void;
  onNavigateToPEDashboard?: () => void;
  isAlarmCancelledByPE?: boolean;
  onOpenGoogleScript?: () => void;
  isGoogleScriptConnected?: boolean;
  machineRequirements?: MachineRequirement[];
  alerts?: string[];
}

export const HourlyProductionSheet: React.FC<HourlyProductionSheetProps> = ({
  metadata,
  lineData,
  operators,
  currentUser,
  workSchedule = "senin_jumat",
  onToggleWorkSchedule,
  selectedDate,
  onSelectDate,
  onClearLineHourlyData,
  onApplyDoubleJob,
  onApplyTandem,
  onUpdateHourlyOutput,
  onUpdateRowDefects,
  onUpdateLineTargetPerHour,
  onUpdateRowTargetPerHour,
  onUpdateProcessAssignment,
  onOpenPrintReport,
  onOpenSimpleBWPrint,
  onApplyMultiProcessBundle,
  onUpdateSewingSchedule,
  onNavigateToAttendance,
  onNavigateToLayout,
  onNavigateToPEDashboard,
  isAlarmCancelledByPE = false,
  onOpenGoogleScript,
  isGoogleScriptConnected = false,
  machineRequirements = [],
  alerts = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [editingCell, setEditingCell] = useState<{ processNo: number; hourIndex: number } | null>(null);
  const [editingDefectRow, setEditingDefectRow] = useState<number | null>(null);
  const [editingTargetRow, setEditingTargetRow] = useState<number | null>(null);
  const [autoFillHoursOnTarget, setAutoFillHoursOnTarget] = useState<boolean>(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isMultiProcessModalOpen, setIsMultiProcessModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Helper pembatas maksimal 2 digit di belakang koma
  const fmt2 = (val: number | undefined | null): number =>
    Number((Number(val) || 0).toFixed(2));

  // Calculate operator workload (how many processes each person handles: 1, 2, or 3)
  const operatorWorkloadMap = React.useMemo(() => {
    const map: Record<string, { count: number; processes: string[]; totalSMV: number }> = {};
    lineData.rows.forEach((r) => {
      if (r.operatorName && r.operatorName !== "— KOSONG (Operator Absen) —") {
        if (!map[r.operatorName]) {
          map[r.operatorName] = { count: 0, processes: [], totalSMV: 0 };
        }
        map[r.operatorName].count += 1;
        map[r.operatorName].processes.push(r.process);
        map[r.operatorName].totalSMV += r.smv || 0;
      }
    });
    return map;
  }, [lineData.rows]);

  const multiProcessOpsCount = React.useMemo(() => {
    const list = Object.values(operatorWorkloadMap) as Array<{ count: number; processes: string[]; totalSMV: number }>;
    return list.filter((w) => w.count >= 2).length;
  }, [operatorWorkloadMap]);

  // Edit process assignment modal
  const [adjustingProcess, setAdjustingProcess] = useState<{
    no: number;
    process: string;
    section: string;
    machine: string;
    operatorName: string;
  } | null>(null);

  // Quick batch hour input modal
  const [batchHourModal, setBatchHourModal] = useState<number | null>(null);
  const [batchHourCustomVal, setBatchHourCustomVal] = useState<string>("");

  // Check authorization
  const canEditCurrentLine =
    currentUser.role === "production_engineer" ||
    currentUser.assignedLine === lineData.lineId;

  // Active working hours: 5 for Saturday, 8 for Mon-Fri
  const activeWorkingHours = workSchedule === "sabtu" ? 5 : 8;

  // Derive unique sections
  const sections = ["ALL", ...Array.from(new Set(lineData.rows.map((r) => r.section)))];

  // Attendance metrics for this line
  const totalOps = operators.length;
  const hadirOps = operators.filter((o) => o.attendanceStatus === "HADIR").length;
  const absentOps = totalOps - hadirOps;

  // Filter rows
  const filteredRows = lineData.rows.filter((row) => {
    const matchesSearch =
      row.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.no.toString().includes(searchTerm);

    const matchesSection = selectedSection === "ALL" || row.section === selectedSection;

    return matchesSearch && matchesSection;
  });

  // Determine highest active inputted hour index (0..7) across the line
  const maxFilledHourIdx = React.useMemo(() => {
    let maxIdx = -1;
    lineData.rows.forEach((r) => {
      r.hourlyActual.slice(0, activeWorkingHours).forEach((val, idx) => {
        if ((Number(val) || 0) > 0 && idx > maxIdx) {
          maxIdx = idx;
        }
      });
    });
    return maxIdx;
  }, [lineData.rows, activeWorkingHours]);

  // Jam berlaku: jumlah jam berjalan yang sudah diinput, atau jam kerja aktif (8/5 jam)
  const jamBerlaku = maxFilledHourIdx >= 0 ? maxFilledHourIdx + 1 : activeWorkingHours;

  // Calculate hourly averages and totals (dibulatkan maks 2 digit di belakang koma)
  const totalActualSum = fmt2(
    lineData.rows.reduce(
      (sum, r) => sum + r.hourlyActual.slice(0, 8).reduce((a, b) => a + (Number(b) || 0), 0),
      0
    )
  );

  // Average target per hour (Target / Jam) - maks 2 digit di belakang koma
  const avgTargetPerHour =
    lineData.rows.length > 0
      ? fmt2(
          lineData.rows.reduce(
            (sum, r) => sum + (r.targetPerHour || metadata.lineTargetPerHour || 10),
            0
          ) / lineData.rows.length
        )
      : fmt2(metadata.lineTargetPerHour || 10);

  const [targetInputStr, setTargetInputStr] = useState<string>(String(avgTargetPerHour));
  React.useEffect(() => {
    setTargetInputStr(String(avgTargetPerHour));
  }, [avgTargetPerHour, lineData.lineId]);

  // Average actual output per inputted hour across the line (maks 2 digit di belakang koma)
  const avgActualPerHour = React.useMemo(() => {
    if (lineData.rows.length === 0 || maxFilledHourIdx < 0) return 0;
    const activeHoursCount = maxFilledHourIdx + 1;
    const totalAcrossActiveHours = lineData.rows.reduce((sum, r) => {
      const rowSum = r.hourlyActual
        .slice(0, activeHoursCount)
        .reduce((a, b) => a + (Number(b) || 0), 0);
      return sum + rowSum / activeHoursCount;
    }, 0);
    return fmt2(totalAcrossActiveHours / lineData.rows.length);
  }, [lineData.rows, maxFilledHourIdx]);

  const totalBalancePerHour = fmt2(avgActualPerHour - avgTargetPerHour);
  const totalDefectsSum = fmt2(
    lineData.rows.reduce((sum, r) => sum + (Number(r.totalDefects) || 0), 0)
  );

  // Real-time Bottleneck Detection & Solution Analysis from SMV & Jam Berlaku
  const bottleneckAnalysis = React.useMemo(() => {
    const allowancePct = metadata.allowancePercentage || 15;

    const problematicStations = lineData.rows.filter((r) => {
      const isAbsent = r.operatorAttendance !== "HADIR" || r.status === "unassigned";
      const isBottleneck = r.status === "bottleneck";
      const targetPerHr = r.targetPerHour || metadata.lineTargetPerHour || 10;
      const smv = r.smv || 0.75;
      const sam = smv * (1 + allowancePct / 100);
      const kapasitasSmvPerJam = smv > 0 ? 60 / smv : 0;
      const kapasitasSamPerJam = sam > 0 ? 60 / sam : 0;

      // Perhitungan SMV dengan jam berlaku: apakah kapasitas SMV mampu mencapai target per jam
      const isSmvCapacityShort =
        !r.isTandem &&
        !r.isDoubleJob &&
        (kapasitasSmvPerJam < targetPerHr ||
          kapasitasSamPerJam < targetPerHr ||
          (r.cycleTime || 0) >= 85 ||
          smv >= 1.4);

      // Cek apakah ada jam pada jam berlaku yang aktualnya tidak sesuai (< target per jam)
      const hasHourBelowTarget = r.hourlyActual
        .slice(0, activeWorkingHours)
        .some((val, idx) => {
          const num = Number(val) || 0;
          if (num > 0 && num < targetPerHr) return true;
          if (maxFilledHourIdx >= 0 && idx <= maxFilledHourIdx && num < targetPerHr) return true;
          return false;
        });

      return isAbsent || isBottleneck || isSmvCapacityShort || hasHourBelowTarget;
    });

    // Stasiun yang memicu ALARM pada Jam ke-3 (hanya aktif ketika Jam ke-3 sudah berjalan/diinput, yaitu maxFilledHourIdx >= 2)
    const jam3BottleneckStations =
      maxFilledHourIdx < 2
        ? []
        : lineData.rows.filter((r) => {
            const isAbsent = r.operatorAttendance !== "HADIR" || r.status === "unassigned";
            const targetPerHr = r.targetPerHour || metadata.lineTargetPerHour || 10;
            const smv = r.smv || 0.75;
            const sam = smv * (1 + allowancePct / 100);
            const isSmvShort =
              !r.isTandem &&
              !r.isDoubleJob &&
              (60 / smv < targetPerHr || 60 / sam < targetPerHr || (r.cycleTime || 0) >= 85 || smv >= 1.4);

            const jam3Val = Number(r.hourlyActual[2]) || 0;
            const isJam3BelowTarget = jam3Val < targetPerHr;
            const hasHourFromJam3BelowTarget = r.hourlyActual
              .slice(2, maxFilledHourIdx + 1)
              .some((val) => (Number(val) || 0) < targetPerHr);

            return (
              isJam3BelowTarget ||
              hasHourFromJam3BelowTarget ||
              ((isAbsent || isSmvShort || r.status === "bottleneck") && isJam3BelowTarget)
            );
          });

    const presentOpsWithSMV = lineData.rows
      .filter(
        (r) =>
          r.operatorAttendance === "HADIR" &&
          !r.isDoubleJob &&
          r.status !== "unassigned" &&
          r.status !== "bottleneck"
      )
      .map((r) => ({
        operatorName: r.operatorName,
        stationNo: r.no,
        process: r.process,
        smv: r.smv || 0.5,
      }))
      .sort((a, b) => a.smv - b.smv);

    return {
      problematicStations,
      jam3BottleneckStations,
      smallestSMVOperators: presentOpsWithSMV,
      isFreshState: totalActualSum === 0,
    };
  }, [lineData.rows, totalActualSum, metadata.lineTargetPerHour, metadata.allowancePercentage, activeWorkingHours, maxFilledHourIdx]);

  const bottlenecksCount = bottleneckAnalysis.problematicStations.length;
  const jam3AlarmCount = bottleneckAnalysis.jam3BottleneckStations.length;
  const unassignedCount = lineData.rows.filter((r) => r.status === "unassigned").length;

  const handleFixAllBottlenecks = () => {
    const helperCandidate = bottleneckAnalysis.smallestSMVOperators[0];
    bottleneckAnalysis.problematicStations.forEach((st, idx) => {
      const cand =
        bottleneckAnalysis.smallestSMVOperators[
          idx % Math.max(1, bottleneckAnalysis.smallestSMVOperators.length)
        ] || helperCandidate;
      if (
        (st.status === "unassigned" || st.operatorAttendance !== "HADIR") &&
        cand &&
        onApplyDoubleJob
      ) {
        onApplyDoubleJob(st.no, cand.operatorName, cand.stationNo);
      } else if (onApplyTandem) {
        onApplyTandem(
          st.no,
          st.operatorName,
          cand ? cand.operatorName : "Helper Tandem"
        );
      }
    });
    showNotification(
      `Seluruh ${bottlenecksCount} stasiun bottleneck berhasil diperbaiki langsung!`
    );
  };

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Active Running Process Date Handling
  const activeDate = selectedDate || lineData.date || "2026-09-14";

  const todayStr = React.useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const isToday = activeDate === todayStr;

  const handleDateChange = (newDate: string) => {
    if (!newDate) return;
    if (onSelectDate) {
      onSelectDate(newDate);
    }
    showNotification(`Tanggal proses dialihkan ke: ${formatIndoDateWithDay(newDate)}`);
  };

  const handlePrevDay = () => {
    const prev = offsetDate(activeDate, -1);
    handleDateChange(prev);
  };

  const handleNextDay = () => {
    const next = offsetDate(activeDate, 1);
    handleDateChange(next);
  };

  const handleSetToday = () => {
    handleDateChange(todayStr);
  };

  const handleSetYesterday = () => {
    const yesterday = offsetDate(todayStr, -1);
    handleDateChange(yesterday);
  };

  // Check day of week for activeDate
  const activeDateObj = new Date(activeDate + "T00:00:00");
  const dayOfWeek = !isNaN(activeDateObj.getTime()) ? activeDateObj.getDay() : 1;
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

  return (
    <div className="space-y-4">
      {/* Unified Header & Date Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            L{lineData.lineId}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Line {lineData.lineId} &bull; Kontrol Jam
              </h2>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                {formatIndoDateWithDay(activeDate)}
              </span>
              {isToday && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Hari Ini</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls: Date Stepper, Schedule Toggle, Attendance & Print */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Compact Date Stepper */}
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-all"
              title="Hari sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={activeDate}
              onChange={(e) => {
                if (e.target.value) handleDateChange(e.target.value);
              }}
              className="font-mono text-xs font-bold text-slate-800 bg-transparent px-2 py-0.5 outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-all"
              title="Hari berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                type="button"
                onClick={handleSetToday}
                className="px-2 py-1 ml-1 rounded-lg text-[11px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                Hari Ini
              </button>
            )}
          </div>

          {/* Work Schedule Toggle */}
          {onToggleWorkSchedule && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => onToggleWorkSchedule("senin_jumat")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  workSchedule === "senin_jumat"
                    ? "bg-white text-blue-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                8 Jam
              </button>
              <button
                onClick={() => onToggleWorkSchedule("sabtu")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  workSchedule === "sabtu"
                    ? "bg-white text-amber-800 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                5 Jam
              </button>
            </div>
          )}

          {/* Attendance status counter button */}
          <button
            onClick={onNavigateToAttendance}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
              absentOps > 0
                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {hadirOps}/{totalOps} Hadir
            </span>
          </button>

          {/* Print Buttons */}
          {onOpenPrintReport && (
            <button
              id="btn-print-hourly-control"
              onClick={onOpenPrintReport}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Print</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ALARM BOTTLENECK BANNER (Triggered when Jam ke-3 has a bottleneck - Cancelled Only From PE Dashboard by PE) */}
      {jam3AlarmCount > 0 && (
        <div
          className={`rounded-2xl p-3.5 shadow-md border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isAlarmCancelledByPE
              ? "bg-amber-600 text-white border-amber-500"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          <div className="flex items-start sm:items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 ${
                !isAlarmCancelledByPE ? "animate-bounce" : ""
              }`}
            >
              {isAlarmCancelledByPE ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <BellRing className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase">
                  {isAlarmCancelledByPE
                    ? `BOTTLENECK JAM KE-3 (${jam3AlarmCount} Stasiun) • Suara Alarm Dibatalkan PE`
                    : `ALARM BOTTLENECK JAM KE-3 BERBUNYI (${jam3AlarmCount} Stasiun)`}
                </span>
                {!isAlarmCancelledByPE && (
                  <span className="px-2 py-0.5 rounded-full bg-red-900/70 text-[10px] font-mono font-bold border border-red-300/40">
                    Hanya dapat dibatalkan oleh PE di Dasbor PE
                  </span>
                )}
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                Stasiun bottleneck Jam ke-3:{" "}
                <strong className="font-mono text-white">
                  {bottleneckAnalysis.jam3BottleneckStations
                    .map((s) => `#${s.no} ${s.process}`)
                    .join(", ")}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentUser.role === "production_engineer" && onNavigateToPEDashboard && (
              <button
                type="button"
                onClick={onNavigateToPEDashboard}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Buka Dasbor PE untuk membatalkan bunyi alarm"
              >
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span>Kontrol Alarm (Dasbor PE)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("bottleneck-analysis-bottom");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Analisis & Perbaikan</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {canEditCurrentLine && (
              <button
                type="button"
                onClick={handleFixAllBottlenecks}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Perbaiki Langsung</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Real-Time Line Problem Notification Center */}
      <LineIssueNotifier
        lineId={lineData.lineId}
        rows={lineData.rows}
        operators={operators}
        machineRequirements={machineRequirements}
        alerts={alerts}
        onNavigateToAttendance={onNavigateToAttendance}
        onNavigateToLayout={onNavigateToLayout}
        onOpenMultiProcess={() => setIsMultiProcessModalOpen(true)}
      />

      {/* KPI Overview Cards - Crisp & Scannable */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Rata-rata / Jam</span>
          <div className="text-2xl font-mono font-black text-blue-700 mt-0.5">{avgActualPerHour}</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Target / Jam</span>
          <div className="text-2xl font-mono font-black text-slate-800 mt-0.5">
            {avgTargetPerHour}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Selisih / Jam</span>
          <div
            className={`text-2xl font-mono font-black mt-0.5 ${
              totalBalancePerHour >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {totalBalancePerHour >= 0 ? `+${totalBalancePerHour}` : totalBalancePerHour}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Defect</span>
          <div className="text-2xl font-mono font-black text-rose-600 mt-0.5">{totalDefectsSum}</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Bottleneck</span>
          <div className="text-2xl font-mono font-black text-amber-600 mt-0.5 flex items-center space-x-1">
            <span>{bottlenecksCount}</span>
            {bottlenecksCount > 0 && <Flame className="w-4 h-4 text-red-500" />}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Kehadiran</span>
          <div className="text-2xl font-mono font-black text-emerald-600 mt-0.5">
            {totalOps > 0 ? fmt2((hadirOps / totalOps) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedSection === sec
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sec === "ALL" ? "Semua" : sec}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-open-multi-process-modal"
            onClick={() => setIsMultiProcessModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Multi-Proses</span>
            {multiProcessOpsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-extrabold">
                {multiProcessOpsCount}
              </span>
            )}
          </button>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Cari proses / operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Hourly Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-3 px-2 text-center w-10">No</th>
                <th className="py-3 px-3 min-w-[150px]">Proses</th>
                <th className="py-3 px-2 text-center w-20">Mesin</th>
                <th className="py-3 px-2 text-center w-14">SMV</th>
                <th className="py-3 px-3 min-w-[130px]">Operator</th>
                <th className="py-2 px-2 text-center w-24 bg-blue-50/50 border-l border-slate-200">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-blue-900 font-extrabold">Target/Jam</span>
                    {canEditCurrentLine && onUpdateLineTargetPerHour ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={targetInputStr}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setTargetInputStr(raw);
                          const parsed = parseFloat(raw);
                          if (!isNaN(parsed) && parsed >= 0) {
                            onUpdateLineTargetPerHour(fmt2(parsed), false);
                          }
                        }}
                        onBlur={() => {
                          const parsed = fmt2(parseFloat(targetInputStr) || 0);
                          setTargetInputStr(String(parsed));
                          onUpdateLineTargetPerHour(parsed, false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const parsed = fmt2(parseFloat(targetInputStr) || 0);
                            setTargetInputStr(String(parsed));
                            onUpdateLineTargetPerHour(parsed, false);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-16 px-1.5 py-0.5 text-center text-xs font-mono font-black text-blue-950 bg-white border-2 border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                        title="Ketik Target/Jam di sini agar seluruh baris pada kolom Target/Jam terisi otomatis"
                      />
                    ) : null}
                  </div>
                </th>

                {/* Jam 1 s/d Jam 8 */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hr) => {
                  const isOffSchedule = hr > activeWorkingHours;
                  return (
                    <th
                      key={hr}
                      className={`py-2.5 px-1 text-center w-12 border-l border-slate-200 ${
                        isOffSchedule ? "bg-slate-100/80 text-slate-400" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>J{hr}</span>
                        {!isOffSchedule && canEditCurrentLine && (
                          <button
                            onClick={() => {
                              setBatchHourCustomVal(String(avgTargetPerHour));
                              setBatchHourModal(hr);
                            }}
                            className="text-[9px] text-blue-600 hover:underline font-normal cursor-pointer"
                            title={`Isi cepat jam ke-${hr} sesuai target (${avgTargetPerHour} pcs)`}
                          >
                            Isi
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}

                <th className="py-3 px-2 text-center w-16 bg-blue-50 text-blue-900 border-l border-blue-200 font-extrabold">
                  Total
                </th>
                <th className="py-3 px-2 text-center w-16 text-rose-700 bg-rose-50/60 border-l border-rose-100 font-extrabold">
                  Defect
                </th>
                <th className="py-3 px-3 min-w-[110px]">Status</th>
                <th className="py-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row) => {
                const gradeBadge = getGradeBadge(row.operatorGrade);
                const isUnassigned = row.status === "unassigned";
                const rowTargetPerHour = fmt2(
                  row.targetPerHour || metadata.lineTargetPerHour || 10
                );
                const rowTotalActual = fmt2(
                  row.hourlyActual
                    .slice(0, 8)
                    .reduce((acc, val) => acc + (Number(val) || 0), 0)
                );
                const rowFilledHours = row.hourlyActual
                  .slice(0, activeWorkingHours)
                  .filter(
                    (val, idx) =>
                      (Number(val) || 0) > 0 ||
                      (maxFilledHourIdx >= 0 && idx <= maxFilledHourIdx)
                  ).length;
                const rowAvgPerHour =
                  rowFilledHours > 0
                    ? fmt2(rowTotalActual / rowFilledHours)
                    : 0;
                const isBottleneck =
                  bottleneckAnalysis.problematicStations.some(
                    (s) => s.no === row.no
                  ) && !isUnassigned;
                const isDoubleJob = row.isDoubleJob;
                const isTandem = row.isTandem;

                return (
                  <tr
                    key={row.no}
                    id={`row-station-${row.no}`}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isUnassigned
                        ? "bg-rose-50/40"
                        : isDoubleJob
                        ? "bg-amber-50/30"
                        : isTandem
                        ? "bg-indigo-50/30"
                        : isBottleneck
                        ? "bg-amber-50/20"
                        : ""
                    }`}
                  >
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-500">
                      {row.no}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{row.process}</div>
                      <div className="text-[10px] text-slate-400">{row.section}</div>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {row.machine}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center font-mono text-slate-600">
                      {fmt2(row.smv)}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-semibold ${
                            isUnassigned ? "text-rose-600 font-bold" : "text-slate-800"
                          }`}
                        >
                          {isUnassigned ? "Kosong" : row.operatorName}
                        </span>
                        {gradeBadge && !isUnassigned && (
                          <span
                            className={`text-[9px] font-bold px-1 py-0.2 rounded ${gradeBadge.lightBg} ${gradeBadge.text}`}
                          >
                            {row.operatorGrade}
                          </span>
                        )}
                      </div>
                      {operatorWorkloadMap[row.operatorName]?.count === 2 && (
                        <span className="text-[9px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          2 Proses
                        </span>
                      )}
                      {operatorWorkloadMap[row.operatorName]?.count >= 3 && (
                        <span className="text-[9px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          3 Proses
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-700 bg-slate-50/60 border-l border-slate-100">
                      {editingTargetRow === row.no && (onUpdateLineTargetPerHour || onUpdateRowTargetPerHour) ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={rowTargetPerHour}
                          autoFocus
                          onBlur={(e) => {
                            const val = fmt2(parseFloat(e.target.value) || 0);
                            if (onUpdateLineTargetPerHour) {
                              setTargetInputStr(String(val));
                              onUpdateLineTargetPerHour(val, false);
                            } else if (onUpdateRowTargetPerHour) {
                              onUpdateRowTargetPerHour(row.no, val);
                            }
                            setEditingTargetRow(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = fmt2(
                                parseFloat((e.target as HTMLInputElement).value) || 0
                              );
                              if (onUpdateLineTargetPerHour) {
                                setTargetInputStr(String(val));
                                onUpdateLineTargetPerHour(val, false);
                              } else if (onUpdateRowTargetPerHour) {
                                onUpdateRowTargetPerHour(row.no, val);
                              }
                              setEditingTargetRow(null);
                            } else if (e.key === "Escape") {
                              setEditingTargetRow(null);
                            }
                          }}
                          className="w-14 text-center py-0.5 border-2 border-blue-500 rounded bg-white text-slate-900 font-bold outline-none mx-auto block"
                        />
                      ) : (
                        <div
                          onClick={() => {
                            if (canEditCurrentLine && (onUpdateLineTargetPerHour || onUpdateRowTargetPerHour)) {
                              setEditingTargetRow(row.no);
                            }
                          }}
                          title="Klik untuk ubah Target/Jam (otomatis mengisi kolom Target/Jam)"
                          className={`py-1 px-1 rounded transition-colors ${
                            canEditCurrentLine && (onUpdateLineTargetPerHour || onUpdateRowTargetPerHour)
                              ? "cursor-pointer hover:bg-blue-100/60 text-blue-900"
                              : ""
                          }`}
                        >
                          {rowTargetPerHour}
                        </div>
                      )}
                    </td>

                    {/* Hourly inputs (Strictly Jam 1 to Jam 8) */}
                    {row.hourlyActual.slice(0, 8).map((act, hIdx) => {
                      const isEditing =
                        editingCell?.processNo === row.no && editingCell?.hourIndex === hIdx;
                      const isOffSchedule = hIdx + 1 > activeWorkingHours;
                      const numAct = fmt2(Number(act) || 0);
                      const isBelowTarget =
                        !isOffSchedule &&
                        ((numAct > 0 && numAct < rowTargetPerHour) ||
                          (maxFilledHourIdx >= 0 &&
                            hIdx <= maxFilledHourIdx &&
                            numAct < rowTargetPerHour));

                      return (
                        <td
                          key={hIdx}
                          className={`py-1.5 px-1 text-center font-mono border-l border-slate-100 ${
                            isOffSchedule ? "bg-slate-50 text-slate-400" : ""
                          }`}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={numAct}
                              autoFocus
                              onBlur={(e) => {
                                const val = fmt2(parseFloat(e.target.value) || 0);
                                onUpdateHourlyOutput(row.no, hIdx, val, row.hourlyDefects[hIdx] || 0);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const val = fmt2(parseFloat((e.target as HTMLInputElement).value) || 0);
                                  onUpdateHourlyOutput(row.no, hIdx, val, row.hourlyDefects[hIdx] || 0);
                                  setEditingCell(null);
                                }
                              }}
                              className="w-10 text-center py-1 border border-blue-500 rounded bg-white font-bold outline-none"
                            />
                          ) : (
                            <div
                              onClick={() => {
                                if (canEditCurrentLine) {
                                  setEditingCell({ processNo: row.no, hourIndex: hIdx });
                                }
                              }}
                              title={
                                isBelowTarget
                                  ? `Jam ke-${hIdx + 1}: ${numAct}/${rowTargetPerHour} pcs (Di bawah target/jam -> Bottleneck)`
                                  : `Jam ke-${hIdx + 1}: ${numAct} pcs`
                              }
                              className={`py-1 rounded cursor-pointer transition-colors ${
                                canEditCurrentLine ? "hover:bg-blue-50" : ""
                              } ${
                                isBelowTarget
                                  ? "text-rose-700 font-extrabold bg-rose-100/80 ring-1 ring-rose-300"
                                  : "text-slate-800"
                              }`}
                            >
                              {numAct}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Output (SUM dari J1 s/d J8) */}
                    <td className="py-2.5 px-2 text-center font-mono font-black text-xs bg-blue-50/60 text-blue-950 border-l border-blue-200">
                      {rowTotalActual}
                    </td>

                    {/* Defect (Manual Input) */}
                    <td className="py-2.5 px-1 text-center font-mono font-bold text-rose-600 border-l border-rose-100 bg-rose-50/20">
                      {editingDefectRow === row.no ? (
                        <input
                          type="number"
                          min="0"
                          defaultValue={row.totalDefects || 0}
                          autoFocus
                          onBlur={(e) => {
                            const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                            if (onUpdateRowDefects) {
                              onUpdateRowDefects(row.no, val);
                            }
                            setEditingDefectRow(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = Math.max(0, parseInt((e.target as HTMLInputElement).value, 10) || 0);
                              if (onUpdateRowDefects) {
                                onUpdateRowDefects(row.no, val);
                              }
                              setEditingDefectRow(null);
                            } else if (e.key === "Escape") {
                              setEditingDefectRow(null);
                            }
                          }}
                          className="w-12 text-center py-0.5 border-2 border-rose-500 rounded bg-white text-rose-700 font-bold outline-none shadow-xs mx-auto block"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (canEditCurrentLine) {
                              setEditingDefectRow(row.no);
                            }
                          }}
                          disabled={!canEditCurrentLine}
                          className={`w-full py-1 px-1 rounded flex items-center justify-center space-x-1 group transition-colors ${
                            canEditCurrentLine
                              ? "cursor-pointer hover:bg-rose-100/70"
                              : "cursor-default"
                          }`}
                        >
                          <span
                            className={`font-mono font-bold text-xs ${
                              (row.totalDefects || 0) > 0 ? "text-rose-600 font-black" : "text-slate-400"
                            }`}
                          >
                            {row.totalDefects || 0}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-[11px]">
                      {isUnassigned ? (
                        <span className="font-bold text-rose-700 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Kosong</span>
                        </span>
                      ) : isDoubleJob ? (
                        <span className="font-bold text-amber-800 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Double Job</span>
                        </span>
                      ) : isTandem ? (
                        <span className="font-bold text-indigo-800 flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Tandem</span>
                        </span>
                      ) : isBottleneck ? (
                        <span className="font-bold text-amber-700 flex items-center space-x-1">
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          <span>Bottleneck</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Normal</span>
                      )}
                    </td>

                    {/* Action edit assignment */}
                    <td className="py-2.5 px-2 text-center">
                      {canEditCurrentLine && (
                        <button
                          onClick={() =>
                            setAdjustingProcess({
                              no: row.no,
                              process: row.process,
                              section: row.section,
                              machine: row.machine,
                              operatorName: row.operatorName,
                            })
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Ubah Operator / Mesin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* SUMMARY FOOTER: RATA-RATA DARI DATA INPUT PER JAM */}
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-800 text-xs">
              <tr>
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-slate-700 font-extrabold">
                  Total Rata-Rata / Jam ({filteredRows.length} Proses)
                </td>

                <td className="py-3 px-2 text-center font-mono font-black text-slate-900 bg-slate-200/60">
                  {filteredRows.length > 0
                    ? fmt2(
                        filteredRows.reduce(
                          (sum, r) =>
                            sum +
                            (r.targetPerHour || metadata.lineTargetPerHour || 10),
                          0
                        ) / filteredRows.length
                      )
                    : avgTargetPerHour}
                </td>

                {[0, 1, 2, 3, 4, 5, 6, 7].map((hIdx) => {
                  const hourSum = filteredRows.reduce(
                    (sum, r) => sum + (Number(r.hourlyActual[hIdx]) || 0),
                    0
                  );
                  const hourAvg =
                    filteredRows.length > 0
                      ? fmt2(hourSum / filteredRows.length)
                      : 0;
                  const isOffSchedule = hIdx + 1 > activeWorkingHours;
                  return (
                    <td
                      key={hIdx}
                      className={`py-3 px-1 text-center font-mono font-bold border-l border-slate-200 ${
                        isOffSchedule
                          ? "bg-slate-200/40 text-slate-400"
                          : hourAvg > 0 && hourAvg < avgTargetPerHour
                          ? "text-rose-700 bg-rose-100/60"
                          : "text-slate-900 bg-slate-100"
                      }`}
                    >
                      {hourAvg}
                    </td>
                  );
                })}

                <td className="py-3 px-2 text-center font-mono font-black text-sm bg-blue-200/80 text-blue-950 border-l border-blue-300">
                  {(() => {
                    if (filteredRows.length === 0) return 0;
                    const sumOfHourAvgs = [0, 1, 2, 3, 4, 5, 6, 7].reduce((acc, hIdx) => {
                      const hourSum = filteredRows.reduce(
                        (sum, r) => sum + (Number(r.hourlyActual[hIdx]) || 0),
                        0
                      );
                      return acc + hourSum / filteredRows.length;
                    }, 0);
                    return fmt2(sumOfHourAvgs);
                  })()}
                </td>

                <td className="py-3 px-2 text-center font-mono font-bold text-rose-700 bg-rose-50/70">
                  {fmt2(filteredRows.reduce((sum, r) => sum + (Number(r.totalDefects) || 0), 0))}
                </td>

                <td className="py-3 px-3 text-xs">
                  {(() => {
                    const pct =
                      avgTargetPerHour > 0
                        ? fmt2((avgActualPerHour / avgTargetPerHour) * 100)
                        : 0;
                    return (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                        {pct}%
                      </span>
                    );
                  })()}
                </td>

                <td className="py-3 px-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Analisis Bottleneck & Perbaikan Langsung (Bagian Bawah) */}
      <div
        id="bottleneck-analysis-bottom"
        className={`rounded-2xl border shadow-xs p-5 space-y-4 ${
          bottlenecksCount > 0
            ? "bg-white border-red-300 ring-1 ring-red-200"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                bottlenecksCount > 0
                  ? "bg-red-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {bottlenecksCount > 0 ? (
                <Flame className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Analisis Bottleneck & Perbaikan Langsung
              </h3>
              <p className="text-xs text-slate-500">
                {bottlenecksCount > 0
                  ? `Ditemukan ${bottlenecksCount} stasiun bottleneck yang menghambat aliran produksi Line ${lineData.lineId}. Pilih tindakan perbaikan langsung di bawah.`
                  : `Tidak ada bottleneck pada Line ${lineData.lineId}. Aliran proses berjalan seimbang.`}
              </p>
            </div>
          </div>

          {bottlenecksCount > 0 && canEditCurrentLine && (
            <button
              type="button"
              onClick={handleFixAllBottlenecks}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Wrench className="w-4 h-4" />
              <span>Perbaiki Semua Bottleneck ({bottlenecksCount})</span>
            </button>
          )}
        </div>

        {bottlenecksCount > 0 ? (
          <div className="space-y-3">
            {bottleneckAnalysis.problematicStations.map((st, idx) => {
              const isAbsent =
                st.status === "unassigned" || st.operatorAttendance !== "HADIR";
              const targetPerHr = fmt2(
                st.targetPerHour || metadata.lineTargetPerHour || 10
              );
              const smv = fmt2(st.smv || 0.75);
              const allowancePct = metadata.allowancePercentage || 15;
              const sam = fmt2(smv * (1 + allowancePct / 100));
              const kapasitasSmvPerJam = smv > 0 ? fmt2(60 / smv) : 0;
              const kapasitasEfektifPerJam = sam > 0 ? fmt2(60 / sam) : 0;

              const rowAct = fmt2(
                st.hourlyActual
                  .slice(0, 8)
                  .reduce((a, b) => a + (Number(b) || 0), 0)
              );
              const activeHrsForRow = maxFilledHourIdx >= 0 ? maxFilledHourIdx + 1 : activeWorkingHours;
              const rowAvgHr =
                activeHrsForRow > 0
                  ? fmt2(rowAct / activeHrsForRow)
                  : 0;
              const cycleSec = fmt2(st.cycleTime || Math.round(smv * 60));

              // Cari jam mana saja yang tidak sesuai target per jam
              const laggingHoursList: string[] = [];
              st.hourlyActual.slice(0, activeWorkingHours).forEach((v, hIdx) => {
                const val = fmt2(Number(v) || 0);
                if (
                  (val > 0 && val < targetPerHr) ||
                  (maxFilledHourIdx >= 0 && hIdx <= maxFilledHourIdx && val < targetPerHr)
                ) {
                  laggingHoursList.push(`J${hIdx + 1} (${val}/${targetPerHr})`);
                }
              });

              const menitTersedia = fmt2(jamBerlaku * 60);
              const menitDibutuhkanSmv = fmt2(jamBerlaku * targetPerHr * smv);
              const menitAktualSmv = fmt2(rowAct * smv);

              const candidateOp =
                bottleneckAnalysis.smallestSMVOperators[
                  idx %
                    Math.max(1, bottleneckAnalysis.smallestSMVOperators.length)
                ] || bottleneckAnalysis.smallestSMVOperators[0];

              // Root cause diagnosis text from SMV & Jam Berlaku
              let causeTitle = `Kapasitas SMV (${kapasitasEfektifPerJam} pcs/jam) < Target (${targetPerHr} pcs/jam)`;
              let causeDetail = `Perhitungan SMV (${smv} mnt/pcs) pada Jam Berlaku (${jamBerlaku} jam = ${menitTersedia} mnt): membutuhkan ${menitDibutuhkanSmv} mnt kerja efektif (Siklus ${cycleSec}d).`;

              if (isAbsent) {
                causeTitle = `Stasiun Kosong (Operator ${st.operatorAttendance})`;
                causeDetail = `Operator ${st.operatorName} tidak hadir pada Jam Berlaku (${jamBerlaku} jam), kehilangan kapasitas ${jamBerlaku * targetPerHr} pcs.`;
              } else if (laggingHoursList.length > 0) {
                causeTitle = `Target / Jam Tidak Tercapai pada ${laggingHoursList.join(", ")}`;
                causeDetail = `Rata-rata input ${rowAvgHr} pcs/jam (Target: ${targetPerHr} pcs/jam). Dari SMV ${smv} mnt × ${jamBerlaku} jam berlaku (${menitTersedia} mnt), beban kerja mencapai ${menitAktualSmv}/${menitDibutuhkanSmv} mnt (Kapasitas SMV maks: ${kapasitasSmvPerJam} pcs/jam).`;
              }

              return (
                <div
                  key={st.no}
                  className="p-3.5 rounded-xl border border-red-200 bg-red-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-xs">
                        Stasiun #{st.no}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {st.process}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-semibold">
                        {st.machine} &bull; SMV {st.smv}m ({cycleSec}d)
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        Op: <strong>{st.operatorName}</strong> ({st.operatorGrade})
                      </span>
                    </div>

                    <div className="text-xs text-red-800 font-semibold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Analisis: {causeTitle}</span>
                    </div>
                    <p className="text-xs text-slate-600">{causeDetail}</p>
                  </div>

                  {/* Direct Fix Action Buttons */}
                  {canEditCurrentLine && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* 1. Direct Double Job Fix */}
                      {candidateOp && onApplyDoubleJob && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyDoubleJob(
                              st.no,
                              candidateOp.operatorName,
                              candidateOp.stationNo
                            );
                            showNotification(
                              `Perbaikan Double Job diterapkan: ${candidateOp.operatorName} (St. #${candidateOp.stationNo}) membantu Stasiun #${st.no}`
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                          title={`Tugaskan ${candidateOp.operatorName} (SMV terkecil ${candidateOp.smv}m) untuk Double Job`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            Double Job ({candidateOp.operatorName.split(" ")[0]})
                          </span>
                        </button>
                      )}

                      {/* 2. Direct Tandem Fix */}
                      {onApplyTandem && !st.isTandem && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyTandem(
                              st.no,
                              st.operatorName,
                              candidateOp
                                ? candidateOp.operatorName
                                : "Helper Tandem"
                            );
                            showNotification(
                              `Perbaikan Tandem diterapkan di Stasiun #${st.no}: Siklus dipangkas 50% & bottleneck teratasi.`
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                          title="Tambahkan mesin/operator tandem untuk memangkas siklus 50%"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Terapkan Tandem (Siklus -50%)</span>
                        </button>
                      )}

                      {/* 3. Direct Operator Swap / Station Adjust */}
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustingProcess({
                            no: st.no,
                            process: st.process,
                            section: st.section,
                            machine: st.machine,
                            operatorName: st.operatorName,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Ganti Operator</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Seluruh 26 stasiun pada Line {lineData.lineId} beroperasi normal tanpa hambatan bottleneck.
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Kosongkan Data Jam */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                  Konfirmasi Reset
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Kosongkan Semua Data Jam yang Terinput?
                </h3>
              </div>
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh angka output dan defect (Jam 1 s/d Jam 8) pada <strong>Sewing Line {lineData.lineId}</strong> kembali ke 0. Struktur proses, operator, dan target tetap terjaga.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onClearLineHourlyData) {
                    onClearLineHourlyData();
                    showNotification(`Semua data input jam pada Line ${lineData.lineId} berhasil dikosongkan (0).`);
                  }
                  setIsClearConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Ya, Kosongkan Data Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Assignment Modal */}
      {adjustingProcess && onUpdateProcessAssignment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Penyesuaian Stasiun Kerja
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  #{adjustingProcess.no} {adjustingProcess.process}
                </h3>
              </div>
              <button
                onClick={() => setAdjustingProcess(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Operator (Hanya yang HADIR):
                </label>
                <select
                  value={adjustingProcess.operatorName}
                  onChange={(e) =>
                    setAdjustingProcess({
                      ...adjustingProcess,
                      operatorName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none font-semibold text-slate-800"
                >
                  {operators
                    .filter((op) => op.attendanceStatus === "HADIR")
                    .map((op) => {
                      const w = operatorWorkloadMap[op.name];
                      const currentCount = w ? w.count : 0;
                      const currentRowOp = lineData.rows.find((r) => r.no === adjustingProcess.no)?.operatorName;
                      const isAlreadyHere = currentRowOp === op.name;
                      const countIfSelected = isAlreadyHere ? currentCount : currentCount + 1;
                      const isExceeded = !isAlreadyHere && currentCount >= 3;

                      return (
                        <option key={op.id} value={op.name} disabled={isExceeded}>
                          {op.name} ({op.grade}) &bull; {currentCount === 0 ? "Belum ada proses" : `${currentCount} proses`} {isExceeded ? "- [MAKS 3 PROSES TERCAPAI]" : countIfSelected >= 2 ? `-> [Akan jadi ${countIfSelected} proses]` : ""}
                        </option>
                      );
                    })}
                </select>

                {adjustingProcess.operatorName && (
                  <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start space-x-2">
                    <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">Info Beban Multi-Proses: </span>
                      {(() => {
                        const w = operatorWorkloadMap[adjustingProcess.operatorName];
                        const currentRowOp = lineData.rows.find((r) => r.no === adjustingProcess.no)?.operatorName;
                        const isAlreadyHere = currentRowOp === adjustingProcess.operatorName;
                        const countIfSelected = isAlreadyHere ? (w?.count || 1) : (w ? w.count + 1 : 1);
                        if (countIfSelected === 1) return "Operator ini menangani 1 proses tunggal.";
                        if (countIfSelected === 2) return "Operator ini akan menangani 2 proses (Double Job). Total beban kerja disesuaikan.";
                        if (countIfSelected === 3) return "Operator ini akan menangani 3 proses (Triple Job). Pastikan proses ber-SMV ringan.";
                        return "";
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipe Mesin Jahit:</label>
                <input
                  type="text"
                  value={adjustingProcess.machine}
                  onChange={(e) =>
                    setAdjustingProcess({
                      ...adjustingProcess,
                      machine: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAdjustingProcess(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onUpdateProcessAssignment(
                    adjustingProcess.no,
                    adjustingProcess.operatorName,
                    adjustingProcess.machine
                  );
                  setAdjustingProcess(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Hour Input Modal */}
      {batchHourModal !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Input Cepat Massal Jam ke-{batchHourModal}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Isi Output Jam {batchHourModal} untuk Seluruh Stasiun
                </h3>
              </div>
              <button
                onClick={() => setBatchHourModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Fitur ini akan mengisi output jam ke-{batchHourModal} secara otomatis sesuai target untuk seluruh stasiun yang operatornya hadir.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Nilai Output / Target Jam ke-{batchHourModal} (pcs):
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={batchHourCustomVal}
                onChange={(e) => setBatchHourCustomVal(e.target.value)}
                className="w-full px-3 py-2 border border-blue-400 rounded-xl font-mono font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setBatchHourModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const customVal = fmt2(
                    parseFloat(batchHourCustomVal) || avgTargetPerHour || 10
                  );
                  lineData.rows.forEach((r) => {
                    const isPresent = r.operatorAttendance === "HADIR";
                    const rowTgt = fmt2(r.targetPerHour || customVal);
                    onUpdateHourlyOutput(
                      r.no,
                      batchHourModal - 1,
                      isPresent ? (batchHourCustomVal !== "" ? customVal : rowTgt) : 0,
                      0
                    );
                  });
                  setBatchHourModal(null);
                  showNotification(
                    `Jam ke-${batchHourModal} otomatis terisi (${customVal} pcs) sesuai input target.`
                  );
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Isi Sesuai Target ({fmt2(parseFloat(batchHourCustomVal) || avgTargetPerHour)} pcs)
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Multi-Process Modal (1 Person 2-3 Processes) */}
      <MultiProcessModal
        isOpen={isMultiProcessModalOpen}
        onClose={() => setIsMultiProcessModalOpen(false)}
        lineData={lineData}
        operators={operators}
        onApplyMultiProcessBundle={onApplyMultiProcessBundle}
      />
    </div>
  );
};
