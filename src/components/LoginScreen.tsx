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

  const [loginMode, setLoginMode] = useState<"standard" | "apikey">("standard");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setErrorMsg("Masukkan Kunci API terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: trimmedKey }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setSuccessMsg(`Kunci API Terverifikasi: ${data.key?.name || "Akses Diberikan"}`);
        setTimeout(() => {
          setLoading(false);
          onLogin(data.user);
        }, 350);
      } else {
        setLoading(false);
        setErrorMsg(data.message || "Kunci API tidak valid atau dinonaktifkan.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "Gagal menghubungi server verifikasi.");
    }
  };

  const handleQuickApiKey = (key: string) => {
    setApiKeyInput(key);
    setErrorMsg(null);
  };

  const [availableUsers, setAvailableUsers] = useState<User[]>(users);
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  // Fetch updated users list from server on mount
  React.useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/users");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users) && data.users.length > 0 && isMounted) {
            setAvailableUsers(data.users);
            setServerOnline(true);
          }
        }
      } catch (e) {
        if (isMounted) setServerOnline(false);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAccountSelect = (u: User) => {
    setUsernameInput(u.username || "");
    setPasswordInput(u.password || "");
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMsg("Masukkan User dan Password terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Central Server
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUser,
          password: trimmedPass,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setSuccessMsg(`Masuk sebagai ${data.user.name}...`);
        setTimeout(() => {
          setLoading(false);
          onLogin(data.user);
        }, 350);
        return;
      } else {
        // Fallback: check local users if offline
        const localMatch = availableUsers.find((u) => {
          const uName = (u.username || "").toLowerCase();
          const fullName = (u.name || "").toLowerCase();
          const inputLower = trimmedUser.toLowerCase();
          const isUsernameMatch =
            uName === inputLower ||
            fullName === inputLower ||
            (u.role === "production_engineer" && (inputLower === "pe" || inputLower === "pe_head"));
          return isUsernameMatch && (u.password || "") === trimmedPass;
        });

        if (localMatch) {
          setSuccessMsg(`Masuk secara offline sebagai ${localMatch.name}...`);
          setTimeout(() => {
            setLoading(false);
            onLogin(localMatch);
          }, 350);
          return;
        }

        setLoading(false);
        setErrorMsg(data.message || "User atau Password tidak sesuai.");
        return;
      }
    } catch (err: any) {
      // Network offline fallback
      const localMatch = availableUsers.find((u) => {
        const uName = (u.username || "").toLowerCase();
        const fullName = (u.name || "").toLowerCase();
        const inputLower = trimmedUser.toLowerCase();
        const isUsernameMatch =
          uName === inputLower ||
          fullName === inputLower ||
          (u.role === "production_engineer" && (inputLower === "pe" || inputLower === "pe_head"));
        return isUsernameMatch && (u.password || "") === trimmedPass;
      });

      setLoading(false);
      if (localMatch) {
        setSuccessMsg(`Masuk offline sebagai ${localMatch.name}...`);
        setTimeout(() => {
          onLogin(localMatch);
        }, 350);
      } else {
        setErrorMsg("Gagal menghubungi server verifikasi.");
      }
    }
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

      {/* Centered Clean Login Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Login Akses
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Otorisasi pengguna & perangkat lantai produksi
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode("standard");
                setErrorMsg(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                loginMode === "standard"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Akun & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("apikey");
                setErrorMsg(null);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                loginMode === "apikey"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔑 Kunci API
            </button>
          </div>

          {/* 1. STANDARD USER & PASS FORM */}
          {loginMode === "standard" && (
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

              {/* Quick Account Chips */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Pilih Akun yang Sudah Dikonfigurasi:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {availableUsers.map((u) => {
                    const isPE = u.role === "production_engineer";
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickAccountSelect(u)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer flex items-center space-x-1 ${
                          isPE
                            ? "bg-blue-950/70 border-blue-700 text-blue-200 hover:bg-blue-900"
                            : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-500"
                        }`}
                        title={`${u.name} (${u.title || ""})`}
                      >
                        <span className="font-bold">{u.username}</span>
                        <span className="text-[9px] text-slate-400">
                          {isPE ? "• PE" : `• L${u.assignedLine || "?"}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Server Multi-User Status */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[10px]">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${serverOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  <span>{serverOnline ? "Server Database Pusat: Terhubung" : "Mode Offline"}</span>
                </div>
                <span className="text-slate-500 font-mono">{availableUsers.length} Akun Aktif</span>
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
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer mt-2 shadow-xs"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. API KEY LOGIN FORM */}
          {loginMode === "apikey" && (
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="input-login-apikey"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Kunci API / Access Token
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="input-login-apikey"
                    type="text"
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="sew_live_..."
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Masukkan Kunci API yang diberikan oleh Production Engineer (PE).
                </p>
              </div>

              {/* Quick Sample Keys for Fast Access / Demo */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Kunci Akses Cepat (Klik untuk coba):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickApiKey("sew_live_pe_master_2026")}
                    className="px-2 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-[10px] font-mono text-blue-200 transition-colors"
                  >
                    PE Master Key
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickApiKey("sew_live_line1_input_2026")}
                    className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-[10px] font-mono text-emerald-200 transition-colors"
                  >
                    Line 1 Input Key
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickApiKey("sew_live_line3_input_2026")}
                    className="px-2 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 text-[10px] font-mono text-indigo-200 transition-colors"
                  >
                    Line 3 Input Key
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickApiKey("sew_live_monitor_display_2026")}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-200 transition-colors"
                  >
                    TV Monitor Key
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
                id="btn-submit-login-apikey"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer mt-2 shadow-xs"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verifikasi & Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>


      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500">
        SEW-IE System · Line 1, 3, 4, 5, 6, 7
      </footer>
    </div>
  );
};
