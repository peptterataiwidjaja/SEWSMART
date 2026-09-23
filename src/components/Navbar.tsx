import React, { useState } from "react";
import {
  Table,
  FileSpreadsheet,
  LayoutGrid,
  BarChart3,
  AlertTriangle,
  Layers,
  UserCheck,
  Shield,
  ChevronDown,
  Lock,
  Edit3,
  Printer,
  Users,
  Download,
  Calendar,
  KeyRound,
  LogIn,
  Sparkles,
  RotateCcw,
  Code2,
  LogOut,
  Image as ImageIcon,
  Sliders,
  X,
  Warehouse,
} from "lucide-react";
import { VALID_LINES } from "../data/defaultData";
import { User, LineNumber } from "../types";
import { Logo } from "./Logo";
import { LogoUploadModal } from "./LogoUploadModal";

interface NavbarProps {
  activeTab: "hourly" | "attendance" | "excel" | "layout" | "inventory" | "pe-dashboard" | "daily";
  setActiveTab: (tab: "hourly" | "attendance" | "excel" | "layout" | "inventory" | "pe-dashboard" | "daily") => void;
  selectedLine: LineNumber;
  setSelectedLine: (line: LineNumber) => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  onOpenTargetAnalysis: () => void;
  onOpenEditUser: () => void;
  onOpenPrintReport: () => void;
  onExportExcel: () => void;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  onOpenGoogleScript?: () => void;
  isGoogleScriptConnected?: boolean;
  onOpenSimpleBWPrint?: () => void;
  buyerStyle?: string;
  bottleneckCount: number;
  unassignedCount: number;
  attendancePresentCount: number;
  totalOperatorsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLine,
  setSelectedLine,
  currentUser,
  users,
  onSwitchUser,
  onOpenTargetAnalysis,
  onOpenEditUser,
  onOpenPrintReport,
  onExportExcel,
  onOpenLoginModal,
  onLogout,
  onOpenGoogleScript,
  isGoogleScriptConnected = false,
  onOpenSimpleBWPrint,
  bottleneckCount,
  unassignedCount,
  attendancePresentCount,
  totalOperatorsCount,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  // Bar aksi dan utilitas dibuat toggle tersendiri, default tertutup agar dashboard bersih
  const [isUtilityBarOpen, setIsUtilityBarOpen] = useState(false);
  const isProductionEngineer = currentUser.role === "production_engineer";

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Precision Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-red-600" />

      {/* Main Top Header - Ultra Clean Look */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Brand Logo with Upload/Change Feature */}
          <div className="flex items-center space-x-3">
            <Logo
              size="md"
              editable
              onOpenUpload={() => setIsLogoModalOpen(true)}
            />
          </div>

          {/* Clean Controls: Print B&W, Toggle Bar Aksi & User Account */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Line Issue Notification Button */}
            {(bottleneckCount > 0 || unassignedCount > 0) && (
              <button
                id="btn-nav-line-issue-alert"
                onClick={() => {
                  const elem = document.getElementById("line-issue-notification-banner");
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else if (onOpenTargetAnalysis) {
                    onOpenTargetAnalysis();
                  }
                }}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-all shadow-2xs animate-pulse"
                title={`Ada ${bottleneckCount + unassignedCount} kendala di Line ${selectedLine}! Klik untuk melihat notifikasi rincian.`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="hidden md:inline">Kendala Line:</span>
                <span className="bg-rose-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                  {bottleneckCount + unassignedCount}
                </span>
              </button>
            )}

            {/* Quick Black & White Print Button */}
            {onOpenSimpleBWPrint && (
              <button
                id="btn-nav-simple-bw-print"
                onClick={onOpenSimpleBWPrint}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-colors"
                title="Cetak sederhana hitam putih lembar kerja A4 (Hemat tinta & rapi)"
              >
                <Printer className="w-3.5 h-3.5 text-black" />
                <span>Print Hitam Putih</span>
              </button>
            )}

            {/* Toggle Bar Menu Aksi & Utilitas */}
            <button
              id="btn-toggle-utility-bar"
              onClick={() => setIsUtilityBarOpen(!isUtilityBarOpen)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                isUtilityBarOpen
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Buka / Tutup Menu Aksi & Utilitas (Google Script, Export Excel, Cetak, Sekuritas)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Menu Aksi & Utilitas</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isUtilityBarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Clean User Account Card & RBAC Dropdown */}
            <div className="relative">
              <button
                id="btn-user-switcher"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Ganti akun: Production Engineer atau Admin Line"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    isProductionEngineer ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  {isProductionEngineer ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <span className="font-mono text-[11px]">L{currentUser.assignedLine}</span>
                  )}
                </div>

                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {isProductionEngineer ? (
                      <span className="text-blue-700 font-semibold">PE Head (Semua Line)</span>
                    ) : (
                      <span className="text-red-700 font-semibold">Admin Line {currentUser.assignedLine}</span>
                    )}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* User Switcher Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Hak Akses Pengguna (RBAC)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Admin Line mengelola line masing-masing. PE memiliki akses ke seluruh line produksi.
                    </p>
                  </div>

                  <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                    {users.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      const isEng = u.role === "production_engineer";
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setIsUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? isEng
                                ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                                : "bg-red-50 text-red-900 font-bold border border-red-200"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                                isEng ? "bg-blue-600" : "bg-red-600"
                              }`}
                            >
                              {isEng ? "PE" : `L${u.assignedLine}`}
                            </div>
                            <div>
                              <div className="font-semibold">{u.name}</div>
                              <span className="text-[10px] text-slate-400 block truncate max-w-[160px]">
                                {u.title}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isEng ? "bg-blue-600" : "bg-red-600"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <button
                      id="btn-dropdown-change-logo"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsLogoModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors border border-slate-100"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ganti Logo Perusahaan</span>
                    </button>

                    <button
                      id="btn-edit-account-name"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onOpenEditUser();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center space-x-2 transition-colors border border-blue-100"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ubah Profil Akun</span>
                    </button>

                    {onLogout && (
                      <button
                        id="btn-logout-screen"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center space-x-2 transition-colors border border-rose-200"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Keluar / Ganti Akun</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Active Line Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-2 gap-2">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-semibold">
            {/* Hourly Control Sheet */}
            <button
              id="tab-hourly"
              onClick={() => setActiveTab("hourly")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "hourly"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Hourly Control (F-SEW-005)</span>
            </button>

            {/* Attendance & Skill Matrix Tab */}
            <button
              id="tab-attendance"
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap relative ${
                activeTab === "attendance"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Attendance & Grading (Maks 26 Op)</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                {attendancePresentCount}/{totalOperatorsCount}
              </span>
            </button>

            {/* Excel Breakdown & Tool Requirement */}
            <button
              id="tab-excel"
              onClick={() => setActiveTab("excel")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "excel"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Breakdown & Kebutuhan Mesin</span>
            </button>

            {/* Machine Layout Visualizer (Current vs Recommended) */}
            <button
              id="tab-layout"
              onClick={() => setActiveTab("layout")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "layout"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>Visualisasi & Rekomendasi Layout</span>
            </button>

            {/* Machine Availability Bar (TW1 vs TW38) */}
            <button
              id="tab-inventory"
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "inventory"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Warehouse className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ketersediaan Mesin (TW1/TW38)</span>
            </button>

            {/* Daily Report Sheet & Monthly Archive */}
            <button
              id="tab-daily"
              onClick={() => setActiveTab("daily")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "daily"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Laporan Harian (Sep 2026)</span>
            </button>

            {/* PE Engineering Dashboard */}
            <button
              id="tab-pe-dashboard"
              onClick={() => setActiveTab("pe-dashboard")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "pe-dashboard"
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Dasbor PE (Pareto, 6M, 5-Why)</span>
            </button>
          </nav>

          {/* Line Selector: 1, 3, 4, 5, 6, 7 (Role-gated) & Location indicator */}
          <div className="flex items-center space-x-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black border transition-all ${
                selectedLine === 1 || selectedLine === 3
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-2xs"
                  : "bg-emerald-600 text-white border-emerald-700 shadow-2xs"
              }`}
              title={
                selectedLine === 1 || selectedLine === 3
                  ? "Lokasi Pabrik: TW 1 (Khusus Line 1 & Line 3)"
                  : "Lokasi Pabrik: TW 38 (Khusus Line 4, 5, 6, 7)"
              }
            >
              {selectedLine === 1 || selectedLine === 3 ? "📍 TW1" : "📍 TW38"}
            </span>

            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Line:
            </span>
            {VALID_LINES.map((lineNum) => {
              const isSelected = selectedLine === lineNum;
              const isLineDisabled =
                !isProductionEngineer && currentUser.assignedLine !== lineNum;

              return (
                <button
                  key={lineNum}
                  id={`btn-line-${lineNum}`}
                  disabled={isLineDisabled}
                  onClick={() => {
                    if (!isLineDisabled) {
                      setSelectedLine(lineNum);
                    }
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-700 font-extrabold"
                      : isLineDisabled
                      ? "text-slate-300 cursor-not-allowed opacity-40"
                      : "text-slate-700 hover:text-blue-700 hover:bg-white"
                  }`}
                  title={
                    isLineDisabled
                      ? `Terkunci: Anda adalah Admin Line ${currentUser.assignedLine}`
                      : `Pilih Sewing Line ${lineNum}`
                  }
                >
                  {lineNum}
                  {isLineDisabled && (
                    <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1 BAR TAMBAHAN: HANYA MUNCUL KETIKA DIBUKA (TOGGLE)                       */}
      {/* ========================================================================= */}
      {isUtilityBarOpen && (
        <div className="bg-slate-50/95 border-t border-slate-200/90 px-4 sm:px-6 lg:px-8 py-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            {/* Group Actions: Scip Google, Export, Report, Sekuritas */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
                Alat & Utilitas:
              </span>

              {/* 1. Report (PDF Report / Print) */}
              <button
                id="btn-open-print-pdf-bar"
                onClick={onOpenPrintReport}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition-all border border-slate-200 hover:border-red-200 shadow-2xs"
                title="Generate PDF / Print Report Komprehensif"
              >
                <Printer className="w-3.5 h-3.5 text-red-600" />
                <span>Cetak Report (PDF)</span>
              </button>

              {/* 4. Sekuritas & Login */}
              {onOpenLoginModal && (
                <button
                  id="btn-open-login-bar"
                  onClick={onOpenLoginModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                  title="Login & Sekuritas Admin Line (Kata Sandi Per Line)"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sekuritas & Login</span>
                </button>
              )}

              {/* Print Sederhana Hitam Putih A4 */}
              {onOpenSimpleBWPrint && (
                <button
                  id="btn-open-bw-print-bar"
                  onClick={onOpenSimpleBWPrint}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all border border-slate-300 shadow-2xs"
                  title="Print Hitam Putih A4 Multi-Lembar (Hemat Tinta)"
                >
                  <Printer className="w-3.5 h-3.5 text-black" />
                  <span>Print Hitam Putih</span>
                </button>
              )}
            </div>

            {/* Right Tools: Diagnostic & Ganti Logo & Close Bar */}
            <div className="flex items-center space-x-2">
              {/* Target Diagnostic */}
              <button
                id="btn-open-analysis-bar"
                onClick={onOpenTargetAnalysis}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                  bottleneckCount > 0 || unassignedCount > 0
                    ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
                title="Diagnostik Target & Deteksi Bottleneck"
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    bottleneckCount > 0 || unassignedCount > 0
                      ? "text-amber-500 fill-amber-400"
                      : "text-slate-400"
                  }`}
                />
                <span className="hidden sm:inline">Diagnostik Target</span>
                {(bottleneckCount > 0 || unassignedCount > 0) && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
                    {bottleneckCount + unassignedCount}
                  </span>
                )}
              </button>

              {/* Ganti Logo Quick Button */}
              <button
                id="btn-quick-change-logo"
                onClick={() => setIsLogoModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 shadow-2xs transition-colors"
                title="Ganti logo pabrik / perusahaan dengan upload gambar"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Ganti Logo</span>
              </button>

              {/* Close Button for Utility Bar */}
              <button
                onClick={() => setIsUtilityBarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                title="Tutup Menu Utilitas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Upload Modal */}
      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onLogoUpdated={() => {}}
      />
    </header>
  );
};
