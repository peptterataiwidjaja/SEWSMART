import React, { useState, useMemo } from "react";
import {
  MachineRequirement,
  LineNumber,
  User,
} from "../types";
import {
  FACTORY_MACHINE_INVENTORY_RAW,
  getAggregatedMachineInventory,
  getLineFactoryLocation,
  getCoLocatedLines,
  normalizeMachineGroupKey,
  MachineInventoryRecord,
  LocationGroupSummary,
} from "../data/factoryMachineInventory";
import {
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Info,
  Warehouse,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Table,
  ShieldAlert,
} from "lucide-react";

interface MachineAvailabilityBarProps {
  lineId: LineNumber;
  machineRequirements: MachineRequirement[];
  currentUser?: User;
  onNavigateToLayout?: () => void;
  compact?: boolean;
}

export const MachineAvailabilityBar: React.FC<MachineAvailabilityBarProps> = ({
  lineId,
  machineRequirements,
  currentUser,
  onNavigateToLayout,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<"location" | "factory" | "master">("location");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyShortages, setShowOnlyShortages] = useState<boolean>(false);
  const [selectedMachineForDetails, setSelectedMachineForDetails] = useState<string | null>(null);

  // Modal Master Inventory Filter States
  const [modalLocationFilter, setModalLocationFilter] = useState<string>("ALL");
  const [modalConditionFilter, setModalConditionFilter] = useState<string>("ALL");
  const [modalSearch, setModalSearch] = useState<string>("");

  const currentLocation = getLineFactoryLocation(lineId);
  const coLocatedLines = getCoLocatedLines(lineId).filter((id) => id !== lineId);
  const aggregatedInventory = useMemo(() => getAggregatedMachineInventory(), []);

  // Map of machine requirements for fast lookup
  const reqMap = useMemo(() => {
    const map = new Map<string, MachineRequirement>();
    machineRequirements.forEach((r) => {
      const norm = normalizeMachineGroupKey(r.machineType);
      map.set(norm, r);
      map.set(r.machineType, r);
    });
    return map;
  }, [machineRequirements]);

  // All distinct machine groups in factory inventory + from requirements
  const allGroups = useMemo(() => {
    const set = new Set<string>();
    Object.keys(aggregatedInventory).forEach((g) => set.add(g));
    machineRequirements.forEach((r) => {
      set.add(normalizeMachineGroupKey(r.machineType));
    });
    return Array.from(set).sort();
  }, [aggregatedInventory, machineRequirements]);

  // Summary Metrics for the Active Location
  const locationMetrics = useMemo(() => {
    let totalLocationNormal = 0;
    let totalLineAllocated = 0;
    let totalCoLocatedAllocated = 0;
    let shortageCount = 0;

    machineRequirements.forEach((req) => {
      totalLineAllocated += req.allocatedMachines;
      totalCoLocatedAllocated += req.usedInCoLocatedLines || 0;
      if (req.locationShortageOrSurplus !== undefined && req.locationShortageOrSurplus < 0) {
        shortageCount += 1;
      }
    });

    // Sum all normal condition machines for this location
    (Object.values(aggregatedInventory) as LocationGroupSummary[]).forEach((sum) => {
      totalLocationNormal += currentLocation === "TW1" ? sum.tw1Normal : sum.tw38Normal;
    });

    const totalUsedInLocation = totalLineAllocated + totalCoLocatedAllocated;
    const remainingInLocation = Math.max(0, totalLocationNormal - totalUsedInLocation);

    return {
      totalLocationNormal,
      totalLineAllocated,
      totalCoLocatedAllocated,
      totalUsedInLocation,
      remainingInLocation,
      shortageCount,
    };
  }, [machineRequirements, aggregatedInventory, currentLocation]);

  // Factory Wide Metrics
  const factoryMetrics = useMemo(() => {
    let factoryNormal = 0;
    let factoryTotal = 0;
    let factoryUsed = 0;
    let factoryRusak = 0;
    let factoryTerjual = 0;

    (Object.values(aggregatedInventory) as LocationGroupSummary[]).forEach((sum) => {
      factoryNormal += sum.normalTotal;
      factoryTotal += sum.totalPabrik;
      factoryRusak += sum.rusakTotal;
      factoryTerjual += sum.terjualTotal;
    });

    machineRequirements.forEach((req) => {
      factoryUsed += req.allocatedMachines + (req.usedInOtherLines || 0);
    });

    const remainingFactory = Math.max(0, factoryNormal - factoryUsed);

    return {
      factoryNormal,
      factoryTotal,
      factoryUsed,
      factoryRusak,
      factoryTerjual,
      remainingFactory,
    };
  }, [aggregatedInventory, machineRequirements]);

  // Filtered rows for the Bar Display
  const displayRows = useMemo(() => {
    // If filterGroup is set, only show that group
    let groups = allGroups;

    if (filterGroup === "used") {
      groups = groups.filter((g) => reqMap.has(g));
    } else if (filterGroup !== "all") {
      groups = groups.filter((g) => g === filterGroup);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      groups = groups.filter((g) => g.toLowerCase().includes(q));
    }

    return groups.map((grp) => {
      const agg = aggregatedInventory[grp] || {
        machineGroup: grp,
        displayName: grp,
        totalPabrik: 0,
        normalTotal: 0,
        tw1Normal: 0,
        tw38Normal: 0,
        rusakTotal: 0,
        terjualTotal: 0,
      };

      const req = reqMap.get(grp);
      const allocatedThisLine = req?.allocatedMachines || 0;
      const theoreticalThisLine = req?.theoreticalMachines || 0;
      const processCount = req?.processCount || 0;

      // Location based values
      const locationStockNormal = currentLocation === "TW1" ? agg.tw1Normal : agg.tw38Normal;
      const usedByCoLocated = req?.usedInCoLocatedLines || 0;
      const totalUsedInLoc = allocatedThisLine + usedByCoLocated;
      const remainingInLoc = locationStockNormal - totalUsedInLoc;
      const isLocationShortage = remainingInLoc < 0;
      const isLocationTight = remainingInLoc >= 0 && remainingInLoc <= 1 && allocatedThisLine > 0;

      // Factory based values
      const factoryStockNormal = agg.normalTotal;
      const usedByOtherLines = req?.usedInOtherLines || 0;
      const totalUsedFactory = allocatedThisLine + usedByOtherLines;
      const remainingFactory = factoryStockNormal - totalUsedFactory;
      const isFactoryShortage = remainingFactory < 0;

      return {
        group: grp,
        displayName: req?.displayName || agg.displayName || grp,
        req,
        allocatedThisLine,
        theoreticalThisLine,
        processCount,
        // Location stats
        locationStockNormal,
        usedByCoLocated,
        totalUsedInLoc,
        remainingInLoc,
        isLocationShortage,
        isLocationTight,
        // Factory stats
        factoryStockNormal,
        usedByOtherLines,
        totalUsedFactory,
        remainingFactory,
        isFactoryShortage,
        rusakTotal: agg.rusakTotal,
        terjualTotal: agg.terjualTotal,
        totalPabrik: agg.totalPabrik,
      };
    }).filter((row) => {
      if (showOnlyShortages) {
        return viewMode === "location" ? row.isLocationShortage || row.isLocationTight : row.isFactoryShortage;
      }
      return true;
    });
  }, [allGroups, filterGroup, searchQuery, reqMap, aggregatedInventory, currentLocation, showOnlyShortages, viewMode]);

  // Master Inventory Table filtered records
  const masterFilteredRecords = useMemo(() => {
    return FACTORY_MACHINE_INVENTORY_RAW.filter((item) => {
      if (selectedMachineForDetails) {
        const norm = normalizeMachineGroupKey(item.machineGroup);
        const targetNorm = normalizeMachineGroupKey(selectedMachineForDetails);
        if (norm !== targetNorm && item.machineGroup !== selectedMachineForDetails) {
          return false;
        }
      }

      if (modalLocationFilter !== "ALL" && item.location !== modalLocationFilter) {
        return false;
      }

      if (modalConditionFilter !== "ALL" && item.condition !== modalConditionFilter) {
        return false;
      }

      if (modalSearch.trim()) {
        const q = modalSearch.toLowerCase();
        return (
          item.inventoryNo.toLowerCase().includes(q) ||
          item.machineName.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.machineGroup.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedMachineForDetails, modalLocationFilter, modalConditionFilter, modalSearch]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Top Banner: Location Allocation Rule Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Warehouse className="w-3.5 h-3.5 text-blue-400" />
                <span>Line {lineId} &bull; Lokasi {currentLocation}</span>
              </span>

              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentLocation === "TW1"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-400/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                }`}
              >
                <span>
                  Peruntukan: {currentLocation === "TW1" ? "Line 1 & Line 3" : "Line 4, 5, 6, 7"}
                </span>
              </span>

              {locationMetrics.shortageCount > 0 ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Defisit {locationMetrics.shortageCount} Tipe Mesin</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ketersediaan Aman</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Bar Ketersediaan Mesin Sewing & Alokasi Lokasi</span>
            </h2>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Data inventaris mesin terverifikasi di pabrik. Mesin di lokasi <strong>TW 1</strong> dialokasikan
              khusus untuk <strong>Line 1 dan Line 3</strong>. Mesin di lokasi <strong>TW 38</strong> diperuntukkan
              untuk <strong>Line 4, 5, 6, 7</strong>. Pemakaian di satu line secara otomatis mengurangi ketersediaan
              unit di lokasi dan pabrik.
            </p>
          </div>

          {/* Quick Tab Mode Switches */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setViewMode("location")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                viewMode === "location"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/50 border border-blue-400/40"
                  : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Lokasi {currentLocation}</span>
            </button>

            <button
              onClick={() => setViewMode("factory")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                viewMode === "factory"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/50 border border-blue-400/40"
                  : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Semua Pabrik</span>
            </button>

            <button
              onClick={() => {
                setSelectedMachineForDetails(null);
                setViewMode("master");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                viewMode === "master"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/50 border border-blue-400/40"
                  : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Master Data (534 Unit)</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              {viewMode === "location" ? `Stok Normal di ${currentLocation}` : "Stok Normal Pabrik"}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-white">
                {viewMode === "location" ? locationMetrics.totalLocationNormal : factoryMetrics.factoryNormal}
              </span>
              <span className="text-xs text-slate-300 font-semibold">Unit Siap Pakai</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Kondisi Normal (Bagus)</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
              Terpakai di Line {lineId}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-blue-200">
                {locationMetrics.totalLineAllocated}
              </span>
              <span className="text-xs text-slate-300 font-semibold">dari 26 Meja</span>
            </div>
            <span className="text-[10px] text-blue-300/80 block mt-0.5">Khusus Mesin Sewing</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
              {viewMode === "location"
                ? `Terpakai Line Sekawan (${coLocatedLines.length > 0 ? `Line ${coLocatedLines.join(",")}` : "-"})`
                : "Terpakai di Line Lain"}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-amber-200">
                {viewMode === "location" ? locationMetrics.totalCoLocatedAllocated : factoryMetrics.factoryUsed - locationMetrics.totalLineAllocated}
              </span>
              <span className="text-xs text-slate-300 font-semibold">Unit</span>
            </div>
            <span className="text-[10px] text-amber-300/80 block mt-0.5">
              {viewMode === "location" ? `Di Lokasi ${currentLocation}` : "Luar Line Ini"}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
              {viewMode === "location" ? `Sisa Bebas di ${currentLocation}` : "Sisa Bebas Pabrik"}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-300">
                {viewMode === "location" ? locationMetrics.remainingInLocation : factoryMetrics.remainingFactory}
              </span>
              <span className="text-xs text-slate-300 font-semibold">Unit</span>
            </div>
            <span className="text-[10px] text-emerald-300/80 block mt-0.5">Cadangan Siap Tarik</span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Total Master Asset
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-white">534</span>
              <span className="text-xs text-slate-300 font-semibold">Unit Mesin</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              TW1: 172 &bull; TW38: 312 &bull; Rusak: {factoryMetrics.factoryRusak}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      {viewMode !== "master" && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kelompok mesin (SN, OL 3, Kansai, dll)..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-72"
              />
            </div>

            {/* Quick Filter: All vs Used vs Shortage */}
            <div className="flex items-center space-x-1 bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterGroup("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterGroup === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Grup ({allGroups.length})
              </button>
              <button
                onClick={() => setFilterGroup("used")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterGroup === "used" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Terpakai di Line ({machineRequirements.length})
              </button>
            </div>

            <button
              onClick={() => setShowOnlyShortages(!showOnlyShortages)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                showOnlyShortages
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-current" />
              <span>Hanya Defisit / Kritis</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong>{displayRows.length}</strong> kelompok mesin &bull;{" "}
            <span className="text-blue-700 font-semibold">
              {viewMode === "location" ? `Alokasi Lokasi ${currentLocation}` : "Kapasitas Keseluruhan Pabrik"}
            </span>
          </div>
        </div>
      )}

      {/* VIEW: VISUAL AVAILABILITY BARS */}
      {viewMode !== "master" && (
        <div className="p-4 sm:p-6 space-y-4 divide-y divide-slate-100">
          {displayRows.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Warehouse className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Tidak ada mesin yang sesuai dengan kriteria filter saat ini.</p>
            </div>
          ) : (
            displayRows.map((row) => {
              const isLocationView = viewMode === "location";
              const totalStock = isLocationView ? row.locationStockNormal : row.factoryStockNormal;
              const usedThis = row.allocatedThisLine;
              const usedOther = isLocationView ? row.usedByCoLocated : row.usedByOtherLines;
              const remaining = isLocationView ? row.remainingInLoc : row.remainingFactory;
              const isShortage = isLocationView ? row.isLocationShortage : row.isFactoryShortage;
              const isTight = isLocationView ? row.isLocationTight : remaining >= 0 && remaining <= 1 && usedThis > 0;

              // Percentage computations for stacked progress bar
              const maxScale = Math.max(totalStock, usedThis + usedOther, 1);
              const pctThis = Math.min(100, Math.round((usedThis / maxScale) * 100));
              const pctOther = Math.min(100 - pctThis, Math.round((usedOther / maxScale) * 100));
              const pctRemaining = Math.max(0, 100 - pctThis - pctOther);

              return (
                <div
                  key={row.group}
                  className={`pt-4 first:pt-0 p-4 rounded-2xl transition-all border ${
                    isShortage
                      ? "bg-rose-50/80 border-rose-300 shadow-xs"
                      : isTight
                      ? "bg-amber-50/50 border-amber-300"
                      : row.allocatedThisLine > 0
                      ? "bg-blue-50/30 border-blue-200/80"
                      : "bg-slate-50/40 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2.5">
                    {/* Left: Group Badge & Name */}
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-mono font-black text-xs shadow-xs">
                        {row.group}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-sm">{row.displayName}</span>
                          {row.allocatedThisLine > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                              Terplot di Line {lineId}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {row.processCount > 0 ? (
                            <span>
                              {row.processCount} proses &bull; Kebutuhan Teoretis:{" "}
                              <strong>{row.theoreticalThisLine}</strong> unit
                            </span>
                          ) : (
                            <span>Belum dialokasikan pada proses sewing line ini</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Metrics and Status Badge */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                      <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        Line {lineId}: <strong className="text-blue-700">{usedThis} unit</strong>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        {isLocationView
                          ? `Line ${coLocatedLines.join(",") || "Sekawan"}: `
                          : "Line Lain: "}
                        <strong className="text-amber-700">{usedOther} unit</strong>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                        {isLocationView ? `Total ${currentLocation}: ` : "Total Pabrik: "}
                        <strong className="text-slate-900">{totalStock} unit</strong>
                      </div>

                      {/* Status Badges */}
                      {isShortage ? (
                        <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center space-x-1 shadow-xs animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>DEFISIT {Math.abs(remaining)} UNIT!</span>
                        </span>
                      ) : isTight ? (
                        <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300">
                          Sisa Kritis ({remaining} unit)
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs border border-emerald-300">
                          Sisa Bebas: +{remaining} unit
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedMachineForDetails(row.group);
                          setViewMode("master");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition-all flex items-center space-x-1"
                        title="Lihat nomor inventaris fisik mesin ini"
                      >
                        <Search className="w-3 h-3 text-slate-500" />
                        <span>Rincian</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Stacked Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3.5 bg-slate-200/80 rounded-full overflow-hidden flex relative shadow-inner">
                      {/* Segment 1: Used by this line */}
                      {pctThis > 0 && (
                        <div
                          className="h-full bg-blue-600 transition-all duration-300 relative group"
                          style={{ width: `${pctThis}%` }}
                          title={`Line ${lineId}: ${usedThis} unit`}
                        />
                      )}
                      {/* Segment 2: Used by sister lines */}
                      {pctOther > 0 && (
                        <div
                          className="h-full bg-amber-500 transition-all duration-300 relative group"
                          style={{ width: `${pctOther}%` }}
                          title={`Line Sekawan: ${usedOther} unit`}
                        />
                      )}
                      {/* Segment 3: Free stock */}
                      {!isShortage && pctRemaining > 0 && (
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300 relative group"
                          style={{ width: `${pctRemaining}%` }}
                          title={`Sisa Bebas: ${remaining} unit`}
                        />
                      )}
                      {/* Shortage indicator overlay */}
                      {isShortage && (
                        <div
                          className="h-full bg-rose-600/90 animate-pulse"
                          style={{ width: "100%" }}
                          title={`Defisit ${Math.abs(remaining)} unit!`}
                        />
                      )}
                    </div>

                    {/* Progress Bar Legend & Details */}
                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                          <span>Line {lineId} ({usedThis})</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                          <span>{isLocationView ? `Line Sekawan ${coLocatedLines.join(",")}` : "Line Lain"} ({usedOther})</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                          <span>Sisa Siap Pakai ({Math.max(0, remaining)})</span>
                        </span>
                      </div>

                      <div className="text-slate-600">
                        {isLocationView ? (
                          <span>
                            Total Pabrik: {row.totalPabrik} unit (TW1: {aggregatedInventory[row.group]?.tw1Normal || 0} &bull; TW38: {aggregatedInventory[row.group]?.tw38Normal || 0} &bull; Rusak: {row.rusakTotal})
                          </span>
                        ) : (
                          <span>
                            TW1: {aggregatedInventory[row.group]?.tw1Normal || 0} unit &bull; TW38: {aggregatedInventory[row.group]?.tw38Normal || 0} unit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW: MASTER INVENTORY DATA (534 UNITS FULL TABLE) */}
      {viewMode === "master" && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span>
                  Master Data Inventaris Mesin Pabrik{" "}
                  {selectedMachineForDetails ? `(Filter Kelompok: ${selectedMachineForDetails})` : "(534 Unit)"}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian nomor inventaris, merk, tanggal pembelian, lokasi, dan kondisi teknis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedMachineForDetails && (
                <button
                  onClick={() => setSelectedMachineForDetails(null)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold transition-all"
                >
                  Tampilkan Semua Mesin
                </button>
              )}

              {/* Location Filter */}
              <select
                value={modalLocationFilter}
                onChange={(e) => setModalLocationFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="ALL">Semua Lokasi</option>
                <option value="TW1">Lokasi TW1 (Line 1 & 3)</option>
                <option value="TW38">Lokasi TW38 (Line 4, 5, 6, 7)</option>
                <option value="TEBET">Lokasi TEBET</option>
                <option value="TERJUAL">TERJUAL</option>
              </select>

              {/* Condition Filter */}
              <select
                value={modalConditionFilter}
                onChange={(e) => setModalConditionFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="ALL">Semua Kondisi</option>
                <option value="Normal">Normal (Siap Pakai)</option>
                <option value="Rusak">Rusak (Perbaikan)</option>
                <option value="Terjual">Terjual</option>
              </select>

              {/* Search */}
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Cari No. Inventaris / Merk..."
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
          </div>

          {/* Master Inventory Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-mono sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nomor Inventaris</th>
                  <th className="py-2.5 px-3">Nama Mesin</th>
                  <th className="py-2.5 px-3">Merk</th>
                  <th className="py-2.5 px-3 text-center">Kelompok</th>
                  <th className="py-2.5 px-3 text-center">Lokasi</th>
                  <th className="py-2.5 px-3 text-center">Kondisi</th>
                  <th className="py-2.5 px-3">Asal (Made In)</th>
                  <th className="py-2.5 px-3">Tgl Beli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {masterFilteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Tidak ada data inventaris yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  masterFilteredRecords.map((item, idx) => (
                    <tr
                      key={item.inventoryNo + idx}
                      className={`hover:bg-slate-50 ${
                        item.condition === "Rusak"
                          ? "bg-rose-50/40"
                          : item.condition === "Terjual"
                          ? "bg-slate-100/60 opacity-60"
                          : ""
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{item.inventoryNo}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{item.machineName}</td>
                      <td className="py-2 px-3 text-slate-600">{item.brand}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-[10px]">
                          {item.machineGroup}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono font-extrabold text-[10px] ${
                            item.location === "TW1"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : item.location === "TW38"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.location}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.condition === "Normal"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.condition === "Rusak"
                              ? "bg-rose-100 text-rose-800 font-black"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{item.madeIn}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                        {item.purchaseDate?.split(" ")[0] || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
            <span>
              Total records terfilter: <strong>{masterFilteredRecords.length}</strong> unit
            </span>
            <span>
              Standar Pabrik: TW1 (Line 1 & 3) &bull; TW38 (Line 4, 5, 6, 7)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
