import React, { useState } from "react";
import { User } from "../types";
import {
  Lock,
  User as UserIcon,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  LogIn,
  LogOut,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onLoginSuccess,
  onLogout,
}) => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMsg("Masukkan User dan Pass terlebih dahulu.");
      return;
    }

    const matchedUser = users.find((u) => {
      const uName = (u.username || "").toLowerCase();
      const fullName = (u.name || "").toLowerCase();
      const inputLower = trimmedUser.toLowerCase();

      const isUsernameMatch =
        uName === inputLower ||
        fullName === inputLower ||
        (u.role === "production_engineer" &&
          (inputLower === "pe" || inputLower === "pe_head"));

      return isUsernameMatch && (u.password || "") === trimmedPass;
    });

    if (!matchedUser) {
      setErrorMsg("User atau Password tidak sesuai.");
      return;
    }

    setSuccessMsg(`Berhasil masuk sebagai ${matchedUser.name}`);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      setSuccessMsg(null);
      setUsernameInput("");
      setPasswordInput("");
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ganti Akun Login</h3>
              <p className="text-[11px] text-slate-400">Masukkan User & Pass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Account Info */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="text-slate-400">Aktif:</span>
            <span className="font-bold text-slate-800 truncate">{currentUser.name}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-rose-600 hover:text-rose-700 flex items-center space-x-1 font-semibold shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              User
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Masukkan user..."
                required
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pass
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Masukkan password..."
                required
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  );
};
