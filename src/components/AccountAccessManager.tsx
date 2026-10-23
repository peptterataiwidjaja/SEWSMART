import React, { useState } from "react";
import {
  User,
  LineNumber,
  NavBarConfig,
  NavTabId,
  UserRole,
} from "../types";
import {
  VALID_LINES,
  DEFAULT_ADMIN_LINE_TABS,
  ALL_PE_TABS,
  DEFAULT_NAV_BARS,
} from "../data/defaultData";
import {
  Shield,
  UserPlus,
  Trash2,
  Edit3,
  Check,
  X,
  KeyRound,
  User as UserIcon,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  CheckSquare,
  Square,
} from "lucide-react";

interface AccountAccessManagerProps {
  currentUser: User;
  users: User[];
  navBars: NavBarConfig[];
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateNavBars: (newBars: NavBarConfig[]) => void;
  onOpenApiKeyManager?: () => void;
}

export const AccountAccessManager: React.FC<AccountAccessManagerProps> = ({
  currentUser,
  users,
  navBars,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateNavBars,
  onOpenApiKeyManager,
}) => {
  // State for Adding a New User
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("admin_line");
  const [newLine, setNewLine] = useState<LineNumber>(1);
  const [newAllowedTabs, setNewAllowedTabs] = useState<NavTabId[]>(
    DEFAULT_ADMIN_LINE_TABS
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // State for Editing an Existing User inline
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("admin_line");
  const [editLine, setEditLine] = useState<LineNumber>(1);
  const [editAllowedTabs, setEditAllowedTabs] = useState<NavTabId[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // State for Editing Navigation Bar Names
  const [barLabelsDraft, setBarLabelsDraft] = useState<Record<NavTabId, string>>(() => {
    const map = {} as Record<NavTabId, string>;
    navBars.forEach((b) => {
      map[b.id] = b.label;
    });
    return map;
  });
  const [barSavedMsg, setBarSavedMsg] = useState<string | null>(null);

  if (currentUser.role !== "production_engineer") {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-md mx-auto my-8">
        <Lock className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Akses Terbatas</h2>
        <p className="text-xs text-slate-500 mt-1">
          Halaman Akses Akun hanya dapat dibuka oleh Production Engineer (PE).
        </p>
      </div>
    );
  }

  const toggleNewTabPermission = (tabId: NavTabId) => {
    setNewAllowedTabs((prev) =>
      prev.includes(tabId) ? prev.filter((t) => t !== tabId) : [...prev, tabId]
    );
  };

  const handleRoleChangeForNew = (role: UserRole) => {
    setNewRole(role);
    if (role === "production_engineer") {
      setNewAllowedTabs(ALL_PE_TABS);
    } else {
      setNewAllowedTabs(DEFAULT_ADMIN_LINE_TABS);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const uName = newUsername.trim();
    const uPass = newPassword.trim();
    const fullName = newName.trim();

    if (!uName || !uPass || !fullName) {
      setFormError("User, Pass, dan Nama wajib diisi.");
      return;
    }

    const exists = users.some(
      (u) => u.username.toLowerCase() === uName.toLowerCase()
    );
    if (exists) {
      setFormError(`User "${uName}" sudah digunakan. Gunakan nama user lain.`);
      return;
    }

    if (newAllowedTabs.length === 0) {
      setFormError("Pilih minimal 1 akses bar untuk akun ini.");
      return;
    }

    const createdUser: User = {
      id: `user-${Date.now()}`,
      username: uName,
      password: uPass,
      name: fullName,
      role: newRole,
      assignedLine: newRole === "admin_line" ? newLine : undefined,
      title:
        newRole === "production_engineer"
          ? "Production Engineer"
          : `Admin Line ${newLine}`,
      allowedTabs: newAllowedTabs,
      lastLogin: "-",
    };

    onAddUser(createdUser);
    setNewUsername("");
    setNewPassword("");
    setNewName("");
    setFormSuccess(`Akun "${fullName}" (User: ${uName}) berhasil ditambahkan.`);
    setTimeout(() => setFormSuccess(null), 3000);
  };

  const startEditingUser = (u: User) => {
    setEditingUserId(u.id);
    setEditUsername(u.username);
    setEditPassword(u.password || "");
    setEditName(u.name);
    setEditRole(u.role);
    setEditLine(u.assignedLine || 1);
    setEditAllowedTabs(
      u.allowedTabs && u.allowedTabs.length > 0
        ? u.allowedTabs
        : u.role === "production_engineer"
        ? ALL_PE_TABS
        : DEFAULT_ADMIN_LINE_TABS
    );
  };

  const toggleEditTabPermission = (tabId: NavTabId) => {
    setEditAllowedTabs((prev) =>
      prev.includes(tabId) ? prev.filter((t) => t !== tabId) : [...prev, tabId]
    );
  };

  const handleSaveEditUser = (originalUser: User) => {
    if (!editUsername.trim() || !editPassword.trim() || !editName.trim()) {
      return;
    }

    const finalTabs: NavTabId[] =
      editRole === "production_engineer" && !editAllowedTabs.includes("account-access")
        ? [...editAllowedTabs, "account-access"]
        : editAllowedTabs.length > 0
        ? editAllowedTabs
        : ["hourly"];

    const updated: User = {
      ...originalUser,
      username: editUsername.trim(),
      password: editPassword.trim(),
      name: editName.trim(),
      role: editRole,
      assignedLine: editRole === "admin_line" ? editLine : undefined,
      title:
        editRole === "production_engineer"
          ? "Production Engineer"
          : `Admin Line ${editLine}`,
      allowedTabs: finalTabs,
    };

    onUpdateUser(updated);
    setEditingUserId(null);
  };

  // Quick toggle bar access directly from table row without opening full edit mode
  const handleQuickToggleUserBar = (user: User, tabId: NavTabId) => {
    // Prevent removing account-access from PE
    if (user.role === "production_engineer" && tabId === "account-access") {
      return;
    }
    const currentTabs =
      user.allowedTabs && user.allowedTabs.length > 0
        ? user.allowedTabs
        : user.role === "production_engineer"
        ? ALL_PE_TABS
        : DEFAULT_ADMIN_LINE_TABS;

    const hasTab = currentTabs.includes(tabId);
    const nextTabs = hasTab
      ? currentTabs.filter((t) => t !== tabId)
      : [...currentTabs, tabId];

    if (nextTabs.length === 0) return; // keep at least 1 tab

    onUpdateUser({
      ...user,
      allowedTabs: nextTabs,
    });
  };

  const handleSaveBarNames = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = navBars.map((b) => ({
      ...b,
      label: (barLabelsDraft[b.id] || b.defaultLabel).trim() || b.defaultLabel,
    }));
    onUpdateNavBars(updated);
    setBarSavedMsg("Nama bar navigasi berhasil diperbarui.");
    setTimeout(() => setBarSavedMsg(null), 2500);
  };

  const handleResetBarNames = () => {
    const resetDraft = {} as Record<NavTabId, string>;
    DEFAULT_NAV_BARS.forEach((b) => {
      resetDraft[b.id] = b.defaultLabel;
    });
    setBarLabelsDraft(resetDraft);
    onUpdateNavBars(DEFAULT_NAV_BARS);
    setBarSavedMsg("Nama bar dikembalikan ke bawaan.");
    setTimeout(() => setBarSavedMsg(null), 2500);
  };

  const peCount = users.filter((u) => u.role === "production_engineer").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Manajemen Akses Akun & Hak Bar (Khusus PE)
            </h1>
            <p className="text-xs text-slate-500">
              Tambah/hapus akun login, ubah nama & password, serta atur akses bar yang tersedia untuk setiap user.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenApiKeyManager && (
            <button
              type="button"
              onClick={onOpenApiKeyManager}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kelola Kunci API</span>
            </button>
          )}
          <div className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-2 rounded-xl font-bold">
            Total Akun: {users.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Tambah Akun Baru & Ubah Nama Bar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Form Tambah Akun */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Tambah Akses Akun Baru
              </h2>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    User (ID Login)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="cth: line1"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pass (Password)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="cth: l123"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="cth: Rina S. (Admin Line 1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Level Akses
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      handleRoleChangeForNew(e.target.value as UserRole)
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-hidden"
                  >
                    <option value="admin_line">Admin Line</option>
                    <option value="production_engineer">PE (Semua Line)</option>
                  </select>
                </div>

                {newRole === "admin_line" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pilih Line
                    </label>
                    <select
                      value={newLine}
                      onChange={(e) =>
                        setNewLine(Number(e.target.value) as LineNumber)
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-hidden"
                    >
                      {VALID_LINES.map((line) => (
                        <option key={line} value={line}>
                          Line {line} ({line === 1 || line === 3 ? "TW1" : "TW38"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Pilih Akses Bar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Akses Bar yang Tersedia untuk Akun Ini:
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {navBars
                    .filter((b) => !b.peOnly || newRole === "production_engineer")
                    .map((bar) => {
                      const checked = newAllowedTabs.includes(bar.id);
                      return (
                        <button
                          key={bar.id}
                          type="button"
                          onClick={() => toggleNewTabPermission(bar.id)}
                          className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border text-left transition-colors ${
                            checked
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {checked ? (
                            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{bar.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  {formSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Akses Akun</span>
              </button>
            </form>
          </div>

          {/* 2. Ubah Nama Bar Navigasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Ubah Nama Bar Navigasi
                </h2>
              </div>
              <button
                type="button"
                onClick={handleResetBarNames}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                title="Reset ke nama standar"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <form onSubmit={handleSaveBarNames} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {navBars.map((bar) => (
                  <div key={bar.id}>
                    <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                      Default: {bar.defaultLabel}
                    </label>
                    <input
                      type="text"
                      value={barLabelsDraft[bar.id] ?? bar.label}
                      onChange={(e) =>
                        setBarLabelsDraft((prev) => ({
                          ...prev,
                          [bar.id]: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
                    />
                  </div>
                ))}
              </div>

              {barSavedMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  {barSavedMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Nama Bar</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Daftar Akun Aktif & Pengaturan Akses Bar (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Daftar Akun & Hak Akses Bar
                </h2>
                <p className="text-xs text-slate-500">
                  Klik tombol bar pada tiap akun untuk mengaktifkan/menonaktifkan akses bar secara langsung.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {users.map((u) => {
                const isEditing = editingUserId === u.id;
                const isPEAccount = u.role === "production_engineer";
                const canDelete = !(isPEAccount && peCount <= 1);
                const showPass = !!visiblePasswords[u.id];
                const userTabs =
                  u.allowedTabs && u.allowedTabs.length > 0
                    ? u.allowedTabs
                    : isPEAccount
                    ? ALL_PE_TABS
                    : DEFAULT_ADMIN_LINE_TABS;

                return (
                  <div
                    key={u.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isPEAccount
                        ? "bg-blue-50/30 border-blue-200"
                        : "bg-slate-50/60 border-slate-200"
                    }`}
                  >
                    {isEditing ? (
                      /* MODE EDIT AKUN */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-bold text-blue-700">
                            Edit Akun: {u.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Nama Lengkap
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              User Login
                            </label>
                            <input
                              type="text"
                              value={editUsername}
                              onChange={(e) => setEditUsername(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Pass
                            </label>
                            <input
                              type="text"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Role
                            </label>
                            <select
                              value={editRole}
                              onChange={(e) =>
                                setEditRole(e.target.value as UserRole)
                              }
                              disabled={isPEAccount && peCount <= 1}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                            >
                              <option value="admin_line">Admin Line</option>
                              <option value="production_engineer">
                                Production Engineer (PE)
                              </option>
                            </select>
                          </div>

                          {editRole === "admin_line" && (
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Line Tujuan
                              </label>
                              <select
                                value={editLine}
                                onChange={(e) =>
                                  setEditLine(
                                    Number(e.target.value) as LineNumber
                                  )
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                              >
                                {VALID_LINES.map((l) => (
                                  <option key={l} value={l}>
                                    Line {l}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Pilih Akses Bar:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {navBars
                              .filter(
                                (b) =>
                                  !b.peOnly ||
                                  editRole === "production_engineer"
                              )
                              .map((bar) => {
                                const active = editAllowedTabs.includes(bar.id);
                                return (
                                  <button
                                    key={bar.id}
                                    type="button"
                                    onClick={() =>
                                      toggleEditTabPermission(bar.id)
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                                      active
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-slate-500 border-slate-200"
                                    }`}
                                  >
                                    {bar.label}
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditUser(u)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* TAMPILAN NORMAL AKUN */
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                                isPEAccount ? "bg-blue-600" : "bg-emerald-600"
                              }`}
                            >
                              {isPEAccount ? "PE" : `L${u.assignedLine}`}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-slate-900">
                                  {u.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isPEAccount
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {isPEAccount
                                    ? "PE Utama"
                                    : `Line ${u.assignedLine}`}
                                </span>
                              </div>

                              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5 font-mono">
                                <span>
                                  User:{" "}
                                  <strong className="text-slate-800">
                                    {u.username}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center space-x-1">
                                  <span>Pass:</span>
                                  <strong className="text-slate-800">
                                    {showPass ? u.password : "••••••"}
                                  </strong>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setVisiblePasswords((prev) => ({
                                        ...prev,
                                        [u.id]: !prev[u.id],
                                      }))
                                    }
                                    className="text-slate-400 hover:text-slate-700 ml-1"
                                    title="Lihat/Sembunyikan Password"
                                  >
                                    {showPass ? (
                                      <EyeOff className="w-3 h-3" />
                                    ) : (
                                      <Eye className="w-3 h-3" />
                                    )}
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => startEditingUser(u)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => onDeleteUser(u.id)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors"
                                title="Hapus Akun"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Bar Access Pills (Click to toggle) */}
                        <div className="pt-2.5">
                          <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                            Akses Bar Tersedia (Klik untuk ubah):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {navBars
                              .filter((b) => !b.peOnly || isPEAccount)
                              .map((bar) => {
                                const isAllowed = userTabs.includes(bar.id);
                                const isLockedPEBar =
                                  isPEAccount && bar.id === "account-access";
                                return (
                                  <button
                                    key={bar.id}
                                    type="button"
                                    disabled={isLockedPEBar}
                                    onClick={() =>
                                      handleQuickToggleUserBar(u, bar.id)
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors flex items-center space-x-1 ${
                                      isAllowed
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                    } ${
                                      isLockedPEBar
                                        ? "opacity-90 cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    <span>{bar.label}</span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
