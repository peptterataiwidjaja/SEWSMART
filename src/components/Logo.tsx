import React, { useState, useEffect } from "react";
import { Camera, Upload } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  onOpenUpload?: () => void;
  editable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  onOpenUpload,
  editable = false,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem("sewsmart_custom_logo_data");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      try {
        const saved = localStorage.getItem("sewsmart_custom_logo_data");
        setCustomLogoUrl(saved);
      } catch (e) {}
    };

    window.addEventListener("sewsmart_logo_updated", handleLogoUpdate);
    window.addEventListener("storage", handleLogoUpdate);
    return () => {
      window.removeEventListener("sewsmart_logo_updated", handleLogoUpdate);
      window.removeEventListener("storage", handleLogoUpdate);
    };
  }, []);

  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  return (
    <div
      onClick={editable && onOpenUpload ? onOpenUpload : undefined}
      className={`flex items-center space-x-3 select-none ${
        editable && onOpenUpload ? "cursor-pointer group" : ""
      } ${className}`}
      title={editable && onOpenUpload ? "Klik untuk ganti logo dengan upload gambar" : undefined}
    >
      {/* Emblem Badge (Custom Image or Default SVG) */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm shadow-blue-500/10 p-1 shrink-0 overflow-hidden ${
          editable && onOpenUpload ? "group-hover:border-blue-500 group-hover:shadow-md transition-all" : ""
        }`}
      >
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="Logo Pabrik / Perusahaan"
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Blue Dynamic Thread Loop (Left / Outer) */}
            <path
              d="M20 75 C10 50, 25 20, 50 20 C70 20, 85 35, 82 55 C80 70, 65 82, 50 82 C38 82, 30 74, 30 65 C30 52, 45 42, 60 45"
              stroke="#1D4ED8"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Red Dynamic Accent Thread Ribbon (Right / Intertwined) */}
            <path
              d="M80 25 C90 50, 75 80, 50 80 C30 80, 15 65, 18 45 C20 30, 35 18, 50 18 C62 18, 70 26, 70 35 C70 48, 55 58, 40 55"
              stroke="#DC2626"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Stylized Precision Needle (Silver / Slate) */}
            <path
              d="M28 72 L72 28"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Needle Point */}
            <polygon points="72,28 75,25 70,27" fill="#0F172A" />
            {/* Needle Eye */}
            <ellipse
              cx="34"
              cy="66"
              rx="2.5"
              ry="4.5"
              transform="rotate(-45 34 66)"
              fill="#FFFFFF"
              stroke="#DC2626"
              strokeWidth="2"
            />
            {/* Dual Stitch Dots (Blue & Red) */}
            <circle cx="50" cy="50" r="3" fill="#1D4ED8" />
            <circle cx="62" cy="38" r="2.5" fill="#DC2626" />
          </svg>
        )}

        {/* Hover Camera/Edit Overlay if editable */}
        {editable && onOpenUpload && (
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl text-white">
            <Camera className="w-4 h-4" />
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="font-black tracking-tight text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
              SEW<span className="text-blue-700">SMART</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-red-600 inline-block"></span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              PRO
            </span>
          </div>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              GARMENT MANUFACTURING &bull; IE CONTROL
            </span>
            {editable && onOpenUpload && (
              <span className="hidden sm:inline-flex text-[9px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                (Ganti Logo)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
