import React, { useState } from "react";
import { User } from "../types";
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Logo } from "./Logo";

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMsg("Masukkan User dan Password terlebih dahulu.");
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

    setLoading(true);
    setSuccessMsg(`Masuk sebagai ${matchedUser.name}...`);

    setTimeout(() => {
      setLoading(false);
      onLogin(matchedUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between text-slate-100 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.14),transparent_60%)] pointer-events-none" />

      {/* Minimal Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo />
            <span className="font-bold text-base tracking-tight text-white">
              SEW-IE System
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Line 1, 3, 4, 5, 6, 7
          </span>
        </div>
      </header>

      {/* Centered Clean Login Box (Only User & Pass bars) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Login Akses
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan User dan Password akun Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bar User */}
            <div>
              <label
                htmlFor="input-login-user"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                User
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-user"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Masukkan user..."
                  autoComplete="username"
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bar Pass */}
            <div>
              <label
                htmlFor="input-login-password"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Pass
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Masukkan password..."
                  autoComplete="current-password"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Feedback */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500">
        SEW-IE System · Line 1, 3, 4, 5, 6, 7
      </footer>
    </div>
  );
};
