import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  Eye,
} from "lucide-react";

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentSavedLogo, setCurrentSavedLogo] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("sewsmart_custom_logo_data");
      setCurrentSavedLogo(saved);
      setPreviewUrl(saved);
      setErrorMsg(null);
      setSuccessMsg(null);
      setFileName(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format file tidak didukung. Harap unggah file PNG, JPG, JPEG, SVG, atau WebP.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran file terlalu besar (maksimal 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
        setFileName(file.name);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Gagal membaca file gambar. Silakan coba lagi.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!previewUrl) return;
    try {
      localStorage.setItem("sewsmart_custom_logo_data", previewUrl);
      window.dispatchEvent(new Event("sewsmart_logo_updated"));
      onLogoUpdated();
      setSuccessMsg("Logo kustom berhasil disimpan dan diperbarui!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg("Gagal menyimpan logo ke memori peramban. Coba kompres gambar.");
    }
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem("sewsmart_custom_logo_data");
      window.dispatchEvent(new Event("sewsmart_logo_updated"));
      onLogoUpdated();
      setPreviewUrl(null);
      setCurrentSavedLogo(null);
      setSuccessMsg("Logo berhasil dikembalikan ke emblem default SewSmart.");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg("Gagal mereset logo.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ganti Logo Perusahaan</h3>
              <p className="text-xs text-slate-500">
                Unggah gambar logo pabrik untuk ditampilkan pada header dasbor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/70"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <Upload className="w-7 h-7" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              {fileName ? fileName : "Klik atau seret file gambar logo ke sini"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mendukung PNG, JPG, JPEG, SVG, WebP (Maks. 5MB)
            </p>
            <p className="text-[11px] text-blue-600 font-semibold mt-2">
              Disarankan format PNG/SVG transparan dengan rasio kotak atau lanskap
            </p>
          </div>

          {/* Live Preview Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Pratinjau Tampilan Header</span>
              </span>
              {previewUrl && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Logo Kustom Terpasang
                </span>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center space-x-3 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-[10px] font-bold text-slate-400">
                    Default Emblem
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 leading-none">
                  SEW<span className="text-blue-700">SMART</span>{" "}
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 ml-1">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                  Garment Manufacturing &bull; IE Control
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {currentSavedLogo ? (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!previewUrl || previewUrl === currentSavedLogo}
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                previewUrl && previewUrl !== currentSavedLogo
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Logo Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
