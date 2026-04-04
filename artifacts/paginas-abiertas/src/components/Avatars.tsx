import React from "react";

export interface AvatarDef {
  id: string;
  name: string;
  role: string;
  bg: string;
  svg: React.ReactNode;
}

export const CLUB_AVATARS: AvatarDef[] = [
  {
    id: "luna",
    name: "Luna del Mar",
    role: "La Detective",
    bg: "#0E2240",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="82" rx="22" ry="14" fill="#C0392B" />
        {/* Collar */}
        <ellipse cx="50" cy="72" rx="13" ry="7" fill="#E74C3C" />
        {/* Head */}
        <circle cx="50" cy="52" r="22" fill="#F5CBA7" />
        {/* Hair */}
        <ellipse cx="50" cy="38" rx="22" ry="16" fill="#2C1810" />
        <ellipse cx="32" cy="56" rx="8" ry="16" fill="#2C1810" />
        <ellipse cx="68" cy="56" rx="8" ry="16" fill="#2C1810" />
        {/* Mask */}
        <rect x="32" y="47" width="36" height="11" rx="5" fill="#1A1A2E" />
        <circle cx="40" cy="52" r="5" fill="#0F1F3D" stroke="#4DC8E0" strokeWidth="1.5" />
        <circle cx="60" cy="52" r="5" fill="#0F1F3D" stroke="#4DC8E0" strokeWidth="1.5" />
        <circle cx="40" cy="52" r="2" fill="white" opacity="0.6" />
        <circle cx="60" cy="52" r="2" fill="white" opacity="0.6" />
        {/* Nose */}
        <ellipse cx="50" cy="60" rx="2" ry="1.5" fill="#E0A87A" />
        {/* Mouth */}
        <path d="M45 64 Q50 68 55 64" stroke="#C07050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Cape */}
        <path d="M28 72 L18 95 L82 95 L72 72" fill="#E74C3C" opacity="0.8" />
        {/* Magnifying glass */}
        <circle cx="73" cy="73" r="8" fill="none" stroke="#F5E642" strokeWidth="3" />
        <line x1="78.5" y1="78.5" x2="84" y2="84" stroke="#F5E642" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "capi",
    name: "Capi Atlas",
    role: "La Exploradora",
    bg: "#0F4C5C",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="84" rx="22" ry="13" fill="#4DC8E0" />
        {/* Shirt detail */}
        <ellipse cx="50" cy="73" rx="14" ry="8" fill="#38A8C0" />
        {/* Compass pin */}
        <circle cx="50" cy="73" r="4" fill="#F5E642" />
        <circle cx="50" cy="73" r="2" fill="#0F1F3D" />
        {/* Head */}
        <circle cx="50" cy="51" r="21" fill="#FAD5A5" />
        {/* Hair */}
        <ellipse cx="50" cy="37" rx="21" ry="14" fill="#7B3F00" />
        <ellipse cx="35" cy="52" rx="7" ry="12" fill="#7B3F00" />
        <ellipse cx="65" cy="52" rx="7" ry="12" fill="#7B3F00" />
        {/* Explorer hat */}
        <ellipse cx="50" cy="35" rx="28" ry="7" fill="#8B6914" />
        <rect x="26" y="22" width="48" height="18" rx="8" fill="#A0791A" />
        {/* Hat band */}
        <rect x="26" y="35" width="48" height="5" fill="#8B6914" />
        {/* Hat star badge */}
        <polygon points="50,26 52,31 57,31 53,34 55,39 50,36 45,39 47,34 43,31 48,31" fill="#E8523A" />
        {/* Eyes */}
        <ellipse cx="43" cy="51" rx="4" ry="4.5" fill="white" />
        <ellipse cx="57" cy="51" rx="4" ry="4.5" fill="white" />
        <circle cx="43" cy="52" r="2.5" fill="#5D2E0C" />
        <circle cx="57" cy="52" r="2.5" fill="#5D2E0C" />
        <circle cx="44" cy="51" r="1" fill="white" />
        <circle cx="58" cy="51" r="1" fill="white" />
        {/* Cheeks */}
        <ellipse cx="36" cy="57" rx="4" ry="2.5" fill="#F0A080" opacity="0.5" />
        <ellipse cx="64" cy="57" rx="4" ry="2.5" fill="#F0A080" opacity="0.5" />
        {/* Nose */}
        <ellipse cx="50" cy="58" rx="2" ry="1.5" fill="#E8B080" />
        {/* Smile */}
        <path d="M44 63 Q50 68 56 63" stroke="#C07050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "estrella",
    name: "Estrella",
    role: "La Maga",
    bg: "#3B1060",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="84" rx="22" ry="13" fill="#7C3AED" />
        {/* Dress detail */}
        <ellipse cx="50" cy="73" rx="14" ry="8" fill="#6D28D9" />
        {/* Head */}
        <circle cx="50" cy="51" r="21" fill="#FAD5A5" />
        {/* Hair */}
        <ellipse cx="50" cy="37" rx="21" ry="14" fill="#1A1A2E" />
        <ellipse cx="33" cy="54" rx="8" ry="15" fill="#1A1A2E" />
        <ellipse cx="67" cy="54" rx="8" ry="15" fill="#1A1A2E" />
        {/* Crown */}
        <polygon points="35,34 38,24 42,30 50,20 58,30 62,24 65,34" fill="#F5E642" />
        <circle cx="50" cy="22" r="3" fill="#E8523A" />
        <circle cx="38" cy="26" r="2" fill="#4DC8E0" />
        <circle cx="62" cy="26" r="2" fill="#4DC8E0" />
        {/* Eyes */}
        <ellipse cx="43" cy="51" rx="4" ry="4.5" fill="white" />
        <ellipse cx="57" cy="51" rx="4" ry="4.5" fill="white" />
        <circle cx="43" cy="52" r="2.5" fill="#6D28D9" />
        <circle cx="57" cy="52" r="2.5" fill="#6D28D9" />
        <circle cx="44" cy="51" r="1" fill="white" />
        <circle cx="58" cy="51" r="1" fill="white" />
        {/* Lashes */}
        <line x1="40" y1="47" x2="38" y2="45" stroke="#1A1A2E" strokeWidth="1" />
        <line x1="43" y1="46.5" x2="43" y2="44" stroke="#1A1A2E" strokeWidth="1" />
        <line x1="46" y1="47" x2="48" y2="45" stroke="#1A1A2E" strokeWidth="1" />
        <line x1="54" y1="47" x2="52" y2="45" stroke="#1A1A2E" strokeWidth="1" />
        <line x1="57" y1="46.5" x2="57" y2="44" stroke="#1A1A2E" strokeWidth="1" />
        <line x1="60" y1="47" x2="62" y2="45" stroke="#1A1A2E" strokeWidth="1" />
        {/* Nose */}
        <ellipse cx="50" cy="58" rx="1.5" ry="1" fill="#E8B080" />
        {/* Lips */}
        <path d="M45 63 Q50 67 55 63" stroke="#C060A0" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Wand */}
        <line x1="70" y1="45" x2="85" y2="30" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="85,24 87,30 84,30" fill="#F5E642" />
        {/* Magic sparkles */}
        <circle cx="80" cy="28" r="2" fill="#F5E642" opacity="0.8" />
        <circle cx="88" cy="35" r="1.5" fill="#E8523A" opacity="0.7" />
        <circle cx="78" cy="22" r="1" fill="white" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "coral",
    name: "Coral",
    role: "La Aventurera",
    bg: "#1A4A2E",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="84" rx="22" ry="13" fill="#E8523A" />
        {/* Jacket */}
        <ellipse cx="50" cy="73" rx="14" ry="8" fill="#C0392B" />
        {/* Head */}
        <circle cx="50" cy="51" r="21" fill="#D4A574" />
        {/* Hair - bandana + hair */}
        <ellipse cx="50" cy="37" rx="21" ry="14" fill="#8B4513" />
        <ellipse cx="35" cy="52" rx="7" ry="11" fill="#8B4513" />
        <ellipse cx="65" cy="52" rx="7" ry="11" fill="#8B4513" />
        {/* Bandana */}
        <rect x="29" y="34" width="42" height="8" rx="2" fill="#E8523A" />
        {/* Bandana star */}
        <polygon points="50,35 51.5,38.5 55,38.5 52.5,40.5 53.5,44 50,42 46.5,44 47.5,40.5 45,38.5 48.5,38.5" fill="#F5E642" />
        {/* VR Goggles */}
        <rect x="32" y="47" width="36" height="14" rx="6" fill="#1A1A1A" />
        <rect x="33" y="48" width="15" height="12" rx="5" fill="#4DC8E0" opacity="0.8" />
        <rect x="52" y="48" width="15" height="12" rx="5" fill="#4DC8E0" opacity="0.8" />
        <rect x="33" y="48" width="15" height="12" rx="5" fill="white" opacity="0.2" />
        <rect x="52" y="48" width="15" height="12" rx="5" fill="white" opacity="0.2" />
        {/* Goggles strap */}
        <line x1="30" y1="54" x2="33" y2="54" stroke="#333" strokeWidth="3" />
        <line x1="67" y1="54" x2="70" y2="54" stroke="#333" strokeWidth="3" />
        {/* Cheeks */}
        <ellipse cx="35" cy="63" rx="4" ry="2.5" fill="#F0806060" opacity="0.5" />
        <ellipse cx="65" cy="63" rx="4" ry="2.5" fill="#F0806060" opacity="0.5" />
        {/* Smile */}
        <path d="M44 67 Q50 72 56 67" stroke="#A06040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Nose */}
        <ellipse cx="50" cy="63" rx="2" ry="1.5" fill="#C08060" />
      </svg>
    ),
  },
  {
    id: "nova",
    name: "Nova",
    role: "La Astronauta",
    bg: "#080C2E",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Suit body */}
        <ellipse cx="50" cy="84" rx="24" ry="14" fill="#E0E0E0" />
        <rect x="38" y="70" width="24" height="16" rx="4" fill="#CCCCCC" />
        {/* Suit chest detail */}
        <rect x="42" y="73" width="16" height="10" rx="3" fill="#4DC8E0" opacity="0.5" />
        <circle cx="50" cy="78" r="3" fill="#4DC8E0" />
        {/* Helmet outer */}
        <circle cx="50" cy="49" r="25" fill="#E8E8E8" />
        {/* Helmet visor */}
        <circle cx="50" cy="49" r="20" fill="#0F1F3D" />
        <circle cx="50" cy="49" r="20" fill="url(#visorGrad)" opacity="0.8" />
        <defs>
          <radialGradient id="visorGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#4DC8E0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0F1F3D" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        {/* Face inside helmet */}
        <circle cx="50" cy="50" r="14" fill="#FAD5A5" />
        {/* Hair inside */}
        <ellipse cx="50" cy="40" rx="14" ry="9" fill="#2C1810" />
        {/* Eyes */}
        <ellipse cx="44" cy="50" rx="3.5" ry="4" fill="white" />
        <ellipse cx="56" cy="50" rx="3.5" ry="4" fill="white" />
        <circle cx="44" cy="51" r="2" fill="#2C3E50" />
        <circle cx="56" cy="51" r="2" fill="#2C3E50" />
        <circle cx="44.8" cy="50" r="0.8" fill="white" />
        <circle cx="56.8" cy="50" r="0.8" fill="white" />
        {/* Smile */}
        <path d="M45 57 Q50 61 55 57" stroke="#C07050" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Helmet glare */}
        <ellipse cx="38" cy="35" rx="7" ry="4" fill="white" opacity="0.15" transform="rotate(-20 38 35)" />
        {/* Stars in background */}
        <circle cx="20" cy="20" r="1" fill="white" opacity="0.7" />
        <circle cx="80" cy="15" r="1" fill="white" opacity="0.7" />
        <circle cx="15" cy="70" r="1" fill="#F5E642" opacity="0.6" />
        <circle cx="85" cy="72" r="1.2" fill="white" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: "rubi",
    name: "Rubí",
    role: "La Viajera",
    bg: "#5C2800",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="84" rx="22" ry="13" fill="#E8523A" />
        {/* Jacket / vest detail */}
        <ellipse cx="50" cy="73" rx="14" ry="8" fill="#F5A020" />
        {/* Head */}
        <circle cx="50" cy="51" r="21" fill="#C68642" />
        {/* Hair */}
        <ellipse cx="50" cy="37" rx="21" ry="14" fill="#8B2500" />
        <ellipse cx="34" cy="52" rx="8" ry="14" fill="#8B2500" />
        <ellipse cx="66" cy="52" rx="8" ry="14" fill="#8B2500" />
        {/* Hat */}
        <ellipse cx="50" cy="33" rx="24" ry="6" fill="#5C2800" />
        <rect x="30" y="20" width="40" height="17" rx="6" fill="#7B3800" />
        <ellipse cx="50" cy="37" rx="24" ry="4" fill="#5C2800" />
        {/* Round travel glasses */}
        <circle cx="40" cy="53" r="8" fill="none" stroke="#F5E642" strokeWidth="2.5" />
        <circle cx="60" cy="53" r="8" fill="none" stroke="#F5E642" strokeWidth="2.5" />
        <circle cx="40" cy="53" r="6" fill="#E8A030" opacity="0.4" />
        <circle cx="60" cy="53" r="6" fill="#E8A030" opacity="0.4" />
        <line x1="48" y1="53" x2="52" y2="53" stroke="#F5E642" strokeWidth="2" />
        <line x1="32" y1="53" x2="28" y2="53" stroke="#F5E642" strokeWidth="2" />
        <line x1="68" y1="53" x2="72" y2="53" stroke="#F5E642" strokeWidth="2" />
        {/* Eyes through glasses */}
        <circle cx="40" cy="53" r="3" fill="#2C1810" />
        <circle cx="60" cy="53" r="3" fill="#2C1810" />
        <circle cx="41" cy="52" r="1" fill="white" />
        <circle cx="61" cy="52" r="1" fill="white" />
        {/* Nose */}
        <ellipse cx="50" cy="62" rx="2" ry="1.5" fill="#A06030" />
        {/* Smile */}
        <path d="M44 67 Q50 72 56 67" stroke="#805030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Decorative circles - travel stamps */}
        <circle cx="22" cy="80" r="6" fill="#4DC8E0" opacity="0.8" />
        <circle cx="78" cy="80" r="6" fill="#F5E642" opacity="0.8" />
        <text x="19" y="83" fontSize="7" fill="white" fontWeight="bold">✈</text>
        <text x="75" y="83" fontSize="7" fill="#0F1F3D" fontWeight="bold">★</text>
      </svg>
    ),
  },
  {
    id: "indigo",
    name: "Índigo",
    role: "La Escritora",
    bg: "#1A1060",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body - book shaped silhouette */}
        <rect x="30" y="60" width="40" height="32" rx="4" fill="#312E81" />
        {/* Book spine */}
        <rect x="30" y="60" width="6" height="32" rx="2" fill="#4338CA" />
        {/* Book pages detail */}
        <line x1="40" y1="65" x2="65" y2="65" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,2" />
        <line x1="40" y1="70" x2="65" y2="70" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,2" />
        <line x1="40" y1="75" x2="65" y2="75" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,2" />
        <line x1="40" y1="80" x2="58" y2="80" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Head */}
        <circle cx="50" cy="45" r="22" fill="#FAD5A5" />
        {/* Robot/writer mask elements */}
        <ellipse cx="50" cy="33" rx="22" ry="14" fill="#312E81" />
        <ellipse cx="35" cy="48" rx="7" ry="14" fill="#312E81" />
        <ellipse cx="65" cy="48" rx="7" ry="14" fill="#312E81" />
        {/* Visor / headpiece */}
        <rect x="30" y="38" width="40" height="6" rx="3" fill="#4338CA" />
        {/* Antenna */}
        <line x1="50" y1="24" x2="50" y2="15" stroke="#6366F1" strokeWidth="2" />
        <circle cx="50" cy="13" r="3" fill="#F5E642" />
        {/* Eyes */}
        <rect x="37" y="44" width="10" height="8" rx="2" fill="#1A1060" />
        <rect x="53" y="44" width="10" height="8" rx="2" fill="#1A1060" />
        <rect x="37" y="44" width="10" height="8" rx="2" fill="#4DC8E0" opacity="0.5" />
        <rect x="53" y="44" width="10" height="8" rx="2" fill="#4DC8E0" opacity="0.5" />
        <circle cx="42" cy="48" r="2" fill="#4DC8E0" />
        <circle cx="58" cy="48" r="2" fill="#4DC8E0" />
        {/* Mouth/speaker grill */}
        <rect x="40" y="57" width="20" height="5" rx="2" fill="#4338CA" />
        <line x1="43" y1="59.5" x2="57" y2="59.5" stroke="#6366F1" strokeWidth="1" strokeDasharray="2,1" />
        {/* Pen / quill */}
        <line x1="72" y1="55" x2="62" y2="45" stroke="#F5E642" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="62,45 64,48 60,48" fill="#F5E642" />
        <ellipse cx="74" cy="54" rx="4" ry="2" fill="#E8523A" transform="rotate(-45 74 54)" />
      </svg>
    ),
  },
  {
    id: "roja",
    name: "Roja",
    role: "La Dramática",
    bg: "#5C1A00",
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="50" cy="84" rx="22" ry="13" fill="#DC2626" />
        {/* Dress collar */}
        <ellipse cx="50" cy="73" rx="14" ry="8" fill="#B91C1C" />
        {/* Head */}
        <circle cx="50" cy="51" r="21" fill="#FAD5A5" />
        {/* Red dramatic hair */}
        <ellipse cx="50" cy="34" rx="22" ry="16" fill="#DC2626" />
        <ellipse cx="33" cy="46" rx="9" ry="18" fill="#DC2626" />
        <ellipse cx="67" cy="46" rx="9" ry="18" fill="#DC2626" />
        {/* Hair curls up top */}
        <ellipse cx="38" cy="27" rx="8" ry="5" fill="#B91C1C" />
        <ellipse cx="62" cy="27" rx="8" ry="5" fill="#B91C1C" />
        <ellipse cx="50" cy="24" rx="7" ry="5" fill="#B91C1C" />
        {/* Round dramatic glasses */}
        <circle cx="41" cy="52" r="7.5" fill="none" stroke="#F5E642" strokeWidth="2" />
        <circle cx="59" cy="52" r="7.5" fill="none" stroke="#F5E642" strokeWidth="2" />
        <circle cx="41" cy="52" r="5.5" fill="#F5E64230" />
        <circle cx="59" cy="52" r="5.5" fill="#F5E64230" />
        <line x1="48.5" y1="52" x2="51.5" y2="52" stroke="#F5E642" strokeWidth="2" />
        <line x1="31" y1="52" x2="33.5" y2="52" stroke="#F5E642" strokeWidth="2" />
        <line x1="66.5" y1="52" x2="69" y2="52" stroke="#F5E642" strokeWidth="2" />
        {/* Eyes behind glasses */}
        <circle cx="41" cy="52" r="3" fill="#1A0808" />
        <circle cx="59" cy="52" r="3" fill="#1A0808" />
        <circle cx="42" cy="51" r="1" fill="white" />
        <circle cx="60" cy="51" r="1" fill="white" />
        {/* Nose */}
        <ellipse cx="50" cy="60" rx="2" ry="1.5" fill="#E8B080" />
        {/* Dramatic lips */}
        <path d="M43 65 Q46 62 50 64 Q54 62 57 65 Q54 70 50 69 Q46 70 43 65" fill="#DC2626" />
        {/* Music notes */}
        <text x="16" y="35" fontSize="11" fill="#F5E642" opacity="0.9">♪</text>
        <text x="76" y="32" fontSize="9" fill="#F5E642" opacity="0.8">♫</text>
        <text x="20" y="22" fontSize="7" fill="#4DC8E0" opacity="0.7">♩</text>
      </svg>
    ),
  },
];

/** Renders an avatar: SVG illustration if id matches, emoji/text fallback otherwise */
export function ClubAvatar({
  avatarId,
  size = 40,
  className = "",
}: {
  avatarId: string;
  size?: number;
  className?: string;
}) {
  const def = CLUB_AVATARS.find((a) => a.id === avatarId);
  if (def) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          background: def.bg,
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        <div style={{ width: size, height: size }}>{def.svg}</div>
      </div>
    );
  }
  // Fallback: emoji or initials inside a dark circle
  return (
    <div
      className={`rounded-full flex-shrink-0 flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: "#0F1F3D",
        border: "2px solid rgba(255,255,255,0.15)",
        fontSize: size * 0.45,
      }}
    >
      {avatarId}
    </div>
  );
}
