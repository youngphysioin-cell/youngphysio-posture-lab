/* ------------------------------------------------------------------ */
/*  Patient-friendly presentation layer.                              */
/*  All clinical wording, reference ranges and citations live in      */
/*  lib/posture.ts and are surfaced only inside the expandable        */
/*  "Clinical information" section of each measurement card.          */
/* ------------------------------------------------------------------ */

import type { Metric, ReportData, Severity } from "./posture";

export const STATUS_LABEL: Record<Severity, string> = {
  0: "Within expected range",
  1: "Mild variation",
  2: "Moderate variation",
  3: "Notable variation",
};

export const SEVERITY_WORD: Record<Severity, string> = {
  0: "",
  1: "Mild",
  2: "Moderate",
  3: "Notable",
};

interface PatientMetricCopy {
  name: string; // patient-facing measurement name
  ok: string; // short explanation when within range
  off: string; // short explanation when a variation is visible
  strong: string; // short explanation for marked variations
}

export const PATIENT_METRICS: Record<string, PatientMetricCopy> = {
  cva: {
    name: "Head & Neck Angle",
    ok: "The angle between your neck line and horizontal looks within the expected range in this image.",
    off: "The neck-line angle suggests a mild forward-head tendency — very common with desk and phone use.",
    strong: "The neck-line angle sits well below the expected range, which can place extra demand on the neck muscles.",
  },
  fhd: {
    name: "Forward Head Position",
    ok: "Your head appears reasonably aligned over your shoulders in this image.",
    off: "Your head appears slightly ahead of your shoulders — a very common pattern after long periods of screen time.",
    strong: "Your head appears noticeably ahead of your shoulders, which may increase strain through the neck and upper back.",
  },
  shShift: {
    name: "Shoulder Position",
    ok: "Your shoulders sit comfortably over your hips in this side view.",
    off: "Your shoulders appear slightly rounded forward in this image — often linked to prolonged sitting.",
    strong: "Your shoulders appear clearly rounded forward, a pattern that can accompany a slouched sitting posture.",
  },
  trunk: {
    name: "Trunk Alignment",
    ok: "Your trunk stacks neatly over your feet in this image.",
    off: "A gentle whole-body lean is visible — this can simply be how you naturally stand.",
    strong: "A clear whole-body lean is visible through your posture, which may increase muscular effort to stay upright.",
  },
  pelvis: {
    name: "Pelvic Position",
    ok: "Your pelvis appears centred over your feet in this image.",
    off: "Your pelvis appears slightly shifted from centre — a common variation in relaxed standing.",
    strong: "Your pelvis appears clearly shifted from centre, which can change how load travels through the lower back and hips.",
  },
  sway: {
    name: "Overall Balance Line",
    ok: "Your overall balance line falls close to your ankles — nicely centred.",
    off: "Your balance line sits a little in front of your ankles in this image.",
    strong: "Your balance line sits well in front of your ankles, meaning your back muscles work harder to keep you upright.",
  },
  kneeSag: {
    name: "Knee Position",
    ok: "Your knees look relaxed and close to straight in this stance.",
    off: "Your knees appear slightly bent or gently locked in this stance.",
    strong: "Your knees appear distinctly bent or locked back — worth softening when you stand for long periods.",
  },
  shDrop: {
    name: "Shoulder Level",
    ok: "Your shoulders look level in this image.",
    off: "One shoulder appears slightly lower — often related to muscle balance or everyday habits like carrying a bag.",
    strong: "One shoulder appears clearly lower — if this is new or uncomfortable, it's worth a professional look.",
  },
  headTilt: {
    name: "Head Tilt",
    ok: "Your head looks level over your shoulders.",
    off: "A gentle head tilt is visible in this image — often a comfortable habitual position.",
    strong: "A clear head tilt is visible, which can accompany tightness in the side neck muscles.",
  },
  trunkTilt: {
    name: "Trunk Lean",
    ok: "Your shoulders sit centred over your pelvis in this view.",
    off: "A slight sideways lean is visible — sometimes just a preferred standing habit.",
    strong: "A clear sideways lean is visible. If it persists or causes discomfort, consider a professional assessment.",
  },
  hipDrop: {
    name: "Hip Level",
    ok: "Your hips look level in this image.",
    off: "One hip appears slightly lower — a common and often harmless asymmetry.",
    strong: "One hip appears clearly lower. Persistent asymmetry can deserve a professional review.",
  },
  kneeF: {
    name: "Knee Alignment",
    ok: "Your knees track neatly over your feet in this view.",
    off: "A knee appears to drift slightly inward or outward in this image.",
    strong: "A knee appears to drift clearly from the neutral line, which can change load through the knee.",
  },
  kneeAsym: {
    name: "Knee Symmetry",
    ok: "Both knees look symmetric in this image.",
    off: "Your knees differ slightly side to side — often related to stance habits.",
    strong: "Your knees differ noticeably side to side, which may reflect strength or mobility differences between legs.",
  },
};

export function patientName(m: Metric): string {
  return PATIENT_METRICS[m.id]?.name ?? m.label;
}

export function patientShort(m: Metric): string {
  const c = PATIENT_METRICS[m.id];
  if (!c) return m.direction;
  if (m.severity === 0) return c.ok;
  if (m.severity >= 3) return c.strong;
  return c.off;
}

/* ---------------- observations (Key Observations section) ---------- */
export interface Observation {
  text: string;
  sev: Severity;
}

export function observationsFor(report: ReportData): Observation[] {
  const flagged = [...report.metrics].filter((m) => m.severity > 0).sort((a, b) => b.severity - a.severity || b.weight - a.weight);
  const ok = report.metrics.filter((m) => m.severity === 0);
  const out: Observation[] = flagged.slice(0, 3).map((m) => ({
    text: `${SEVERITY_WORD[m.severity]} ${patientName(m).toLowerCase()} pattern observed`,
    sev: m.severity,
  }));
  ok.slice(0, Math.max(0, 3 - out.length)).forEach((m) =>
    out.push({ text: `${patientName(m)} within expected range`, sev: 0 })
  );
  return out.slice(0, 4);
}

/* ---------------- grade wording ------------------------------------ */
export const GRADE_COPY: Record<string, { title: string; blurb: string }> = {
  excellent: {
    title: "Generally Well Aligned",
    blurb: "Your visible alignment patterns sit comfortably within expected ranges. Keep up your current activity and movement habits.",
  },
  good: {
    title: "Mostly Well Aligned",
    blurb: "A few mild variations were observed. Small, consistent habits — and the plan below — can make a meaningful difference.",
  },
  fair: {
    title: "Some Variations Noted",
    blurb: "Several alignment patterns sit outside expected ranges. The recommended plan targets your most prominent findings first.",
  },
  poor: {
    title: "Notable Variations",
    blurb: "Multiple alignment patterns differ from expected ranges in this image. Consider reviewing these findings with a qualified physiotherapist.",
  },
};

/* ---------------- analysis stage wording --------------------------- */
export const ANALYSIS_STAGES = [
  "Image quality checked",
  "Body position detected",
  "Analysing alignment",
  "Preparing your results",
];

/* ---------------- disclaimer --------------------------------------- */
export const DISCLAIMER =
  "This posture screening is intended for general informational and educational purposes and does not provide a medical diagnosis. Posture observations should be interpreted alongside symptoms, clinical examination, and professional judgement. If you have pain, injury, neurological symptoms, or other health concerns, consult a qualified healthcare professional.";

export const RED_FLAGS = [
  "Pain radiating down an arm or leg, numbness, tingling or weakness",
  "Bowel or bladder changes alongside back pain",
  "Night pain, fever, or unexplained weight loss",
  "Posture change following an injury, or a rapidly changing curve",
  "Dizziness or visual symptoms with neck movement",
];
