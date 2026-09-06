import type { RefObject } from "react";
import type { ViewMode } from "../lib/posture";
import { IconCheckCircle } from "./icons";

interface StageProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  mode: "idle" | "live" | "photo";
  processing: boolean;
  mirrored: boolean;
  aspect: string;
  statusLabel: string;
  statusColor: string;
  confidence: number | null;
  view: ViewMode;
}

function SilhouetteGuide({ view }: { view: ViewMode }) {
  return (
    <svg viewBox="0 0 200 300" className="h-full w-auto max-h-full opacity-90" fill="none" aria-hidden>
      <line x1="100" y1="6" x2="100" y2="294" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 7" opacity="0.6" />
      <g stroke="var(--color-faint)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 7">
        <circle cx={view === "side" ? 106 : 100} cy="34" r="17" />
        {view === "side" ? (
          <>
            <path d="M104 52c-3 8-4 14-4 22l-3 78c-1 12 0 20 2 29l6 92" />
            <path d="M100 181l-12 94" />
          </>
        ) : (
          <>
            <path d="M100 52v50M100 102v62" />
            <path d="M66 72h68M66 72l-7 76M134 72l7 76" />
            <path d="M86 164l-9 108M114 164l9 108" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function Stage({ videoRef, canvasRef, mode, processing, mirrored, aspect, statusLabel, statusColor, confidence, view }: StageProps) {
  const tracking = mode === "live" && processing;
  return (
    <div className="card relative overflow-hidden !rounded-[22px] bg-sand" style={{ aspectRatio: aspect }}>
      {/* calm backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, #f8f4ec 0%, #efe8db 100%)" }}
        aria-hidden
      />

      {/* media */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${mode === "live" ? "opacity-100" : "opacity-0"} ${mirrored ? "-scale-x-100" : ""}`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* silhouette guide when nothing is tracked yet */}
      {(mode === "idle" || (mode === "live" && !processing)) && (
        <div className="absolute inset-0 grid place-items-center py-8">
          <SilhouetteGuide view={view} />
        </div>
      )}

      {/* status pill */}
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-line-soft bg-card/95 py-1.5 pl-2 pr-3.5 text-[13px] font-semibold text-ink-soft shadow-sm backdrop-blur">
          {tracking ? (
            <IconCheckCircle size={16} className="text-scan" />
          ) : (
            <span className="anim-pulse-soft h-2 w-2 rounded-full" style={{ background: statusColor }} />
          )}
          {statusLabel}
        </span>
      </div>

      {/* visibility readout */}
      <div className="absolute right-3 top-3 rounded-full border border-line-soft bg-card/95 px-3 py-1.5 text-[12px] font-semibold text-muted shadow-sm backdrop-blur">
        Visibility <span className="value-mono ml-1 text-ink">{confidence === null ? "—" : `${Math.round(confidence * 100)}%`}</span>
      </div>

      {/* bottom hint */}
      <div className="absolute inset-x-3 bottom-3">
        <div className="rounded-xl border border-line-soft bg-card/95 px-4 py-2.5 text-center text-[13px] font-medium text-muted shadow-sm backdrop-blur">
          {mode === "idle" && "Your camera preview will appear here"}
          {mode === "live" && !processing && "Position your entire body inside the frame"}
          {mode === "live" && processing && "Looking good — stand still, then capture"}
          {mode === "photo" && !processing && "Photo captured — your analysis is below"}
          {mode === "photo" && processing && "Reading your photo…"}
        </div>
      </div>

      {/* gentle tracking ring */}
      {tracking && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
          <div className="anim-breathe h-24 w-24 rounded-full border-2 border-scan/50" />
        </div>
      )}
    </div>
  );
}
