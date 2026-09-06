import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Metric, Severity } from "../lib/posture";
import { SEVERITY_COLOR, SEVERITY_LABEL } from "../lib/posture";
import type { Exercise, Prescription, RxItem } from "../lib/exercises";
import { STATUS_LABEL, patientName, patientShort, type Observation } from "../lib/patientCopy";
import { IconAlert, IconCheckCircle, IconChevron, IconInfo, IconRefresh, IconShield, IconTarget } from "./icons";

/* ---------------- scroll reveal ---------------- */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- section head ---------------- */
export function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mb-6">
        <div className="eyebrow">{kicker}</div>
        <h3 className="mt-1.5 font-display text-[26px] font-bold tracking-tight text-ink sm:text-3xl">{title}</h3>
        {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{sub}</p>}
      </div>
    </Reveal>
  );
}

/* ---------------- status badge ---------------- */
export function StatusBadge({ sev, compact = false }: { sev: Severity; compact?: boolean }) {
  const c = SEVERITY_COLOR[sev];
  const soft =
    sev === 0 ? "var(--color-scan-soft)" : sev === 1 ? "var(--color-info-soft)" : sev === 2 ? "var(--color-warn-soft)" : "var(--color-risk-soft)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-bold"
      style={{ color: c, background: soft, borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {compact ? STATUS_LABEL[sev].split(" ")[0] : STATUS_LABEL[sev]}
    </span>
  );
}

/* ---------------- posture index ring ---------------- */
export function IndexRing({ index, color }: { index: number; color: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setShown(index), 150);
    return () => window.clearTimeout(t);
  }, [index]);
  const R = 74;
  const C = 2 * Math.PI * R;
  const frac = Math.min(1, Math.max(0, shown / 100));
  return (
    <div className="relative h-[190px] w-[190px]">
      <svg viewBox="0 0 190 190" className="h-full w-full -rotate-90">
        <circle cx="95" cy="95" r={R} fill="none" stroke="var(--color-line-soft)" strokeWidth="13" />
        <circle
          cx="95"
          cy="95"
          r={R}
          fill="none"
          strokeWidth="13"
          strokeLinecap="round"
          style={{ stroke: color, strokeDasharray: `${frac * C} ${C}`, transition: "stroke-dasharray 1.3s cubic-bezier(0.22,0.7,0.25,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="value-mono text-[44px] font-semibold leading-none text-ink">{Math.round((shown / 100) * index)}</span>
        <span className="mt-1.5 text-[12px] font-semibold tracking-wide text-faint">/ 100</span>
      </div>
    </div>
  );
}

/* ---------------- metric mini glyph ---------------- */
function MetricGlyph({ m }: { m: Metric }) {
  const c = SEVERITY_COLOR[m.severity];
  const t = Math.min(1, Math.max(0, m.glyphT));
  const dir = m.value >= 0 ? 1 : -1;
  if (m.glyph === "level") {
    const dy = 4 + t * 12;
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
        <line x1="8" y1="32" x2="56" y2="32" stroke="var(--color-line)" strokeWidth="1.4" strokeDasharray="3 4" />
        <line x1="12" y1={32 - dy / 2} x2="52" y2={32 + dy / 2} style={{ stroke: c }} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy={32 - dy / 2} r="3.4" style={{ fill: c }} />
        <circle cx="52" cy={32 + dy / 2} r="3.4" fill="var(--color-card)" style={{ stroke: c }} strokeWidth="2" />
      </svg>
    );
  }
  if (m.glyph === "offset") {
    const dx = dir * (4 + t * 16);
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
        <line x1="32" y1="8" x2="32" y2="56" stroke="var(--color-line)" strokeWidth="1.4" strokeDasharray="3 4" />
        <line x1="32" y1="20" x2={32 + dx} y2="20" style={{ stroke: c }} strokeWidth="1.6" />
        <path d={`M ${32 + dx} 20 l ${-4 * dir} -3 v 6 Z`} style={{ fill: c }} />
        <circle cx="32" cy="42" r="3" fill="var(--color-card)" stroke="var(--color-faint)" strokeWidth="1.6" />
        <circle cx={32 + dx} cy="20" r="4.4" style={{ fill: c }} />
      </svg>
    );
  }
  const ang = 8 + t * 34;
  const rad = (ang * Math.PI) / 180;
  const x2 = 32 + dir * Math.sin(rad) * 26;
  const y2 = 50 - Math.cos(rad) * 26;
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden>
      <line x1="32" y1="50" x2="32" y2="10" stroke="var(--color-line)" strokeWidth="1.4" strokeDasharray="3 4" />
      <path d={`M 32 ${50 - 16} A 16 16 0 0 ${dir > 0 ? 1 : 0} ${32 + dir * Math.sin(rad) * 16} ${50 - Math.cos(rad) * 16}`} fill="none" style={{ stroke: c }} strokeWidth="1.2" opacity="0.7" />
      <line x1="32" y1="50" x2={x2} y2={y2} style={{ stroke: c }} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="50" r="3.4" style={{ fill: c }} />
      <circle cx={x2} cy={y2} r="3" fill="var(--color-card)" style={{ stroke: c }} strokeWidth="1.8" />
    </svg>
  );
}

/* ---------------- compact measurement card ---------------- */
export function MetricCard({ m, i }: { m: Metric; i: number }) {
  const [open, setOpen] = useState(false);
  const c = SEVERITY_COLOR[m.severity];
  return (
    <Reveal delay={(i % 3) * 70} className="h-full">
      <article className="card card-hover flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl border border-line-soft bg-well">
              <MetricGlyph m={m} />
            </div>
            <div>
              <h4 className="font-display text-[15.5px] font-bold leading-tight text-ink">{patientName(m)}</h4>
              <p className="mt-0.5 text-[12px] font-medium text-faint">Reference: {m.normalRange}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="value-mono text-[30px] font-semibold leading-none" style={{ color: c }}>
            {m.display}
          </div>
          <StatusBadge sev={m.severity} />
        </div>

        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">{patientShort(m)}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-4 flex w-full items-center justify-between border-t border-line-soft pt-3 text-left text-[13px] font-bold text-accent-deep transition-colors hover:text-accent"
        >
          <span className="flex items-center gap-1.5">
            <IconInfo size={15} /> Clinical information
          </span>
          <IconChevron size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <div className={`acc-body ${open ? "open" : ""}`}>
          <div className="acc-inner">
            <div className="space-y-2.5 pt-3">
              <p className="text-[13px] leading-relaxed text-ink-soft">{m.interpretation}</p>
              <p className="text-[12.5px] font-semibold text-muted">
                Observed pattern: <span style={{ color: c }}>{m.direction} · {SEVERITY_LABEL[m.severity]}</span>
              </p>
              <p className="border-l-2 pl-3 text-[11.5px] leading-relaxed text-faint" style={{ borderColor: "var(--color-line)" }}>
                {m.citation}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------------- key observations ---------------- */
export function ObservationList({ observations }: { observations: Observation[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {observations.map((o, i) => {
        const c = SEVERITY_COLOR[o.sev];
        return (
          <Reveal key={i} delay={i * 70}>
            <li className="card flex items-center gap-3 px-4 py-3.5 !shadow-none">
              {o.sev === 0 ? <IconCheckCircle size={19} className="shrink-0 text-scan" /> : <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />}
              <span className="text-[14px] font-semibold capitalize text-ink-soft">{o.text}</span>
            </li>
          </Reveal>
        );
      })}
    </ul>
  );
}

/* ---------------- what needs attention (ranked) ---------------- */
export function AttentionList({ metrics }: { metrics: Metric[] }) {
  const flagged = [...metrics].filter((m) => m.severity > 0).sort((a, b) => b.severity - a.severity || b.weight - a.weight);
  if (flagged.length === 0) {
    return (
      <Reveal>
        <div className="card flex items-center gap-3.5 border-scan/25 bg-scan-soft/60 p-5">
          <IconCheckCircle size={24} className="shrink-0 text-scan" />
          <div>
            <p className="font-display text-[15px] font-bold text-ink">No notable variations observed</p>
            <p className="mt-0.5 text-[13.5px] text-muted">All measured alignment patterns sit within expected ranges in this image.</p>
          </div>
        </div>
      </Reveal>
    );
  }
  return (
    <div className="space-y-2.5">
      {flagged.map((m, i) => (
        <Reveal key={m.id} delay={i * 60}>
          <div className="card card-hover flex items-center gap-4 p-4">
            <span className="value-mono grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand text-[15px] font-semibold text-accent-deep">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-bold text-ink">{patientName(m)}</p>
              <p className="mt-0.5 truncate text-[13px] text-muted">{patientShort(m)}</p>
            </div>
            <StatusBadge sev={m.severity} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- exercise card ---------------- */
const TAG_META: Record<Exercise["tag"], { label: string; color: string; soft: string }> = {
  mobility: { label: "Mobility", color: "#3e7c5b", soft: "#e6f0e9" },
  activation: { label: "Motor control", color: "#4e7fa0", soft: "#e5edf3" },
  strength: { label: "Strength", color: "#8f6e3c", soft: "#f4ecdd" },
};

export function ExerciseCard({ item, n }: { item: RxItem; n: number }) {
  const ex = item.ex;
  const meta = TAG_META[ex.tag] ?? TAG_META.mobility;
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={(n % 2) * 80}>
      <article className="card card-hover overflow-hidden">
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <span className="value-mono mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-[14px] font-semibold text-cream">
                {String(n).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-display text-[17px] font-bold leading-tight text-ink">{ex.name}</h4>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2.5 py-0.5 text-[11.5px] font-bold" style={{ color: meta.color, background: meta.soft }}>
                    {meta.label}
                  </span>
                  <span className="text-[12px] font-semibold text-faint">{ex.target}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[`${ex.sets} sets`, ex.reps, ex.hold !== "—" ? ex.hold : null].filter(Boolean).map((chip) => (
                <span key={chip as string} className="value-mono rounded-lg border border-line bg-well px-2 py-1 text-[11.5px] font-semibold text-ink-soft">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-[12.5px] font-medium text-faint">
            <IconTarget size={14} className="mt-0.5 shrink-0 text-accent" />
            Prescribed for: <span className="capitalize">{item.reasons.join(" · ")}</span>
          </p>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between border-t border-line-soft bg-well/60 px-5 py-3.5 text-left text-[13.5px] font-bold text-accent-deep transition-colors hover:bg-accent-soft/60"
        >
          {open ? "Hide instructions" : "View instructions"}
          <IconChevron size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <div className={`acc-body ${open ? "open" : ""}`}>
          <div className="acc-inner">
            <div className="space-y-4 border-t border-line-soft px-5 py-4">
              <div>
                <div className="eyebrow !text-[10px]">How to perform</div>
                <ol className="mt-2.5 space-y-2">
                  {ex.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-soft">
                      <span className="value-mono mt-0.5 text-[11px] font-semibold text-accent-deep">Step {i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="rounded-xl bg-sand/70 p-3.5 text-[12.5px] leading-relaxed text-muted">
                <span className="font-bold text-ink-soft">Why it helps: </span>
                {ex.why}
              </p>
              {ex.caution && (
                <p className="flex gap-2 rounded-xl border border-warn/30 bg-warn-soft/70 p-3.5 text-[12.5px] leading-relaxed text-ink-soft">
                  <IconAlert size={15} className="mt-0.5 shrink-0 text-warn" />
                  <span><span className="font-bold">Safety: </span>{ex.caution}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------------- weekly schedule ---------------- */
export function ScheduleStrip({ rx }: { rx: Prescription }) {
  const toneColor = { work: "var(--color-scan)", move: "var(--color-accent)", rest: "var(--color-faint)" } as const;
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
      {rx.schedule.map((d, i) => (
        <Reveal key={d.day} delay={i * 50} className="h-full">
          <div className="card card-hover h-full p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-display text-[12.5px] font-bold text-ink">{d.day}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: toneColor[d.tone] }} />
            </div>
            <p className="mt-1.5 text-[13px] font-bold leading-snug text-ink-soft">{d.focus}</p>
            <p className="mt-1 text-[11.5px] leading-snug text-faint">{d.detail}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------- history ---------------- */
export interface HistoryEntry {
  ts: number;
  view: "side" | "front";
  index: number;
  gradeLabel: string;
  color: string;
  top: string;
}

export function HistoryPanel({ entries, onClear }: { entries: HistoryEntry[]; onClear: () => void }) {
  const W = 560, H = 110, P = 14;
  const pts = entries.slice(-12);
  const xy = (i: number, v: number) => ({
    x: P + (i / Math.max(1, pts.length - 1)) * (W - P * 2),
    y: H - P - (v / 100) * (H - P * 2),
  });
  const line = pts.map((e, i) => { const { x, y } = xy(i, e.index); return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Previous screenings</div>
          <h4 className="mt-1 font-display text-xl font-bold text-ink">Your alignment over time</h4>
          <p className="mt-1 text-[13px] text-muted">Stored privately on this device only.</p>
        </div>
        {entries.length > 0 && (
          <button onClick={onClear} className="no-print btn btn-soft !min-h-[40px] !px-4 !text-[13px]">
            <IconRefresh size={15} /> Clear history
          </button>
        )}
      </div>
      {pts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-well/50 p-6 text-center text-[13.5px] font-medium text-faint">
          No screenings logged yet — your first result will appear here.
        </p>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label="Posture index trend chart">
            {[25, 50, 75].map((g) => (
              <line key={g} x1={P} y1={H - P - (g / 100) * (H - P * 2)} x2={W - P} y2={H - P - (g / 100) * (H - P * 2)} stroke="var(--color-line-soft)" strokeDasharray="3 5" />
            ))}
            {pts.length > 1 && <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2" opacity="0.85" />}
            {pts.map((e, i) => {
              const { x, y } = xy(i, e.index);
              return (
                <circle key={e.ts} cx={x} cy={y} r="4.5" fill="var(--color-card)" strokeWidth="2.5" style={{ stroke: e.color }}>
                  <title>{`${new Date(e.ts).toLocaleString()} · ${e.view} view · index ${e.index}`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[...pts].reverse().slice(0, 6).map((e) => (
              <div key={e.ts} className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-well/60 px-3.5 py-2.5">
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold text-faint">
                    {new Date(e.ts).toLocaleDateString(undefined, { day: "2-digit", month: "short" })} ·{" "}
                    {new Date(e.ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} · {e.view} view
                  </div>
                  <div className="mt-0.5 truncate text-[12.5px] font-semibold capitalize text-ink-soft">{e.top || "All patterns nominal"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="value-mono text-[19px] font-semibold" style={{ color: e.color }}>{e.index}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- analysing overlay ---------------- */
export function AnalyzingOverlay({ active, stages }: { active: boolean; stages: string[] }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!active) {
      setStage(stages.length - 1);
      return;
    }
    setStage(0);
    const id = window.setInterval(() => setStage((s) => Math.min(s + 1, stages.length - 2)), 800);
    return () => window.clearInterval(id);
  }, [active, stages.length]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-cream/92 p-4 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="card tick-in w-full max-w-md p-7 text-center sm:p-9">
        <div className="relative mx-auto h-16 w-16">
          <svg viewBox="0 0 64 64" className="anim-spin-calm h-full w-full">
            <circle cx="32" cy="32" r="27" fill="none" stroke="var(--color-line)" strokeWidth="5" />
            <path d="M32 5a27 27 0 0 1 27 27" fill="none" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <IconShield size={22} className="absolute inset-0 m-auto text-accent" />
        </div>
        <h3 className="mt-5 font-display text-[22px] font-bold text-ink">Analysing Your Posture</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          Our system is reviewing visible alignment patterns from your image.
        </p>
        <ul className="mx-auto mt-6 max-w-[280px] space-y-3 text-left">
          {stages.map((s, i) => {
            const done = i < stage;
            const now = i === stage;
            return (
              <li key={s} className="flex items-center gap-3">
                {done ? (
                  <IconCheckCircle size={19} className="shrink-0 text-scan" />
                ) : now ? (
                  <span className="anim-pulse-soft ml-[3px] h-[13px] w-[13px] shrink-0 rounded-full border-[2.5px] border-accent" />
                ) : (
                  <span className="ml-[3px] h-[13px] w-[13px] shrink-0 rounded-full border-2 border-line" />
                )}
                <span className={`text-[14px] font-semibold ${done ? "text-ink-soft" : now ? "text-ink" : "text-faint"}`}>{s}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-[11.5px] font-medium text-faint">Your photo is processed on this device and is never uploaded.</p>
      </div>
    </div>
  );
}

/* ---------------- stepper ---------------- */
export function Stepper({ current }: { current: number }) {
  const steps = ["Choose assessment view", "Capture your posture", "Position yourself", "Analyse results"];
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Assessment progress">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[12.5px] font-bold transition-colors ${
                active ? "border-accent bg-accent-soft text-accent-deep" : done ? "border-scan/30 bg-scan-soft/70 text-scan" : "border-line bg-card text-faint"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11.5px] ${
                  active ? "bg-accent text-white" : done ? "bg-scan text-white" : "bg-sand text-muted"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span className={active ? "" : "hidden sm:inline"}>{s}</span>
            </span>
            {n < steps.length && <span className="hidden h-px w-5 bg-line sm:block" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
