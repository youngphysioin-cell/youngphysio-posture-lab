interface IconProps {
  size?: number;
  className?: string;
}

const base = (size?: number) => ({
  width: size ?? 18,
  height: size ?? 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

/* ================= brand ================= */
export function LogoMark({ size = 38, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="var(--color-accent)" />
      <path
        d="M24 9c-3.4 5-5 8.4-5 13.4 0 4.2 1.8 6.8 5 6.8s5-2.6 5-6.8C29 17.4 27.4 14 24 9Z"
        fill="none"
        stroke="#FAF8F4"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="35.5" r="3.1" fill="#FAF8F4" />
      <path d="M14 39.5h20" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/* ================= ui ================= */
export const IconCamera = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2.2A1.5 1.5 0 0 1 10.4 4h3.2a1.5 1.5 0 0 1 1.2.8L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
    <circle cx="12" cy="12.7" r="3.4" />
  </svg>
);

export const IconUpload = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 15V4.5" />
    <path d="m7.8 8.6 4.2-4.1 4.2 4.1" />
    <path d="M4.5 15.5v2.7A1.8 1.8 0 0 0 6.3 20h11.4a1.8 1.8 0 0 0 1.8-1.8v-2.7" />
  </svg>
);

export const IconCheck = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className} strokeWidth={2.2}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconCheckCircle = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m8.4 12.3 2.5 2.5 4.7-5" />
  </svg>
);

export const IconChevron = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9.5 6 5.5 6-5.5" />
  </svg>
);

export const IconArrowRight = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
);

export const IconInfo = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.4" fill="currentColor" />
  </svg>
);

export const IconAlert = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4.6 2.9 19.2a1 1 0 0 0 .9 1.5h16.4a1 1 0 0 0 .9-1.5L12 4.6Z" />
    <path d="M12 10v4.4" />
    <circle cx="12" cy="17.4" r="0.4" fill="currentColor" />
  </svg>
);

export const IconShield = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3.5 5.2 6v5.3c0 4.4 2.9 7.5 6.8 9.2 3.9-1.7 6.8-4.8 6.8-9.2V6L12 3.5Z" />
    <path d="m9 11.8 2.2 2.2 4-4.2" />
  </svg>
);

export const IconHeartPulse = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 19.5s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 9 5.1c1.3 0 2.4.7 3 1.7.6-1 1.7-1.7 3-1.7a4.4 4.4 0 0 1 4.5 4.4c0 5.4-7.5 10-7.5 10Z" />
    <path d="M6.5 12h3l1.2-2 2 3.6 1.3-1.6h3.5" />
  </svg>
);

export const IconCalendar = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="5.5" width="16" height="14" rx="2" />
    <path d="M8 3.8v3.4M16 3.8v3.4M4 10h16" />
  </svg>
);

export const IconMail = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
);

export const IconPhone = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M7.2 3.8H5.4A1.9 1.9 0 0 0 3.5 5.9 16.8 16.8 0 0 0 18.1 20.5a1.9 1.9 0 0 0 2.1-1.9v-1.8a1.4 1.4 0 0 0-1-1.4l-2.8-.9a1.4 1.4 0 0 0-1.5.5l-.7 1a11.8 11.8 0 0 1-5-5l1-.7a1.4 1.4 0 0 0 .5-1.5l-.9-2.8a1.4 1.4 0 0 0-1.4-1Z" />
  </svg>
);

export const IconPrinter = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M7 8V4.5h10V8" />
    <rect x="4" y="8" width="16" height="8.5" rx="1.6" />
    <path d="M7 13.5h10v6H7Z" />
  </svg>
);

export const IconRefresh = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12a7 7 0 0 1 12.4-4.4L20 10" />
    <path d="M20 5.5V10h-4.5" />
    <path d="M19 12a7 7 0 0 1-12.4 4.4L4 14" />
    <path d="M4 18.5V14h4.5" />
  </svg>
);

export const IconLock = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    <circle cx="12" cy="15.2" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconRuler = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="9" width="18" height="6.5" rx="1.5" transform="rotate(-20 12 12)" />
    <path d="m8.2 12.8 1 2.6M11.5 11.6l.7 1.8M14.7 10.4l1 2.6" />
  </svg>
);

export const IconClipboard = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="4.5" width="14" height="16" rx="2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M8.5 10h7M8.5 13.5h7M8.5 17h4.5" />
  </svg>
);

export const IconTrend = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 18.5 9.5 13l3.5 3.5 7-7.5" />
    <path d="M15.5 9H20v4.5" />
  </svg>
);

export const IconTarget = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.6" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconStop = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.6" />
    <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1" />
  </svg>
);

/* ================= positioning guide ================= */
export const IconCameraHeight = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4.5v15" />
    <path d="m3.4 6.5 1.6-2 1.6 2M3.4 17.5l1.6 2 1.6-2" />
    <rect x="10.5" y="9.5" width="9" height="6.5" rx="1.4" />
    <circle cx="15" cy="12.7" r="1.8" />
    <path d="M8 12.7h2.5" strokeDasharray="1.5 2" />
  </svg>
);

export const IconDistance = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="6" cy="7" r="2.2" />
    <path d="M6 9.5v4.5l-1.6 5M6 14l1.8 5" />
    <path d="M11 17.5h9M18 15.5l2 2-2 2" />
    <path d="M11 15.5v4" strokeDasharray="1.5 2" />
  </svg>
);

export const IconFullBody = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="6" y="3.5" width="12" height="17" rx="2" strokeDasharray="2.5 2.5" />
    <circle cx="12" cy="7.5" r="1.6" />
    <path d="M12 9.5v4.5M12 14l-1.8 4M12 14l1.8 4M9.8 11h4.4" />
  </svg>
);

export const IconRelaxed = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="5.5" r="2" />
    <path d="M12 8v5.5M12 13.5l-2 5M12 13.5l2 5" />
    <path d="M12 9.5c-2 .4-3 1.6-3.2 3.8M12 9.5c2 .4 3 1.6 3.2 3.8" />
  </svg>
);

export const IconGaze = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="10" cy="12" r="6" />
    <circle cx="10" cy="12" r="2" />
    <path d="M18.5 9.5 21 12l-2.5 2.5" />
    <path d="M21 12h-5" strokeDasharray="1.5 2" />
  </svg>
);

export const IconClothing = ({ size, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="m9 4-4.5 3 1.8 3L8 9v11h8V9l1.7 1 1.8-3L15 4a3 3 0 0 1-6 0Z" />
  </svg>
);

/* ================= anatomical figures (Step 1 cards) ================= */
export function FigureSide({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 210" className={className} fill="none" aria-hidden>
      {/* plumb line */}
      <line x1="62" y1="8" x2="62" y2="202" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.7" />
      {/* body */}
      <g stroke="var(--color-ink-soft)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="70" cy="24" r="11" />
        <path d="M68 35c-2 6-3 10-3 15l-2 52c-1 8 0 14 1 20l4 62" />
        <path d="M64 46c8 2 14 3 18 8" opacity="0.5" />
        <path d="M63 122l-8 64" opacity="0.9" />
        <path d="M63 52l6 40" opacity="0.5" />
        <path d="M67 186l-9 8M55 186l-6 8" opacity="0.7" />
      </g>
      {/* landmarks */}
      {[
        [72, 26],
        [66, 48],
        [62, 122],
        [58, 154],
        [55, 186],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 4.4 : 3.6} fill="var(--color-accent)" stroke="#fff" strokeWidth="1.6" />
      ))}
      {/* angle callout */}
      <path d="M66 48 L88 44" stroke="var(--color-scan)" strokeWidth="1.4" strokeDasharray="2 3" />
    </svg>
  );
}

export function FigureFront({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 210" className={className} fill="none" aria-hidden>
      <line x1="65" y1="8" x2="65" y2="202" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.7" />
      <g stroke="var(--color-ink-soft)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="65" cy="24" r="11" />
        <path d="M65 35v30M65 65v52" />
        <path d="M42 47h46" />
        <path d="M42 47l-5 52M88 47l5 52" opacity="0.85" />
        <path d="M52 65h26" opacity="0.5" />
        <path d="M58 117l-6 70M72 117l6 70" />
        <path d="M52 187l-7 7M78 187l7 7" opacity="0.7" />
      </g>
      {[
        [65, 26],
        [42, 47],
        [88, 47],
        [58, 117],
        [72, 117],
        [52, 187],
        [78, 187],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 4.4 : 3.4} fill="var(--color-accent)" stroke="#fff" strokeWidth="1.6" />
      ))}
      <path d="M42 47 L88 52" stroke="var(--color-scan)" strokeWidth="1.4" strokeDasharray="2 3" />
    </svg>
  );
}

/* ================= exercise category pictograms ================= */
export const PictogramMobility = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 15.5a6.5 6.5 0 0 1 11-4.6" />
    <path d="m17.6 7.6-.4 3.6-3.5-.8" />
    <circle cx="7" cy="18" r="1.4" />
    <circle cx="17" cy="17.5" r="1.4" />
    <path d="M8.4 17.8h7.2" strokeDasharray="1.5 2.2" />
  </svg>
);

export const PictogramStrength = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M7.5 12h9" />
    <rect x="4.2" y="9" width="2.6" height="6" rx="0.8" />
    <rect x="17.2" y="9" width="2.6" height="6" rx="0.8" />
    <rect x="1.8" y="10.4" width="1.8" height="3.2" rx="0.6" />
    <rect x="20.4" y="10.4" width="1.8" height="3.2" rx="0.6" />
  </svg>
);

export const PictogramControl = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="5.5" r="2" />
    <path d="M12 8v5l-3.5 5.5M12 13l3.5 5.5" />
    <path d="M7 10.5 12 9l5 1.5" />
    <path d="M5 20h14" strokeDasharray="2 2.6" />
  </svg>
);
