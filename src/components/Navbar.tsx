import React, { useState } from "react";
import {
  Table,
  FileSpreadsheet,
  BarChart3,
  AlertTriangle,
  Layers,
  Shield,
  ChevronDown,
  Lock,
  Printer,
  Users,
  Calendar,
  KeyRound,
  Sparkles,
  LogOut,
  Image as ImageIcon,
  Sliders,
  X,
  Warehouse,
  UserCog,
} from "lucide-react";
import {
  VALID_LINES,
  DEFAULT_NAV_BARS,
  ALL_PE_TABS,
  DEFAULT_ADMIN_LINE_TABS,
} from "../data/defaultData";
import { User, LineNumber, NavTabId, NavBarConfig } from "../types";
import { Logo } from "./Logo";
import { LogoUploadModal } from "./LogoUploadModal";

interface NavbarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  selectedLine: LineNumber;
  setSelectedLine: (line: LineNumber) => void;
  currentUser: User;
  users: User[];
  navBars?: NavBarConfig[];
  onSwitchUser: (user: User) => void;
  onOpenTargetAnalysis: () => void;
  onOpenEditUser: () => void;
  onOpenPrintReport: () => void;
  onExportExcel: () => void;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  onOpenGoogleScript?: () => void;
  isGoogleScriptConnected?: boolean;
  onClearData?: () => void;
  onOpenApiKeyManager?: () => void;
  serverSyncTime?: string;
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
  navBars = DEFAULT_NAV_BARS,
  serverSyncTime,
  onOpenTargetAnalysis,
  onOpenPrintReport,
  onOpenLoginModal,
  onLogout,
  onOpenSimpleBWPrint,
  onOpenApiKeyManager,
  bottleneckCount,
  unassignedCount,
  attendancePresentCount,
  totalOperatorsCount,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isUtilityBarOpen, setIsUtilityBarOpen] = useState(false);
  const isProductionEngineer = currentUser.role === "production_engineer";

  const allowedTabs: NavTabId[] =
    currentUser.allowedTabs && currentUser.allowedTabs.length > 0
      ? currentUser.allowedTabs
      : isProductionEngineer
      ? ALL_PE_TABS
      : DEFAULT_ADMIN_LINE_TABS;

  const visibleNavBars = navBars.filter((bar) => {
    if (bar.peOnly && !isProductionEngineer) return false;
    if (bar.id === "account-access") return isProductionEngineer;
    return allowedTabs.includes(bar.id);
  });

  const renderTabIcon = (id: NavTabId) => {
    switch (id) {
      case "hourly":
        return <Table className="w-3.5 h-3.5" />;
      case "attendance":
        return <Users className="w-3.5 h-3.5" />;
      case "excel":
        return <FileSpreadsheet className="w-3.5 h-3.5" />;
      case "layout":
        return <Layers className="w-3.5 h-3.5" />;
      case "inventory":
        return <Warehouse className="w-3.5 h-3.5" />;
      case "daily":
        return <Calendar className="w-3.5 h-3.5" />;
      case "pe-dashboard":
        return <BarChart3 className="w-3.5 h-3.5" />;
      case "account-access":
        return <UserCog className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Precision Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-red-600" />

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Brand Logo & Cloud Sync Status */}
          <div className="flex items-center space-x-3">
            <Logo
              size="md"
              editable
              onOpenUpload={() => setIsLogoModalOpen(true)}
            />
            {serverSyncTime && (
              <div
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 text-[10px] font-semibold text-emerald-800"
                title="Penyimpanan terpusat aktif: Setiap inputan tersimpan di server dan otomatis sinkron antar perangkat"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Multi-User Terhubung</span>
                <span className="font-mono text-emerald-600 font-normal">({serverSyncTime})</span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Line Issue Notification Button */}
            {(bottleneckCount > 0 || unassignedCount > 0) && (
              <button
                id="btn-nav-line-issue-alert"
                onClick={() => {
                  const elem = document.getElementById(
                    "line-issue-notification-banner"
                  );
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else if (onOpenTargetAnalysis) {
                    onOpenTargetAnalysis();
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-colors whitespace-nowrap"
                title={`Ada ${bottleneckCount + unassignedCount} kendala di Line ${selectedLine}`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="font-mono tabular-nums font-bold">
                  {bottleneckCount + unassignedCount}
                </span>
                <span className="hidden md:inline">Kendala</span>
              </button>
            )}

            {/* Quick Black & White Print Button */}
            {onOpenSimpleBWPrint && (
              <button
                id="btn-nav-simple-bw-print"
                onClick={onOpenSimpleBWPrint}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors whitespace-nowrap"
                title="Cetak hitam putih A4"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>Cetak</span>
              </button>
            )}

            {/* API Key & Monitoring Button */}
            {onOpenApiKeyManager && (
              <button
                id="btn-nav-api-key"
                onClick={onOpenApiKeyManager}
                className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-colors whitespace-nowrap shadow-2xs"
                title="Kelola Kunci API & Monitoring Real-Time"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden sm:inline">Kunci API</span>
              </button>
            )}

            {/* Toggle Bar Menu Aksi & Utilitas */}
            <button
              id="btn-toggle-utility-bar"
              onClick={() => setIsUtilityBarOpen(!isUtilityBarOpen)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border whitespace-nowrap ${
                isUtilityBarOpen
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Menu Utilitas"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Menu</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isUtilityBarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Account Badge & Secure Dropdown */}
            <div className="relative">
              <button
                id="btn-user-switcher"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Menu Akun"
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    isProductionEngineer ? "bg-blue-600" : "bg-emerald-600"
                  }`}
                >
                  {isProductionEngineer ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <span className="font-mono text-[11px]">
                      L{currentUser.assignedLine}
                    </span>
                  )}
                </div>

                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isProductionEngineer
                      ? "PE"
                      : `Line ${currentUser.assignedLine}`}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      User: {currentUser.username}
                    </div>
                  </div>

                  <div className="py-1 space-y-1">
                    {isProductionEngineer && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveTab("account-access");
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center space-x-2 transition-colors"
                      >
                        <UserCog className="w-3.5 h-3.5 text-blue-600" />
                        <span>Akses Akun</span>
                      </button>
                    )}

                    {onOpenApiKeyManager && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onOpenApiKeyManager();
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 flex items-center space-x-2 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Kunci API & Monitoring</span>
                      </button>
                    )}

                    {onOpenLoginModal && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onOpenLoginModal();
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                        <span>Ganti Akun (Login)</span>
                      </button>
                    )}

                    <button
                      id="btn-dropdown-change-logo"
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsLogoModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ganti Logo</span>
                    </button>

                    {onLogout && (
                      <button
                        id="btn-logout-screen"
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Keluar</span>
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
          {/* Dynamic Navigation Tabs (Filtered by user's allowedTabs & custom labels) */}
          <nav className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-semibold">
            {visibleNavBars.map((bar) => {
              const isActive = activeTab === bar.id;
              const isSpecialTab =
                bar.id === "pe-dashboard" || bar.id === "account-access";

              return (
                <button
                  key={bar.id}
                  id={`tab-${bar.id}`}
                  onClick={() => setActiveTab(bar.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? isSpecialTab
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-blue-600 text-white font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {renderTabIcon(bar.id)}
                  <span>{bar.label}</span>
                  {bar.id === "attendance" && (
                    <span
                      className={`ml-1 text-[11px] font-mono tabular-nums ${
                        isActive ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {attendancePresentCount}/{totalOperatorsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Line Selector: 1, 3, 4, 5, 6, 7 (Role-gated) */}
          <div className="flex items-center space-x-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold text-slate-600">
              {selectedLine === 1 || selectedLine === 3 ? "TW1" : "TW38"} · Line
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
                  className={`w-7 h-7 rounded-md text-xs font-mono tabular-nums font-bold transition-colors flex items-center justify-center relative ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isLineDisabled
                      ? "text-slate-300 cursor-not-allowed opacity-40"
                      : "text-slate-700 hover:text-blue-700 hover:bg-white"
                  }`}
                  title={
                    isLineDisabled
                      ? `Terkunci (Line ${currentUser.assignedLine})`
                      : `Line ${lineNum}`
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

      {/* Utility Bar */}
      {isUtilityBarOpen && (
        <div className="bg-slate-50/95 border-t border-slate-200/90 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
                Utilitas:
              </span>

              <button
                id="btn-open-print-pdf-bar"
                onClick={onOpenPrintReport}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition-all border border-slate-200 hover:border-red-200 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-red-600" />
                <span>Cetak Report (PDF)</span>
              </button>

              {onOpenLoginModal && (
                <button
                  id="btn-open-login-bar"
                  onClick={onOpenLoginModal}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ganti Akun</span>
                </button>
              )}

              {onOpenSimpleBWPrint && (
                <button
                  id="btn-open-bw-print-bar"
                  onClick={onOpenSimpleBWPrint}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all border border-slate-300 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-black" />
                  <span>Print Hitam Putih</span>
                </button>
              )}

              {onOpenApiKeyManager && (
                <button
                  id="btn-open-api-key-util-bar"
                  onClick={onOpenApiKeyManager}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all border border-indigo-200 shadow-2xs"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Kunci API & Integrasi</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-open-analysis-bar"
                onClick={onOpenTargetAnalysis}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                  bottleneckCount > 0 || unassignedCount > 0
                    ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
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

              <button
                id="btn-quick-change-logo"
                onClick={() => setIsLogoModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 shadow-2xs transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Ganti Logo</span>
              </button>

              <button
                onClick={() => setIsUtilityBarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
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
