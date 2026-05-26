import { useState } from "react";
import { extractDomain } from "../lib/storage";

interface LogoAvatarProps {
  name: string;
  website?: string;
  colors: { bg: string; color: string };
  size?: "sm" | "md";
}

export function LogoAvatar({ name, website, colors, size = "md" }: LogoAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const dim       = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const textSize  = size === "sm" ? "text-xs"  : "text-sm";

  const domain     = website ? extractDomain(website) : null;
  const faviconUrl = domain
    ? `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(`https://${domain}`)}&size=128`
    : null;

  if (faviconUrl && !imgError) {
    return (
      <div className={`${dim} rounded-lg overflow-hidden shrink-0 bg-white`}>
        <img
          src={faviconUrl}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${dim} rounded-lg flex items-center justify-center ${textSize} font-semibold shrink-0`}
      style={{ backgroundColor: colors.bg, color: colors.color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
