/**
 * Sewing Production Engineering Monitoring & Operator Grading System
 *
 * Core System Features:
 * - 6 Sewing Lines: Line 1, 3, 4, 5, 6, 7
 * - Role-Based Access Control (RBAC):
 *   * Production Engineer (PE): Global access to all lines, master data, breakdown upload, and PE analytics
 *   * Admin Line: Restricted strictly to their assigned line, manages attendance and hourly inputs
 * - Operator Attendance Management (Up to 26 operators per line):
 *   * HADIR, SAKIT, IZIN, CUTI, ALPHA
 *   * STRICT RULE: Optimization engine only allocates HADIR operators
 * - Line Balancing & Optimization Engine:
 *   * Operator grading (Grade A, B, C, D)
 *   * Sewing machine requirements & inventory shortage/surplus detection
 *   * Takt time & Pitch diagram calculation
 *   * Capacity, bottlenecks, balance efficiency, idle time
 *   * Current vs. Recommended Layout comparison with 1-click apply
 * - Digital Hourly Production Control Sheet (F-SEW-005-00)
 * - PE Decision Support Dashboard:
 *   * Multi-line comparison
 *   * Pareto Analysis (Defects & Bottleneck Causes 80/20)
 *   * 6M Fishbone Cause & Effect Diagram
 *   * 5 Why Root Cause Drill-Down
 *   * AI & Heuristic Recommendation Engine
 * - Export to Excel (.xlsx) & Comprehensive PDF Layout Print Reports (F-IE-008-00)
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  ProcessItem,
  StyleMetadata,
  MachineRequirement,
  LineProductionData,
  HourlyProductionRow,
  Operator,
  User,
  LineNumber,
  AttendanceStatus,
  LineBPData,
  DailyReportLog,
  GoogleScriptConfig,
  GoogleScriptSyncLog,
  NavTabId,
  NavBarConfig,
} from "./types";
import {
  DEFAULT_STYLE_METADATA,
  RAW_BREAKDOWN_PROCESSES,
  INITIAL_OPERATORS,
  VALID_LINES,
  DEFAULT_USERS,
  DEFAULT_NAV_BARS,
  ALL_PE_TABS,
  DEFAULT_ADMIN_LINE_TABS,
  generateInitialLineRows,
} from "./data/defaultData";
import { DEFAULT_LINES_BP, INITIAL_SEPTEMBER_2026_LOGS } from "./data/lineBPData";
import {
  calculateMachineRequirements,
  calculateAllLinesMachineUsage,
  calculateLocationSpecificUsage,
  isPlottableSewingProcess,
  exportProductionSheetToExcel,
} from "./utils/excelParser";
import { runLineBalancingOptimization } from "./utils/lineBalancing";
import { DEFAULT_GOOGLE_SCRIPT_CONFIG, syncHourlyToGoogleScript } from "./utils/googleScriptService";
import { Navbar } from "./components/Navbar";
import { HourlyProductionSheet } from "./components/HourlyProductionSheet";
import { OperatorAttendanceSheet } from "./components/OperatorAttendanceSheet";
import { ExcelProcessBreakdown } from "./components/ExcelProcessBreakdown";
import { MachineLayoutVisualizer } from "./components/MachineLayoutVisualizer";
import { MachineAvailabilityBar } from "./components/MachineAvailabilityBar";
import { PEDashboard } from "./components/PEDashboard";
import { TargetAnalysisModal } from "./components/TargetAnalysisModal";
import { EditUserModal } from "./components/EditUserModal";
import { LineLayoutPrintReport } from "./components/LineLayoutPrintReport";
import { DailyReportSheet } from "./components/DailyReportSheet";
import { LoginModal } from "./components/LoginModal";
import { GoogleScriptModal } from "./components/GoogleScriptModal";
import { LoginScreen } from "./components/LoginScreen";
import { SimpleBWPrintModal } from "./components/SimpleBWPrintModal";
import { AccountAccessManager } from "./components/AccountAccessManager";
import { ApiKeyManagerModal } from "./components/ApiKeyManagerModal";

export default function App() {
  // Navigation & Line Selection
  const [activeTab, setActiveTab] = useState<NavTabId>("hourly");
  const [selectedLine, setSelectedLine] = useState<LineNumber>(1);

  // Navigation Bars Configuration (Renamable by PE)
  const [navBars, setNavBars] = useState<NavBarConfig[]>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_nav_bars_v5");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_NAV_BARS;
  });

  // RBAC User Authentication State (Initially only PE with pass pe123)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_users_v5");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem("sewsmart_current_user_v5");
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {}
    return DEFAULT_USERS[0]; // Default: Production Engineer
  });

  // Dedicated Login Screen State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sewsmart_auth_status_v5") === "true";
    } catch (e) {
      return false;
    }
  });

  const handleLogin = (user: User) => {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const loggedInUser: User = { ...user, lastLogin: nowStr };

    setCurrentUser(loggedInUser);
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === user.id ? loggedInUser : u));
      try {
        localStorage.setItem("sewsmart_users_v5", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setIsAuthenticated(true);
    try {
      localStorage.setItem("sewsmart_auth_status_v5", "true");
      localStorage.setItem("sewsmart_current_user_v5", JSON.stringify(loggedInUser));
    } catch (e) {}

    // Auto-navigate to assigned line for Admin Line
    if (user.role === "admin_line" && user.assignedLine) {
      setSelectedLine(user.assignedLine as LineNumber);
    }

    // Ensure activeTab is in user's allowedTabs
    const userTabs =
      user.allowedTabs && user.allowedTabs.length > 0
        ? user.allowedTabs
        : user.role === "production_engineer"
        ? ALL_PE_TABS
        : DEFAULT_ADMIN_LINE_TABS;

    if (!userTabs.includes(activeTab) || (activeTab === "account-access" && user.role !== "production_engineer")) {
      setActiveTab(userTabs[0] || "hourly");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("sewsmart_auth_status_v5");
    } catch (e) {}
  };

  // Master per-line Breakdown Process (BP) State
  // Each line has its own distinct BP uploaded by its admin
  const [linesBP, setLinesBP] = useState<Record<LineNumber, LineBPData>>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_lines_bp_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_LINES_BP;
  });

  // Daily Reports & Monthly Recap Logs (September 2026)
  const [dailyLogs, setDailyLogs] = useState<DailyReportLog[]>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_daily_logs_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SEPTEMBER_2026_LOGS;
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_selected_date_v4");
      if (saved) return saved;
    } catch (e) {}
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active Line's Breakdown Data (BP)
  const currentLineBP: LineBPData = useMemo(() => {
    return linesBP[selectedLine] || DEFAULT_LINES_BP[selectedLine] || DEFAULT_LINES_BP[1];
  }, [linesBP, selectedLine]);

  const activeProcesses = currentLineBP.processes;
  const activeMetadata = currentLineBP.metadata;

  // Cross-line machine usage:
  // "dan jika sudah di gunakan di satu line. ketersediaan di pabrik berkurang"
  const otherLinesUsage = useMemo(() => {
    return calculateAllLinesMachineUsage(linesBP, selectedLine);
  }, [linesBP, selectedLine]);

  // Handler for selecting active running process date
  const handleSelectDate = (newDate: string) => {
    setSelectedDate(newDate);
    try {
      localStorage.setItem("sewsmart_selected_date_v4", newDate);
    } catch (e) {}

    // Auto-align schedule if Saturday
    const d = new Date(newDate + "T00:00:00");
    if (!isNaN(d.getTime())) {
      if (d.getDay() === 6) {
        setWorkSchedule("sabtu");
      } else if (d.getDay() >= 1 && d.getDay() <= 5) {
        setWorkSchedule("senin_jumat");
      }
    }

    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;
      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          date: newDate,
        },
      };
    });
  };

  // Line Production Data for Lines 1, 3, 4, 5, 6, 7 (Generated with each line's BP)
  const [linesData, setLinesData] = useState<Record<number, LineProductionData>>(() => {
    const initial: Record<number, LineProductionData> = {};
    VALID_LINES.forEach((lineId) => {
      const bp = DEFAULT_LINES_BP[lineId] || DEFAULT_LINES_BP[1];
      initial[lineId] = generateInitialLineRows(lineId, bp.processes);
    });
    return initial;
  });

  // Operators List (Per line with attendance, skill matrix & grading)
  const [operators, setOperators] = useState<Operator[]>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_operators_v4");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_OPERATORS;
  });

  // Modals state
  const [isTargetAnalysisOpen, setIsTargetAnalysisOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [isSimpleBWPrintOpen, setIsSimpleBWPrintOpen] = useState(false);
  const [isGoogleScriptModalOpen, setIsGoogleScriptModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // PE-controlled Alarm Cancellation State per Line (Only PE can cancel from PE Dashboard)
  const [cancelledAlarmLines, setCancelledAlarmLines] = useState<Record<number, boolean>>({});

  // Google Apps Script & Google Spreadsheet Integration State
  const [googleScriptConfig, setGoogleScriptConfig] = useState<GoogleScriptConfig>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_google_script_config_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_GOOGLE_SCRIPT_CONFIG;
  });

  const [syncLogs, setSyncLogs] = useState<GoogleScriptSyncLog[]>(() => {
    try {
      const saved = localStorage.getItem("sewsmart_google_script_logs_v1");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const handleSaveGoogleScriptConfig = (newConfig: GoogleScriptConfig) => {
    setGoogleScriptConfig(newConfig);
    try {
      localStorage.setItem("sewsmart_google_script_config_v1", JSON.stringify(newConfig));
    } catch (e) {}
  };

  const handleAddSyncLog = (log: GoogleScriptSyncLog) => {
    setSyncLogs((prev) => {
      const next = [log, ...prev].slice(0, 50); // keep last 50
      try {
        localStorage.setItem("sewsmart_google_script_logs_v1", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleClearSyncLogs = () => {
    setSyncLogs([]);
    try {
      localStorage.removeItem("sewsmart_google_script_logs_v1");
    } catch (e) {}
  };

  // Work Schedule state: "senin_jumat" (8 hours) vs "sabtu" (5 hours)
  const [workSchedule, setWorkSchedule] = useState<"senin_jumat" | "sabtu">("senin_jumat");
  const effectiveWorkingHours = workSchedule === "sabtu" ? 5 : 8;

  // Location specific usage calculation (TW1: Line 1 & 3; TW38: Line 4, 5, 6, 7)
  const locationUsage = useMemo(() => {
    return calculateLocationSpecificUsage(linesBP, selectedLine);
  }, [linesBP, selectedLine]);

  // Real-Time Central Server Synchronization for Multi-User across all devices
  const [serverSyncTime, setServerSyncTime] = useState<string>("Sinkron");
  const [serverVersion, setServerVersion] = useState<number>(0);

  // Poll central system state every 3.5 seconds
  useEffect(() => {
    let isMounted = true;
    const fetchSystemState = async () => {
      try {
        const res = await fetch("/api/v1/system/state");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && isMounted) {
          // If version has advanced or initial load
          if (data.version && data.version !== serverVersion) {
            setServerVersion(data.version);

            if (Array.isArray(data.users) && data.users.length > 0) {
              setUsers(data.users);
              try { localStorage.setItem("sewsmart_users_v5", JSON.stringify(data.users)); } catch (e) {}
            }
            if (data.linesData && typeof data.linesData === "object" && Object.keys(data.linesData).length > 0) {
              setLinesData((prev) => ({ ...prev, ...data.linesData }));
              try { localStorage.setItem("sewsmart_lines_data_v4", JSON.stringify(data.linesData)); } catch (e) {}
            }
            if (Array.isArray(data.operators) && data.operators.length > 0) {
              setOperators(data.operators);
              try { localStorage.setItem("sewsmart_operators_v4", JSON.stringify(data.operators)); } catch (e) {}
            }
            if (data.linesBP && typeof data.linesBP === "object" && Object.keys(data.linesBP).length > 0) {
              setLinesBP(data.linesBP);
              try { localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(data.linesBP)); } catch (e) {}
            }
            if (Array.isArray(data.dailyLogs) && data.dailyLogs.length > 0) {
              setDailyLogs(data.dailyLogs);
              try { localStorage.setItem("sewsmart_daily_logs_v4", JSON.stringify(data.dailyLogs)); } catch (e) {}
            }
            if (Array.isArray(data.navBars) && data.navBars.length > 0) {
              setNavBars(data.navBars);
              try { localStorage.setItem("sewsmart_nav_bars_v5", JSON.stringify(data.navBars)); } catch (e) {}
            }
          }

          const nowTime = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setServerSyncTime(nowTime);
        }
      } catch (e) {}
    };

    fetchSystemState();
    const interval = setInterval(fetchSystemState, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [serverVersion]);

  // Debounced push of linesData changes to central server
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/api/v1/system/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linesData }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.version) setServerVersion(res.version);
        })
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [linesData]);

  const handleRefreshServerData = async () => {
    try {
      const res = await fetch("/api/v1/system/state");
      const data = await res.json();
      if (data.success) {
        if (data.linesData) setLinesData((prev) => ({ ...prev, ...data.linesData }));
        if (data.operators) setOperators(data.operators);
        if (data.users) setUsers(data.users);
        if (data.linesBP) setLinesBP(data.linesBP);
        if (data.version) setServerVersion(data.version);
      }
    } catch (e) {}
  };

  // Active machine requirements: Exactly 26 machines for line, with location stock (TW1 vs TW38) & factory deduction
  const activeMachineRequirements = useMemo(() => {
    return calculateMachineRequirements(
      activeProcesses,
      activeMetadata.lineTargetPerDay,
      effectiveWorkingHours,
      activeMetadata.allowancePercentage || 15,
      0.85,
      otherLinesUsage,
      selectedLine,
      locationUsage.usedByCoLocatedLines
    );
  }, [
    activeProcesses,
    activeMetadata.lineTargetPerDay,
    effectiveWorkingHours,
    activeMetadata.allowancePercentage,
    otherLinesUsage,
    selectedLine,
    locationUsage.usedByCoLocatedLines,
  ]);

  // Current line operators
  const currentLineOperators = useMemo(() => {
    return operators.filter((o) => o.line === selectedLine);
  }, [operators, selectedLine]);

  // Current line data
  const currentLineData = useMemo(() => {
    const raw = linesData[selectedLine] || generateInitialLineRows(selectedLine, activeProcesses, currentLineOperators, workSchedule);
    return {
      ...raw,
      date: selectedDate || raw.date,
    };
  }, [linesData, selectedLine, activeProcesses, currentLineOperators, workSchedule, selectedDate]);

  // LINE BALANCING OPTIMIZATION ENGINE
  // Computes current layout vs recommended layout, metrics, alerts, machine reqs, double job & tandem
  const optimizationResult = useMemo(() => {
    return runLineBalancingOptimization(
      activeProcesses,
      currentLineOperators,
      activeMetadata.lineTargetPerHour,
      effectiveWorkingHours,
      activeMetadata.allowancePercentage || 15,
      workSchedule,
      otherLinesUsage,
      selectedLine,
      locationUsage.usedByCoLocatedLines
    );
  }, [
    activeProcesses,
    currentLineOperators,
    activeMetadata.lineTargetPerHour,
    effectiveWorkingHours,
    activeMetadata.allowancePercentage,
    workSchedule,
    otherLinesUsage,
    selectedLine,
    locationUsage.usedByCoLocatedLines,
  ]);

  // Handlers for RBAC user & bar changes (PE Account Access Management)
  const syncUserWithLineData = (user: User) => {
    if (user.role === "admin_line" && user.assignedLine) {
      const lineId = user.assignedLine;
      setLinesBP((prev) => {
        const currentBP = prev[lineId];
        if (!currentBP) return prev;
        const next = {
          ...prev,
          [lineId]: {
            ...currentBP,
            uploadedBy: user.name,
          },
        };
        try {
          localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    }
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prev) => {
      const updated = [...prev, newUser];
      try {
        localStorage.setItem("sewsmart_users_v5", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    syncUserWithLineData(newUser);

    // Save to central server
    fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      try {
        localStorage.setItem("sewsmart_users_v5", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("sewsmart_current_user_v5", JSON.stringify(updatedUser));
      } catch (e) {}
    }

    syncUserWithLineData(updatedUser);

    // Save to central server
    fetch(`/api/v1/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === userId);
      const peUsers = prev.filter((u) => u.role === "production_engineer");
      if (target?.role === "production_engineer" && peUsers.length <= 1) {
        return prev; // Keep at least 1 PE account
      }
      const updated = prev.filter((u) => u.id !== userId);
      try {
        localStorage.setItem("sewsmart_users_v5", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Delete on central server
    fetch(`/api/v1/users/${userId}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  const handleUpdateNavBars = (newBars: NavBarConfig[]) => {
    setNavBars(newBars);
    try {
      localStorage.setItem("sewsmart_nav_bars_v5", JSON.stringify(newBars));
    } catch (e) {}

    // Save to central server
    fetch("/api/v1/nav-bars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ navBars: newBars }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  const handleUpdateUserName = (userId: string, newName: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      handleUpdateUser({ ...target, name: newName });
    }
  };

  const handleSwitchUser = (user: User) => {
    handleLogin(user);
  };

  // UPLOAD LINE BP HANDLER (Admin Line or PE)
  const handleUploadLineBP = (
    lineId: LineNumber,
    newProcesses: ProcessItem[],
    newMetadata: StyleMetadata,
    fileName: string
  ) => {
    // ATURAN: Hanya masukkan semua kategori kecuali Automachine dan helper untuk plot line
    const filteredProcesses = newProcesses
      .filter((p) =>
        isPlottableSewingProcess({
          section: p.section,
          subSection: p.subSection,
          process: p.process,
          machine: p.machine,
        })
      )
      .map((p, idx) => ({ ...p, no: idx + 1 }));

    const usageByOtherLines = calculateAllLinesMachineUsage(linesBP, lineId);
    const newReqs = calculateMachineRequirements(
      filteredProcesses,
      newMetadata.lineTargetPerDay,
      newMetadata.workingHours,
      newMetadata.allowancePercentage || 15,
      0.85,
      usageByOtherLines
    );

    const updatedBP: LineBPData = {
      lineId,
      metadata: newMetadata,
      processes: filteredProcesses,
      machineRequirements: newReqs,
      uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      uploadedBy: currentUser.name,
      fileName,
    };

    setLinesBP((prev) => {
      const next = { ...prev, [lineId]: updatedBP };
      try {
        localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Save BP to central server
    fetch(`/api/v1/lines/${lineId}/bp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bp: updatedBP }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});

    // Re-generate line rows with the new processes for this specific line
    setLinesData((prev) => {
      const lineOps = operators.filter((o) => o.line === lineId);
      const newSheet = generateInitialLineRows(lineId, filteredProcesses, lineOps);
      return {
        ...prev,
        [lineId]: newSheet,
      };
    });
  };

  // UPDATE PROCESSES FOR ACTIVE LINE
  const handleUpdateProcesses = (newProcesses: ProcessItem[]) => {
    const filteredProcesses = newProcesses
      .filter((p) =>
        isPlottableSewingProcess({
          section: p.section,
          subSection: p.subSection,
          process: p.process,
          machine: p.machine,
        })
      )
      .map((p, idx) => ({ ...p, no: idx + 1 }));

    const usageByOtherLines = calculateAllLinesMachineUsage(linesBP, selectedLine);
    const newReqs = calculateMachineRequirements(
      filteredProcesses,
      activeMetadata.lineTargetPerDay,
      activeMetadata.workingHours,
      activeMetadata.allowancePercentage || 15,
      0.85,
      usageByOtherLines
    );

    const updatedBP: LineBPData = {
      ...currentLineBP,
      processes: filteredProcesses,
      machineRequirements: newReqs,
    };

    setLinesBP((prev) => {
      const next = { ...prev, [selectedLine]: updatedBP };
      try {
        localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    fetch(`/api/v1/lines/${selectedLine}/bp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bp: updatedBP }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});

    setLinesData((prev) => {
      const lineOps = operators.filter((o) => o.line === selectedLine);
      const newSheet = generateInitialLineRows(selectedLine, filteredProcesses, lineOps);
      return {
        ...prev,
        [selectedLine]: newSheet,
      };
    });
  };

  // UPDATE METADATA FOR ACTIVE LINE
  const handleUpdateMetadata = (newMetadata: StyleMetadata) => {
    const usageByOtherLines = calculateAllLinesMachineUsage(linesBP, selectedLine);
    const newReqs = calculateMachineRequirements(
      activeProcesses,
      newMetadata.lineTargetPerDay,
      newMetadata.workingHours,
      newMetadata.allowancePercentage || 15,
      0.85,
      usageByOtherLines
    );

    const updatedBP: LineBPData = {
      ...currentLineBP,
      metadata: newMetadata,
      machineRequirements: newReqs,
    };

    setLinesBP((prev) => {
      const next = { ...prev, [selectedLine]: updatedBP };
      try {
        localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    fetch(`/api/v1/lines/${selectedLine}/bp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bp: updatedBP }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  // SAVE DAILY REPORT LOG (September 2026)
  const handleSaveDailyLog = (newLog: DailyReportLog) => {
    setDailyLogs((prev) => {
      const index = prev.findIndex((l) => l.date === newLog.date && l.lineId === newLog.lineId);
      let updated: DailyReportLog[];
      if (index >= 0) {
        updated = [...prev];
        updated[index] = newLog;
      } else {
        updated = [newLog, ...prev];
      }
      try {
        localStorage.setItem("sewsmart_daily_logs_v4", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Save log to central server
    fetch("/api/v1/daily-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ log: newLog }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});
  };

  // ATTENDANCE UPDATE HANDLER
  const handleUpdateOperatorAttendance = (
    operatorId: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    setOperators((prev) => {
      const next = prev.map((op) =>
        op.id === operatorId
          ? {
              ...op,
              attendanceStatus: status,
              attendanceNotes: notes || (status === "HADIR" ? "" : op.attendanceNotes),
            }
          : op
      );
      try {
        localStorage.setItem("sewsmart_operators_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Save attendance to central server
    fetch("/api/v1/operators/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operatorId, status, notes }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});

    // Synchronize attendance flag on current line rows
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const targetOp = operators.find((o) => o.id === operatorId);
      if (!targetOp) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        if (row.operatorName === targetOp.name || row.no === targetOp.assignedProcessNo) {
          return {
            ...row,
            operatorAttendance: status,
            status:
              status !== "HADIR"
                ? ("unassigned" as const)
                : row.balanceTarget < -10
                ? ("bottleneck" as const)
                : ("normal" as const),
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // BATCH SET ALL HADIR
  const handleBatchSetAllHadir = () => {
    setOperators((prev) => {
      const next = prev.map((op) =>
        op.line === selectedLine
          ? { ...op, attendanceStatus: "HADIR", attendanceNotes: "" }
          : op
      );
      try {
        localStorage.setItem("sewsmart_operators_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Save batch attendance to central server
    fetch("/api/v1/operators/batch-attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId: selectedLine, status: "HADIR" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.version) setServerVersion(res.version);
      })
      .catch(() => {});

    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((r) => ({
        ...r,
        operatorAttendance: "HADIR" as const,
        status: r.balanceTarget < -10 ? ("bottleneck" as const) : ("normal" as const),
      }));

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // UPDATE OPERATOR DETAILS (Skill Matrix, Grade, Efficiency, Defect)
  const handleUpdateOperatorDetails = (operatorId: string, updated: Partial<Operator>) => {
    setOperators((prev) => {
      const next = prev.map((op) => (op.id === operatorId ? { ...op, ...updated } : op));
      try {
        localStorage.setItem("sewsmart_operators_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // ADD OPERATOR TO CURRENT LINE
  const handleAddOperator = (newOperator: Operator) => {
    setOperators((prev) => {
      const next = [...prev, newOperator];
      try {
        localStorage.setItem("sewsmart_operators_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // DELETE OPERATOR FROM CURRENT LINE
  const handleDeleteOperator = (operatorId: string) => {
    setOperators((prev) => {
      const next = prev.filter((op) => op.id !== operatorId);
      try {
        localStorage.setItem("sewsmart_operators_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // APPLY RECOMMENDED LAYOUT TO LINE PRODUCTION SHEET
  const handleApplyRecommendedLayout = () => {
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        const rec = optimizationResult.recommendedLayout.find((r) => r.stationNo === row.no);
        if (rec) {
          return {
            ...row,
            operatorName: rec.assignedOperatorName,
            operatorGrade: rec.operatorGrade,
            operatorAttendance: rec.attendanceStatus,
            status: rec.status,
            machine: rec.machineType,
            keterangan:
              rec.status === "unassigned"
                ? "Operator Asli Absen - Butuh Floating Helper"
                : rec.status === "bottleneck"
                ? "Bottleneck Siklus > Takt Time"
                : "Optimal Line Balancing",
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // HOURLY PRODUCTION SHEET OUTPUT UPDATE (Total is sum of Jam 1 to 8)
  const handleUpdateHourlyOutput = (
    processNo: number,
    hourIndex: number,
    newActual: number,
    newDefect: number
  ) => {
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        if (row.no === processNo) {
          const updatedHourlyActual = [...row.hourlyActual.slice(0, 8)];
          while (updatedHourlyActual.length < 8) updatedHourlyActual.push(0);
          const updatedHourlyDefects = [...row.hourlyDefects.slice(0, 8)];
          while (updatedHourlyDefects.length < 8) updatedHourlyDefects.push(0);

          const safeActual = Number((Number(newActual) || 0).toFixed(2));
          const safeDefect = Number((Number(newDefect) || 0).toFixed(2));
          updatedHourlyActual[hourIndex] = safeActual;
          updatedHourlyDefects[hourIndex] = safeDefect;

          // STRICTLY sum of Jam 1 through Jam 8
          const totalActual = Number(
            updatedHourlyActual
              .slice(0, 8)
              .reduce((a, b) => a + (Number(b) || 0), 0)
              .toFixed(2)
          );
          // Preserve manual defect count on row
          const totalDefects = Number(
            (typeof row.totalDefects === "number"
              ? row.totalDefects
              : updatedHourlyDefects.reduce((a, b) => a + b, 0)
            ).toFixed(2)
          );
          const balanceTarget = Number((totalActual - row.target).toFixed(2));

          // Determine active filled hours to evaluate hourly bottleneck accurately from target per hour & SMV
          const hourlyTarget = Number((row.targetPerHour || 10).toFixed(2));
          const smv = Number((row.smv || 0.75).toFixed(2));
          const kapasitasSmvPerJam = smv > 0 ? Number((60 / smv).toFixed(2)) : 0;
          const filledHours = updatedHourlyActual.slice(0, 8).filter((v, idx) => v > 0 || (idx === hourIndex && safeActual > 0)).length;
          const expectedCumulative = Number((filledHours * hourlyTarget).toFixed(2));
          const isHourBelowTarget = safeActual > 0 && safeActual < hourlyTarget;
          const isAnyActiveHourBelowTarget = updatedHourlyActual
            .slice(0, effectiveWorkingHours)
            .some((v) => Number(v) > 0 && Number(v) < hourlyTarget);
          const isHighCycleBottleneck =
            !row.isTandem &&
            !row.isDoubleJob &&
            (kapasitasSmvPerJam < hourlyTarget || (row.cycleTime || 0) >= 85 || smv >= 1.4) &&
            newActual < hourlyTarget;

          const isNowBottleneck =
            isHourBelowTarget || isAnyActiveHourBelowTarget || isHighCycleBottleneck;

          // Alarm hanya dipicu ulang apabila bottleneck terjadi pada Jam ke-3 (index 2) atau setelahnya
          const hasJam3InputAfterUpdate =
            (hourIndex >= 2 && newActual > 0) ||
            updatedHourlyActual.slice(2, effectiveWorkingHours).some((v) => Number(v) > 0);
          const isJam3Bottleneck =
            hasJam3InputAfterUpdate &&
            ((Number(updatedHourlyActual[2]) || 0) < hourlyTarget ||
              (hourIndex >= 2 && isHourBelowTarget));

          if (isJam3Bottleneck) {
            setCancelledAlarmLines((prevAlarm) => ({
              ...prevAlarm,
              [selectedLine]: false,
            }));
          }

          return {
            ...row,
            hourlyActual: updatedHourlyActual,
            hourlyDefects: updatedHourlyDefects,
            totalActual,
            akmOutput: totalActual,
            totalDefects,
            balanceTarget,
            status:
              row.operatorAttendance !== "HADIR"
                ? ("unassigned" as const)
                : isNowBottleneck
                ? ("bottleneck" as const)
                : ("normal" as const),
            keterangan:
              row.operatorAttendance !== "HADIR"
                ? "Kritis: Operator Absen"
                : isNowBottleneck
                ? `Bottleneck: Aktual ${totalActual}/${expectedCumulative || hourlyTarget} pcs`
                : "Tercapai normal",
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // MANUAL DEFECT INPUT UPDATE FOR HOURLY CONTROL
  const handleUpdateRowDefects = (processNo: number, newDefects: number) => {
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const safeDefects = Math.max(0, Number(Number(newDefects || 0).toFixed(2)));

      const updatedRows = lineObj.rows.map((row) => {
        if (row.no === processNo) {
          return {
            ...row,
            totalDefects: safeDefects,
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // UPDATE TARGET PER JAM OTOMATIS UNTUK SELURUH BARIS KONTROL JAM (DAN OPSIONAL ISI JAM AKTIF)
  const handleUpdateLineTargetPerHour = (
    newTargetPerHour: number,
    autoFillActiveHours: boolean = false
  ) => {
    const safeTarget = Number(Math.max(0, Number(newTargetPerHour) || 0).toFixed(2));
    const newDailyTarget = Number((safeTarget * effectiveWorkingHours).toFixed(2));

    // 1. Update linesBP metadata for active line
    setLinesBP((prev) => {
      const bp = prev[selectedLine] || DEFAULT_LINES_BP[selectedLine] || DEFAULT_LINES_BP[1];
      const next = {
        ...prev,
        [selectedLine]: {
          ...bp,
          metadata: {
            ...bp.metadata,
            lineTargetPerHour: safeTarget,
            lineTargetPerDay: newDailyTarget,
            targetPerManpowerPerDay: safeTarget,
          },
        },
      };
      try {
        localStorage.setItem("sewsmart_lines_bp_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 2. Update linesData rows automatically with the new target
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        const isPresent = row.operatorAttendance === "HADIR" && row.status !== "unassigned";
        const updatedHourlyActual = autoFillActiveHours
          ? row.hourlyActual.slice(0, 8).map((v, idx) =>
              idx < effectiveWorkingHours ? (isPresent ? safeTarget : 0) : v
            )
          : row.hourlyActual.slice(0, 8);

        const totalActual = Number(
          updatedHourlyActual.reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2)
        );
        const balanceTarget = Number((totalActual - safeTarget).toFixed(2));

        const smv = row.smv || 0.75;
        const kapasitasSmvPerJam = smv > 0 ? 60 / smv : 0;
        const isAnyHourBelow = updatedHourlyActual
          .slice(0, effectiveWorkingHours)
          .some((v) => Number(v) > 0 && Number(v) < safeTarget);
        const isHighCycle =
          !row.isTandem &&
          !row.isDoubleJob &&
          (kapasitasSmvPerJam < safeTarget || (row.cycleTime || 0) >= 85 || smv >= 1.4);

        const isBottleneck = isAnyHourBelow || (isHighCycle && !autoFillActiveHours);

        return {
          ...row,
          targetPerHour: safeTarget,
          target: safeTarget,
          hourlyActual: updatedHourlyActual,
          totalActual,
          akmOutput: totalActual,
          balanceTarget,
          status: !isPresent
            ? ("unassigned" as const)
            : isBottleneck
            ? ("bottleneck" as const)
            : ("normal" as const),
        };
      });

      const next = {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          targetPerHour: safeTarget,
          targetPerDay: newDailyTarget,
          rows: updatedRows,
        },
      };
      try {
        localStorage.setItem("sewsmart_lines_data_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // UPDATE TARGET PER JAM UNTUK 1 BARIS STASIUN TERTENTU
  const handleUpdateRowTargetPerHour = (processNo: number, newRowTarget: number) => {
    const safeTarget = Number(Math.max(0, Number(newRowTarget) || 0).toFixed(2));
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        if (row.no === processNo) {
          return {
            ...row,
            targetPerHour: safeTarget,
            target: safeTarget,
            balanceTarget: Number((row.totalActual - safeTarget).toFixed(2)),
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // UPDATE PROCESS ASSIGNMENT (Single Station)
  const handleUpdateProcessAssignment = (
    processNo: number,
    operatorName: string,
    machineName: string
  ) => {
    const matchedOp = currentLineOperators.find((o) => o.name === operatorName);

    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((r) => {
        if (r.no === processNo) {
          return {
            ...r,
            operatorName,
            operatorGrade: matchedOp?.grade || r.operatorGrade,
            operatorAttendance: matchedOp?.attendanceStatus || "HADIR",
            machine: machineName,
          };
        }
        return r;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // CLEAR CURRENT LINE HOURLY DATA (KOSONGKAN DATA TERINPUT KEMBALI KE 0)
  const handleClearLineHourlyData = (lineId: LineNumber) => {
    setLinesData((prev) => {
      const lineObj = prev[lineId];
      if (!lineObj) return prev;

      const clearedRows = lineObj.rows.map((row) => ({
        ...row,
        hourlyActual: [0, 0, 0, 0, 0, 0, 0, 0],
        hourlyDefects: [0, 0, 0, 0, 0, 0, 0, 0],
        totalActual: 0,
        akmOutput: 0,
        totalDefects: 0,
        balanceTarget: -row.target,
        status:
          row.operatorAttendance !== "HADIR"
            ? ("unassigned" as const)
            : ("normal" as const),
        keterangan:
          row.operatorAttendance !== "HADIR"
            ? "Kritis: Operator Absen"
            : "Data baru dikosongkan (0 pcs)",
      }));

      const next = {
        ...prev,
        [lineId]: {
          ...lineObj,
          rows: clearedRows,
        },
      };
      try {
        localStorage.setItem("sewsmart_lines_data_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // APPLY DOUBLE JOB (SMV TERKECIL)
  const handleApplyDoubleJob = (
    stationNo: number,
    candidateOpName: string,
    originStationNo: number
  ) => {
    const candidateOp = operators.find((o) => o.name === candidateOpName);
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        if (row.no === stationNo) {
          return {
            ...row,
            operatorName: `${candidateOpName} (Double Job)`,
            operatorGrade: candidateOp?.grade || row.operatorGrade,
            operatorAttendance: "HADIR" as const,
            isDoubleJob: true,
            status: "normal" as const,
            keterangan: `Double Job (Cover dari St. #${originStationNo})`,
          };
        }
        if (row.no === originStationNo) {
          return {
            ...row,
            isDoubleJob: true,
            keterangan: `Double Job (Cover St. #${stationNo})`,
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // APPLY TANDEM (KAPASITAS MELEBIHI / 2 OPERATOR)
  const handleApplyTandem = (
    stationNo: number,
    op1Name: string,
    op2Name: string
  ) => {
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const updatedRows = lineObj.rows.map((row) => {
        if (row.no === stationNo) {
          const hourlyTarget = row.targetPerHour || 10;
          const normalizedActuals = row.hourlyActual.slice(0, 8).map((v) =>
            v > 0 && v < hourlyTarget ? hourlyTarget : v
          );
          const totalActual = normalizedActuals.reduce((a, b) => a + (Number(b) || 0), 0);

          return {
            ...row,
            operatorName: row.operatorName.includes("&")
              ? row.operatorName
              : `${op1Name} & ${op2Name}`,
            isTandem: true,
            cycleTime: row.cycleTime ? Math.round(row.cycleTime / 2) : 40,
            smv: row.smv ? Number((row.smv / 2).toFixed(2)) : 0.65,
            hourlyActual: normalizedActuals,
            totalActual,
            akmOutput: totalActual,
            balanceTarget: totalActual - row.target,
            status: "normal" as const,
            keterangan: "Tandem 2 Operator (Siklus dipangkas 50%)",
          };
        }
        return row;
      });

      return {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
    });
  };

  // APPLY MULTI-PROCESS BUNDLE (1 ORANG MELAKUKAN 2-3 PROSES)
  const handleApplyMultiProcessBundle = (updatedRows: HourlyProductionRow[]) => {
    setLinesData((prev) => {
      const lineObj = prev[selectedLine];
      if (!lineObj) return prev;

      const next = {
        ...prev,
        [selectedLine]: {
          ...lineObj,
          rows: updatedRows,
        },
      };
      try {
        localStorage.setItem("sewsmart_lines_data_v4", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // COUNTERS FOR NAVBAR ALERTS
  const presentCount = currentLineOperators.filter((o) => o.attendanceStatus === "HADIR").length;
  const totalOpsCount = currentLineOperators.length;

  // Compute Real-Time Alarm & Kendala State across all lines for Kontrol Jam & PE Dashboard
  const lineAlarmState = useMemo(() => {
    const state: Record<
      number,
      { issueCount: number; stations: string[]; isCancelled: boolean }
    > = {};

    VALID_LINES.forEach((lineId) => {
      const lData = linesData[lineId];
      const bp = linesBP[lineId] || DEFAULT_LINES_BP[lineId] || DEFAULT_LINES_BP[1];
      const allowancePct = bp.metadata.allowancePercentage || 15;
      const lineTargetHr = bp.metadata.lineTargetPerHour || 10;

      if (!lData) {
        state[lineId] = { issueCount: 0, stations: [], isCancelled: !!cancelledAlarmLines[lineId] };
        return;
      }

      let maxIdx = -1;
      lData.rows.forEach((r) => {
        r.hourlyActual.slice(0, effectiveWorkingHours).forEach((val, idx) => {
          if ((Number(val) || 0) > 0 && idx > maxIdx) maxIdx = idx;
        });
      });

      // Alarm hanya berbunyi ketika Jam ke-3 (index >= 2) sudah berjalan/diinput dan terjadi bottleneck pada Jam ke-3
      if (maxIdx < 2) {
        state[lineId] = {
          issueCount: 0,
          stations: [],
          isCancelled: !!cancelledAlarmLines[lineId],
        };
        return;
      }

      const problemRows = lData.rows.filter((r) => {
        const isAbsent = r.operatorAttendance !== "HADIR" || r.status === "unassigned";
        const targetPerHr = r.targetPerHour || lineTargetHr;
        const smv = r.smv || 0.75;
        const sam = smv * (1 + allowancePct / 100);
        const isSmvShort =
          !r.isTandem &&
          !r.isDoubleJob &&
          (60 / smv < targetPerHr || 60 / sam < targetPerHr || (r.cycleTime || 0) >= 85 || smv >= 1.4);

        const jam3Val = Number(r.hourlyActual[2]) || 0;
        const isJam3BelowTarget = jam3Val < targetPerHr;
        const hasHourFromJam3BelowTarget = r.hourlyActual
          .slice(2, maxIdx + 1)
          .some((val) => (Number(val) || 0) < targetPerHr);

        return (
          isJam3BelowTarget ||
          hasHourFromJam3BelowTarget ||
          ((isAbsent || isSmvShort || r.status === "bottleneck") && isJam3BelowTarget)
        );
      });

      state[lineId] = {
        issueCount: problemRows.length,
        stations: problemRows.map((r) => `#${r.no} ${r.process}`),
        isCancelled: !!cancelledAlarmLines[lineId],
      };
    });

    return state;
  }, [linesData, linesBP, effectiveWorkingHours, cancelledAlarmLines]);

  const handleToggleCancelLineAlarm = (lineId: LineNumber, cancel: boolean) => {
    if (currentUser.role !== "production_engineer") return;
    setCancelledAlarmLines((prev) => ({
      ...prev,
      [lineId]: cancel,
    }));
  };

  const handleCancelAllAlarms = () => {
    if (currentUser.role !== "production_engineer") return;
    const next: Record<number, boolean> = {};
    VALID_LINES.forEach((l) => {
      next[l] = true;
    });
    setCancelledAlarmLines(next);
  };

  // Continuous Web Audio Siren when active line (or any line) has uncancelled Kontrol Jam kendala
  const isSelectedLineAlarmActive =
    isAuthenticated &&
    (lineAlarmState[selectedLine]?.issueCount || 0) > 0 &&
    !lineAlarmState[selectedLine]?.isCancelled;

  React.useEffect(() => {
    if (!isSelectedLineAlarmActive) return;

    const playSirenCycle = () => {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        [880, 660, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.16);
          gain.gain.setValueAtTime(0.11, now + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.16);
          osc.stop(now + idx * 0.16 + 0.15);
        });
        setTimeout(() => {
          ctx.close().catch(() => {});
        }, 700);
      } catch (e) {}
    };

    playSirenCycle();
    const intervalId = window.setInterval(playSirenCycle, 1800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSelectedLineAlarmActive, selectedLine]);

  // Dedicated Initial Login View
  if (!isAuthenticated) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Precision Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLine={selectedLine}
        setSelectedLine={setSelectedLine}
        currentUser={currentUser}
        users={users}
        navBars={navBars}
        serverSyncTime={serverSyncTime}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenTargetAnalysis={() => setIsTargetAnalysisOpen(true)}
        onOpenEditUser={() => setIsEditUserOpen(true)}
        onOpenPrintReport={() => setIsPrintReportOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenGoogleScript={() => setIsGoogleScriptModalOpen(true)}
        isGoogleScriptConnected={!!googleScriptConfig.webAppUrl}
        onOpenApiKeyManager={() => setIsApiKeyModalOpen(true)}
        onClearData={() => handleClearLineHourlyData(selectedLine)}
        onExportExcel={() =>
          exportProductionSheetToExcel(activeMetadata, selectedLine, currentLineData.rows)
        }
        buyerStyle={`${activeMetadata.buyer} • ${activeMetadata.style}`}
        bottleneckCount={optimizationResult.currentBalancing.bottleneckCount}
        unassignedCount={optimizationResult.currentBalancing.unassignedCount}
        attendancePresentCount={presentCount}
        totalOperatorsCount={totalOpsCount}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Hourly Production Sheet (F-SEW-005) */}
        {activeTab === "hourly" && (
          <HourlyProductionSheet
            metadata={activeMetadata}
            lineData={currentLineData}
            operators={currentLineOperators}
            currentUser={currentUser}
            workSchedule={workSchedule}
            onToggleWorkSchedule={setWorkSchedule}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onClearLineHourlyData={() => handleClearLineHourlyData(selectedLine)}
            onApplyDoubleJob={handleApplyDoubleJob}
            onApplyTandem={handleApplyTandem}
            onUpdateHourlyOutput={handleUpdateHourlyOutput}
            onUpdateRowDefects={handleUpdateRowDefects}
            onUpdateLineTargetPerHour={handleUpdateLineTargetPerHour}
            onUpdateRowTargetPerHour={handleUpdateRowTargetPerHour}
            onUpdateProcessAssignment={handleUpdateProcessAssignment}
            onOpenPrintReport={() => setIsPrintReportOpen(true)}
            onOpenSimpleBWPrint={() => setIsSimpleBWPrintOpen(true)}
            onApplyMultiProcessBundle={handleApplyMultiProcessBundle}
            onNavigateToAttendance={() => setActiveTab("attendance")}
            onNavigateToLayout={() => setActiveTab("layout")}
            onNavigateToPEDashboard={() => setActiveTab("pe-dashboard")}
            isAlarmCancelledByPE={!!lineAlarmState[selectedLine]?.isCancelled}
            onOpenGoogleScript={() => setIsGoogleScriptModalOpen(true)}
            isGoogleScriptConnected={!!googleScriptConfig.webAppUrl}
            machineRequirements={activeMachineRequirements}
            alerts={optimizationResult.alerts}
          />
        )}

        {/* VIEW 2: Operator Attendance & Skill Matrix (Max 26 Ops) */}
        {activeTab === "attendance" && (
          <OperatorAttendanceSheet
            lineId={selectedLine}
            operators={currentLineOperators}
            currentUser={currentUser}
            onUpdateOperatorAttendance={handleUpdateOperatorAttendance}
            onUpdateOperatorDetails={handleUpdateOperatorDetails}
            onBatchSetAllHadir={handleBatchSetAllHadir}
            onAddOperator={handleAddOperator}
            onDeleteOperator={handleDeleteOperator}
            onOpenSimpleBWPrint={() => setIsSimpleBWPrintOpen(true)}
          />
        )}

        {/* VIEW 3: Excel Breakdown & Sewing Machine Requirements (Per-Line BP Upload) */}
        {activeTab === "excel" && (
          <ExcelProcessBreakdown
            selectedLine={selectedLine}
            currentBP={currentLineBP}
            metadata={activeMetadata}
            processes={activeProcesses}
            machineRequirements={activeMachineRequirements}
            currentUser={currentUser}
            onUpdateProcesses={handleUpdateProcesses}
            onUpdateMetadata={handleUpdateMetadata}
            onUploadLineBP={handleUploadLineBP}
            onOpenSimpleBWPrint={() => setIsSimpleBWPrintOpen(true)}
          />
        )}

        {/* VIEW 4: Machine Layout Visualizer (Current vs Recommended Layout) */}
        {activeTab === "layout" && (
          <MachineLayoutVisualizer
            lineId={selectedLine}
            currentUser={currentUser}
            currentLayout={optimizationResult.currentLayout}
            recommendedLayout={optimizationResult.recommendedLayout}
            currentBalancing={optimizationResult.currentBalancing}
            recommendedBalancing={optimizationResult.recommendedBalancing}
            alerts={optimizationResult.alerts}
            unassignedProcesses={optimizationResult.unassignedProcesses}
            tandemAnalysis={optimizationResult.tandemAnalysis}
            machineRequirements={activeMachineRequirements}
            workingHours={effectiveWorkingHours}
            workSchedule={workSchedule}
            onToggleWorkSchedule={setWorkSchedule}
            onApplyRecommendedLayout={handleApplyRecommendedLayout}
            onOpenPrintReport={() => setIsPrintReportOpen(true)}
          />
        )}

        {/* VIEW 5: Production Engineering Decision-Support Dashboard */}
        {activeTab === "pe-dashboard" && (
          <PEDashboard
            linesData={linesData}
            allOperators={operators}
            currentUser={currentUser}
            onSelectLine={(line) => {
              setSelectedLine(line);
              setActiveTab("hourly");
            }}
            onOpenTargetAnalysis={() => setIsTargetAnalysisOpen(true)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            dailyLogs={dailyLogs}
            linesBP={linesBP}
            googleScriptConfig={googleScriptConfig}
            onSaveGoogleScriptConfig={handleSaveGoogleScriptConfig}
            onOpenGoogleScript={() => setIsGoogleScriptModalOpen(true)}
            onAddSyncLog={handleAddSyncLog}
            lineAlarmState={lineAlarmState}
            onToggleCancelLineAlarm={handleToggleCancelLineAlarm}
            onCancelAllAlarms={handleCancelAllAlarms}
          />
        )}

        {/* VIEW 6: Ketersediaan Mesin Sewing Berdasarkan Lokasi (TW1 vs TW38) */}
        {activeTab === "inventory" && (
          <MachineAvailabilityBar
            lineId={selectedLine}
            machineRequirements={activeMachineRequirements}
            currentUser={currentUser}
            onNavigateToLayout={() => setActiveTab("layout")}
          />
        )}

        {/* VIEW 7: Laporan Harian & Arsip Bulanan (September 2026) */}
        {activeTab === "daily" && (
          <DailyReportSheet
            selectedLine={selectedLine}
            currentBP={currentLineBP}
            lineData={currentLineData}
            operators={currentLineOperators}
            currentUser={currentUser}
            dailyLogs={dailyLogs}
            onSaveDailyLog={handleSaveDailyLog}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onOpenSimpleBWPrint={() => setIsSimpleBWPrintOpen(true)}
          />
        )}

        {/* VIEW 8: Akses Akun & Hak Bar (Khusus PE) */}
        {activeTab === "account-access" && (
          <AccountAccessManager
            currentUser={currentUser}
            users={users}
            navBars={navBars}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateNavBars={handleUpdateNavBars}
            onOpenApiKeyManager={() => setIsApiKeyModalOpen(true)}
          />
        )}
      </main>

      {/* Production Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-semibold text-slate-700">SEW-IE System</span>
            <span className="text-slate-400 font-mono">| Line 1, 3, 4, 5, 6, 7</span>
          </div>

          <div className="font-mono text-slate-500">
            <strong className="text-slate-800">{currentUser.name}</strong> &bull; Hadir: {presentCount}/{totalOpsCount} &bull; {currentLineBP.metadata.buyer} ({currentLineBP.metadata.style})
          </div>
        </div>
      </footer>

      {/* Target & AI Diagnostic Modal */}
      <TargetAnalysisModal
        isOpen={isTargetAnalysisOpen}
        onClose={() => setIsTargetAnalysisOpen(false)}
        lineData={currentLineData}
        operators={currentLineOperators}
        selectedLine={selectedLine}
        onSelectLine={setSelectedLine}
      />

      {/* Edit User Profile Modal */}
      <EditUserModal
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        currentUser={currentUser}
        users={users}
        onUpdateUserName={handleUpdateUserName}
      />

      {/* Comprehensive Printable Report Modal */}
      <LineLayoutPrintReport
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        metadata={activeMetadata}
        currentLineData={currentLineData}
        allLinesData={linesData}
        machineRequirements={activeMachineRequirements}
        operators={operators}
        currentUser={currentUser}
        onSelectLine={(l) => setSelectedLine(l)}
      />

      {/* Role-Based Login & Security Modal (Admin Line & PE Passwords) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onLoginSuccess={handleSwitchUser}
        onLogout={handleLogout}
      />

      {/* Google Apps Script & Google Spreadsheet Integration Modal */}
      <GoogleScriptModal
        isOpen={isGoogleScriptModalOpen}
        onClose={() => setIsGoogleScriptModalOpen(false)}
        config={googleScriptConfig}
        onSaveConfig={handleSaveGoogleScriptConfig}
        syncLogs={syncLogs}
        onAddSyncLog={handleAddSyncLog}
        onClearSyncLogs={handleClearSyncLogs}
        currentLine={selectedLine}
        activeMetadata={activeMetadata}
        currentLineRows={currentLineData.rows}
        currentOperators={currentLineOperators}
        dailyLogs={dailyLogs}
        linesData={linesData}
        linesBP={linesBP}
      />

      {/* Simple Black & White Multi-Page Print Modal */}
      <SimpleBWPrintModal
        isOpen={isSimpleBWPrintOpen}
        onClose={() => setIsSimpleBWPrintOpen(false)}
        activeTab={activeTab}
        selectedLine={selectedLine}
        currentBP={currentLineBP}
        metadata={activeMetadata}
        lineData={currentLineData}
        operators={currentLineOperators}
        processes={activeProcesses}
        machineRequirements={activeMachineRequirements}
        dailyLogs={dailyLogs}
        selectedDate={selectedDate}
      />

      {/* API Key Management & Live Monitoring Modal */}
      <ApiKeyManagerModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentLine={selectedLine}
        onRefreshData={handleRefreshServerData}
      />
    </div>
  );
}
