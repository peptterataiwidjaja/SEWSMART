import React, { useState, useRef } from "react";
import { ProcessItem, StyleMetadata, MachineRequirement, User, LineNumber, LineBPData } from "../types";
import {
  FileSpreadsheet,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  Sliders,
  Cpu,
  Layers,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Shield,
  FileCheck,
  Printer,
} from "lucide-react";
import { parseExcelOrCsv, calculateMachineRequirements, isPlottableSewingProcess } from "../utils/excelParser";
import { FACTORY_MACHINE_INVENTORY } from "../utils/lineBalancing";
import { MachineAvailabilityBar } from "./MachineAvailabilityBar";

interface ExcelProcessBreakdownProps {
  selectedLine: LineNumber;
  currentBP: LineBPData;
  metadata: StyleMetadata;
  processes: ProcessItem[];
  machineRequirements: MachineRequirement[];
  currentUser: User;
  onUpdateProcesses: (newProcesses: ProcessItem[]) => void;
  onUpdateMetadata: (newMetadata: StyleMetadata) => void;
  onUploadLineBP?: (lineId: LineNumber, processes: ProcessItem[], metadata: StyleMetadata, fileName: string) => void;
  onOpenSimpleBWPrint?: () => void;
}

export const ExcelProcessBreakdown: React.FC<ExcelProcessBreakdownProps> = ({
  selectedLine,
  currentBP,
  metadata,
  processes,
  machineRequirements,
  currentUser,
  onUpdateProcesses,
  onUpdateMetadata,
  onUploadLineBP,
  onOpenSimpleBWPrint,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New process input row state
  const [newProcess, setNewProcess] = useState<Partial<ProcessItem>>({
    section: "SEWING",
    subSection: "ASSEMBLY",
    process: "",
    machine: "SN",
    cycleTime: 45,
    smv: 0.75,
    sam: 0.86,
  });

  // Parameters editing state
  const [isEditingParams, setIsEditingParams] = useState(false);
  const [editParams, setEditParams] = useState({
    targetPerHour: metadata.lineTargetPerHour,
    workingHours: metadata.workingHours,
    allowancePct: metadata.allowancePercentage || 15,
  });

  const canEdit =
    currentUser.role === "production_engineer" || currentUser.assignedLine === selectedLine;

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canEdit) {
      setUploadError(`Akses Ditolak: Anda login sebagai ${currentUser.name}. Hanya Admin Line ${selectedLine} atau PE yang dapat mengunggah BP untuk Sewing Line ${selectedLine}.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const parsed = await parseExcelOrCsv(file);
      if (onUploadLineBP) {
        onUploadLineBP(selectedLine, parsed.processes, parsed.metadata, file.name);
      } else {
        onUpdateProcesses(parsed.processes);
        onUpdateMetadata(parsed.metadata);
      }
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setUploadError("Gagal membaca file Excel. Pastikan format kolom sesuai template breakdown.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add process
  const handleAddProcess = () => {
    if (!newProcess.process || !newProcess.machine) return;

    // ATURAN STRICT: Hanya memasukkan semua kategori KECUALI Automachine dan helper untuk plot line
    if (
      !isPlottableSewingProcess({
        section: newProcess.section,
        subSection: newProcess.subSection,
        process: newProcess.process,
        machine: newProcess.machine,
      })
    ) {
      setUploadError(
        "Kategori Automachine dan Helper tidak dimasukkan ke dalam plot line sewing. Hanya proses sewing murni yang diperbolehkan."
      );
      return;
    }

    const nextNo = processes.length > 0 ? Math.max(...processes.map((p) => p.no)) + 1 : 1;
    const cycleTime = Number(newProcess.cycleTime) || 45;
    const smv = Number(newProcess.smv) || Number((cycleTime / 60).toFixed(2));
    const allowancePct = metadata.allowancePercentage || 15;
    const sam = Number((smv * (1 + allowancePct / 100)).toFixed(2));

    const item: ProcessItem = {
      no: nextNo,
      section: newProcess.section || "SEWING",
      subSection: newProcess.subSection || "ASSEMBLY",
      process: newProcess.process,
      machine: newProcess.machine,
      cycleTime,
      smv,
      sam,
    };

    onUpdateProcesses([...processes, item]);
    setNewProcess({
      section: "SEWING",
      subSection: "ASSEMBLY",
      process: "",
      machine: "SN",
      cycleTime: 45,
      smv: 0.75,
      sam: 0.86,
    });
  };

  // Delete process
  const handleDeleteProcess = (no: number) => {
    onUpdateProcesses(processes.filter((p) => p.no !== no));
  };

  // Update parameters
  const handleSaveParameters = () => {
    const newTargetPerHour = Number(editParams.targetPerHour) || 10;
    const newWorkingHours = Number(editParams.workingHours) || 8;
    const newAllowance = Number(editParams.allowancePct) || 15;

    // Recalculate SAM on processes
    const updatedProcesses = processes.map((p) => ({
      ...p,
      sam: Number((p.smv * (1 + newAllowance / 100)).toFixed(2)),
    }));

    const totalSMV = Number(updatedProcesses.reduce((sum, p) => sum + p.smv, 0).toFixed(2));
    const totalSAM = Number(updatedProcesses.reduce((sum, p) => sum + p.sam, 0).toFixed(2));

    onUpdateMetadata({
      ...metadata,
      workingHours: newWorkingHours,
      lineTargetPerHour: newTargetPerHour,
      lineTargetPerDay: newTargetPerHour * newWorkingHours,
      allowancePercentage: newAllowance,
      totalSMV,
      totalSAM,
    });

    onUpdateProcesses(updatedProcesses);
    setIsEditingParams(false);
  };

  const totalSMVSum = processes.reduce((s, p) => s + p.smv, 0).toFixed(2);
  const totalSAMSum = processes.reduce((s, p) => s + (p.sam || p.smv * 1.15), 0).toFixed(2);
  const totalCycleTimeSum = processes.reduce((s, p) => s + p.cycleTime, 0);

  return (
    <div className="space-y-4">
      {/* Header & Upload Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            L{selectedLine}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Breakdown Proses &bull; Line {selectedLine}
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                {processes.length} Operasi
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                {currentBP.fileName || "BP_Active.xlsx"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !canEdit}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            {canEdit ? <Upload className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isUploading ? "Memproses..." : "Upload Excel"}</span>
          </button>

          <button
            onClick={() => setIsEditingParams(!isEditingParams)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Target</span>
          </button>

          {onOpenSimpleBWPrint && (
            <button
              onClick={onOpenSimpleBWPrint}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-black" />
              <span>Print</span>
            </button>
          )}
        </div>
      </div>

      {processes.length > 26 && (
        <div className="px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center space-x-2.5">
          <Layers className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>{processes.length} Operasi (&gt;26 Stasiun):</strong> Alokasikan Multi-Proses (1 operator pegang 2-3 proses ringan).
          </span>
        </div>
      )}

      {!canEdit && (
        <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Mode Baca Saja ({currentUser.name}).</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Breakdown proses berhasil diperbarui.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Parameter Analisis Drawer / Modal */}
      {isEditingParams && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Parameter Target
            </div>
            <button
              onClick={() => setIsEditingParams(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target / Jam (pcs):</label>
              <input
                type="number"
                value={editParams.targetPerHour}
                onChange={(e) => setEditParams({ ...editParams, targetPerHour: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Jam Kerja / Hari:</label>
              <input
                type="number"
                value={editParams.workingHours}
                onChange={(e) => setEditParams({ ...editParams, workingHours: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Allowance (%):</label>
              <input
                type="number"
                value={editParams.allowancePct}
                onChange={(e) => setEditParams({ ...editParams, allowancePct: Number(e.target.value) })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveParameters}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Total SMV</div>
          <div className="text-2xl font-mono font-black text-blue-700 mt-0.5">{totalSMVSum} mnt</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Total SAM</div>
          <div className="text-2xl font-mono font-black text-indigo-700 mt-0.5">{totalSAMSum} mnt</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Waktu Siklus</div>
          <div className="text-2xl font-mono font-black text-slate-800 mt-0.5">{totalCycleTimeSum} dtk</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500">Takt Time</div>
          <div className="text-2xl font-mono font-black text-emerald-600 mt-0.5">
            {metadata.lineTargetPerHour > 0 ? Math.round(3600 / metadata.lineTargetPerHour) : 360} dtk
          </div>
        </div>
      </div>

      {/* BAR KETERSEDIAAN MESIN BERDASARKAN LOKASI (TW1 vs TW38) */}
      <MachineAvailabilityBar
        lineId={selectedLine}
        machineRequirements={machineRequirements}
        currentUser={currentUser}
      />

      {/* Kebutuhan Mesin */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Kebutuhan Mesin Line {selectedLine}</span>
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              Alokasi: {machineRequirements.reduce((sum, m) => sum + m.allocatedMachines, 0)}/26
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
              Line Lain: {machineRequirements.reduce((sum, m) => sum + (m.usedInOtherLines || 0), 0)}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800">
              Sisa Pabrik: {machineRequirements.reduce((sum, m) => sum + Math.max(0, m.shortageOrSurplus), 0)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Kode</th>
                <th className="py-2.5 px-3">Nama Mesin</th>
                <th className="py-2.5 px-2 text-center">Operasi</th>
                <th className="py-2.5 px-2 text-center font-mono">SMV</th>
                <th className="py-2.5 px-2 text-center font-mono">SAM</th>
                <th className="py-2.5 px-2 text-center font-mono">Teoretis</th>
                <th className="py-2.5 px-2 text-center font-mono font-bold text-blue-700 bg-blue-50/50">
                  Alokasi
                </th>
                <th className="py-2.5 px-2 text-center font-mono text-amber-800 bg-amber-50/40">Line Lain</th>
                <th className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700">Stok Pabrik</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {machineRequirements.map((m) => {
                const isShortage = m.shortageOrSurplus < 0;

                return (
                  <tr key={m.machineType} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">{m.machineType}</td>
                    <td className="py-2.5 px-3 text-slate-700">{m.displayName}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{m.processCount}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-600">{m.totalSMV}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-800 font-semibold">{m.totalSAM}</td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-500">{m.theoreticalMachines}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-extrabold text-blue-700 text-sm bg-blue-50/40">
                      {m.allocatedMachines}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-amber-800 font-semibold bg-amber-50/20">
                      {m.usedInOtherLines || 0}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-800">
                      {m.availableInFactory}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isShortage ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Defisit {Math.abs(m.shortageOrSurplus)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Cukup (+{m.shortageOrSurplus})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operation Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            Daftar Urutan Operasi ({processes.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3">Bagian</th>
                <th className="py-2.5 px-3">Sub</th>
                <th className="py-2.5 px-4 min-w-[200px]">Operasi</th>
                <th className="py-2.5 px-3">Mesin</th>
                <th className="py-2.5 px-3 text-center font-mono">Detik</th>
                <th className="py-2.5 px-3 text-center font-mono">SMV</th>
                <th className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">SAM</th>
                <th className="py-2.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processes.map((p) => (
                <tr key={p.no} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">{p.no}</td>
                  <td className="py-2 px-3 font-semibold text-slate-700">{p.section}</td>
                  <td className="py-2 px-3 text-slate-500">{p.subSection || "—"}</td>
                  <td className="py-2 px-4 font-bold text-slate-900">{p.process}</td>
                  <td className="py-2 px-3 font-mono font-semibold bg-slate-50 text-slate-800">{p.machine}</td>
                  <td className="py-2 px-3 text-center font-mono">{p.cycleTime}s</td>
                  <td className="py-2 px-3 text-center font-mono text-slate-600">{p.smv}</td>
                  <td className="py-2 px-3 text-center font-mono font-extrabold text-blue-700 bg-blue-50/30">
                    {p.sam || (p.smv * 1.15).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {canEdit && (
                      <button
                        onClick={() => handleDeleteProcess(p.no)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus operasi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {/* Add process row */}
              {canEdit && (
                <tr className="bg-slate-50/90 border-t border-slate-200">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">+</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={newProcess.section}
                      onChange={(e) => setNewProcess({ ...newProcess, section: e.target.value })}
                      placeholder="SEWING"
                      className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={newProcess.subSection}
                      onChange={(e) => setNewProcess({ ...newProcess, subSection: e.target.value })}
                      placeholder="Sub-bagian"
                      className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={newProcess.process}
                      onChange={(e) => setNewProcess({ ...newProcess, process: e.target.value })}
                      placeholder="Nama proses baru..."
                      className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs font-bold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={newProcess.machine}
                      onChange={(e) => setNewProcess({ ...newProcess, machine: e.target.value })}
                      placeholder="SN / OL 3"
                      className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs font-mono"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      value={newProcess.cycleTime}
                      onChange={(e) => {
                        const ct = Number(e.target.value);
                        setNewProcess({
                          ...newProcess,
                          cycleTime: ct,
                          smv: Number((ct / 60).toFixed(2)),
                          sam: Number(((ct / 60) * 1.15).toFixed(2)),
                        });
                      }}
                      className="w-16 px-1.5 py-1 text-center rounded bg-white border border-slate-200 text-xs font-mono"
                    />
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-slate-500">{newProcess.smv}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-blue-700">{newProcess.sam}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={handleAddProcess}
                      disabled={!newProcess.process}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 ml-auto disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
