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
  const [filterGroup, setFilterGroup] = useState<string>("used");
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-4">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
              <Warehouse className="w-4 h-4 text-blue-400" />
              <span>Stok Mesin &bull; Lokasi {currentLocation}</span>
            </h2>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200">
              {currentLocation === "TW1" ? "Line 1 & 3" : "Line 4 - 7"}
            </span>

            {locationMetrics.shortageCount > 0 ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                <AlertTriangle className="w-3 h-3" />
                <span>Defisit {locationMetrics.shortageCount} Tipe</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Aman</span>
              </span>
            )}
          </div>

          {/* Quick Tab Mode Switches */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setViewMode("location")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === "location"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>{currentLocation}</span>
            </button>

            <button
              onClick={() => setViewMode("factory")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === "factory"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === "master"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Master (534)</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {viewMode === "location" ? `Stok ${currentLocation}` : "Stok Pabrik"}
            </span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">
              {viewMode === "location" ? locationMetrics.totalLocationNormal : factoryMetrics.factoryNormal}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-blue-300 block">
              Line {lineId}
            </span>
            <span className="text-xl font-black text-blue-200 font-mono mt-0.5 block">
              {locationMetrics.totalLineAllocated}/26
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-amber-300 block">
              Line Lain
            </span>
            <span className="text-xl font-black text-amber-200 font-mono mt-0.5 block">
              {viewMode === "location"
                ? locationMetrics.totalCoLocatedAllocated
                : factoryMetrics.factoryUsed - locationMetrics.totalLineAllocated}
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-emerald-300 block">
              Sisa Bebas
            </span>
            <span className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">
              {viewMode === "location" ? locationMetrics.remainingInLocation : factoryMetrics.remainingFactory}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Total Aset
            </span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">534</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      {viewMode !== "master" && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mesin..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterGroup("used")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterGroup === "used" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Terpakai ({machineRequirements.length})
              </button>
              <button
                onClick={() => setFilterGroup("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterGroup === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({allGroups.length})
              </button>
            </div>

            <button
              onClick={() => setShowOnlyShortages(!showOnlyShortages)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                showOnlyShortages
                  ? "bg-rose-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-current" />
              <span>Defisit</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW: VISUAL AVAILABILITY BARS */}
      {viewMode !== "master" && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayRows.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
              Tidak ada mesin yang sesuai filter.
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

              const maxScale = Math.max(totalStock, usedThis + usedOther, 1);
              const pctThis = Math.min(100, Math.round((usedThis / maxScale) * 100));
              const pctOther = Math.min(100 - pctThis, Math.round((usedOther / maxScale) * 100));
              const pctRemaining = Math.max(0, 100 - pctThis - pctOther);

              return (
                <div
                  key={row.group}
                  className={`p-3 rounded-xl transition-all border ${
                    isShortage
                      ? "bg-rose-50/70 border-rose-300"
                      : isTight
                      ? "bg-amber-50/50 border-amber-300"
                      : row.allocatedThisLine > 0
                      ? "bg-blue-50/20 border-blue-200/80"
                      : "bg-slate-50/40 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="px-2 py-1 bg-slate-900 text-white rounded-lg font-mono font-bold text-xs shrink-0">
                        {row.group}
                      </span>
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {row.displayName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 font-mono text-xs">
                      {isShortage ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[11px]">
                          Defisit {Math.abs(remaining)}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          Sisa +{remaining}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMachineForDetails(row.group);
                          setViewMode("master");
                        }}
                        className="p-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                        title="Lihat detail inventaris"
                      >
                        <Search className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Stacked Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden flex">
                    {pctThis > 0 && (
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${pctThis}%` }}
                      />
                    )}
                    {pctOther > 0 && (
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${pctOther}%` }}
                      />
                    )}
                    {!isShortage && pctRemaining > 0 && (
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${pctRemaining}%` }}
                      />
                    )}
                    {isShortage && (
                      <div className="h-full bg-rose-600 w-full" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono mt-1.5">
                    <span>Line {lineId}: <strong className="text-blue-700">{usedThis}</strong></span>
                    <span>Line Lain: <strong className="text-amber-700">{usedOther}</strong></span>
                    <span>Stok: <strong className="text-slate-900">{totalStock}</strong></span>
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
