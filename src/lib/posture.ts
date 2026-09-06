/* ------------------------------------------------------------------ */
/*  ALIGN/LAB — photogrammetric posture analysis                       */
/*  Metrics follow published photographic-posture-assessment methods.  */
/*  All values are screening estimates, not diagnostic measurements.   */
/* ------------------------------------------------------------------ */

export interface Pt {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type ViewMode = "side" | "front";
export type Severity = 0 | 1 | 2 | 3;

export interface Metric {
  id: string;
  label: string;
  unit: string;
  value: number; // signed, in `unit`
  display: string;
  severity: Severity;
  direction: string; // human description of the deviation direction
  normalRange: string;
  interpretation: string;
  citation: string;
  weight: number;
  glyph: "angle" | "level" | "offset";
  glyphT: number; // 0..1 deflection for the mini sketch
}

export interface GradeInfo {
  key: "excellent" | "good" | "fair" | "poor";
  label: string;
  color: string; // css var token
}

export interface ReportData {
  view: ViewMode;
  ts: number;
  metrics: Metric[];
  index: number;
  grade: GradeInfo;
  summary: string[];
  confidence: number;
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  0: "Within normal limits",
  1: "Mild deviation",
  2: "Moderate deviation",
  3: "Marked deviation",
};

export const SEVERITY_COLOR: Record<Severity, string> = {
  0: "var(--color-scan)",
  1: "var(--color-info)",
  2: "var(--color-warn)",
  3: "var(--color-risk)",
};

/* ---------------- landmark indices (MediaPipe Pose, 33 pts) ------- */
export const LM = {
  NOSE: 0,
  L_EAR: 7,
  R_EAR: 8,
  L_SHOULDER: 11,
  R_SHOULDER: 12,
  L_HIP: 23,
  R_HIP: 24,
  L_KNEE: 25,
  R_KNEE: 26,
  L_ANKLE: 27,
  R_ANKLE: 28,
} as const;

/* ---------------- geometry helpers -------------------------------- */
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** Interior angle at vertex b of triangle a-b-c, degrees (0..180). */
function angleAtDeg(a: Pt, b: Pt, c: Pt): number {
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const m1 = Math.hypot(v1x, v1y), m2 = Math.hypot(v2x, v2y);
  if (m1 < 1e-6 || m2 < 1e-6) return 180;
  const cos = Math.min(1, Math.max(-1, (v1x * v2x + v1y * v2y) / (m1 * m2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Signed angle of the top→bottom segment from true vertical. + = top shifted to screen-right. */
function tiltSignedDeg(top: Pt, bottom: Pt): number {
  const vx = top.x - bottom.x, vy = top.y - bottom.y;
  const m = Math.hypot(vx, vy);
  if (m < 1e-6) return 0;
  const cos = Math.min(1, Math.max(-1, -vy / m));
  const a = (Math.acos(cos) * 180) / Math.PI;
  return vx >= 0 ? a : -a;
}

/** x of the hip→ankle line at a given y (image coords, y down). */
function lineXAtY(top: Pt, bottom: Pt, y: number): number {
  const dy = bottom.y - top.y;
  if (Math.abs(dy) < 1e-6) return top.x;
  const t = (y - top.y) / dy;
  return top.x + (bottom.x - top.x) * t;
}

function sevFrom(value: number, bands: [number, number, number], useAbs = true): Severity {
  const v = useAbs ? Math.abs(value) : value;
  if (v > bands[2]) return 3;
  if (v > bands[1]) return 2;
  if (v > bands[0]) return 1;
  return 0;
}

function sevBelow(value: number, bands: [number, number, number]): Severity {
  if (value < bands[2]) return 3;
  if (value < bands[1]) return 2;
  if (value < bands[0]) return 1;
  return 0;
}

const fmt = (v: number, d = 1) => v.toFixed(d);
const signed = (v: number, d = 1) => `${v > 0 ? "+" : ""}${v.toFixed(d)}`;

/* ================================================================== */
/*  SIDE VIEW — sagittal plane                                        */
/* ================================================================== */

function pickVisibleSide(pts: Pt[]): "L" | "R" {
  const vis = (i: number) => pts[i]?.visibility ?? 0;
  const L = vis(LM.L_EAR) + vis(LM.L_SHOULDER) + vis(LM.L_HIP) + vis(LM.L_ANKLE);
  const R = vis(LM.R_EAR) + vis(LM.R_SHOULDER) + vis(LM.R_HIP) + vis(LM.R_ANKLE);
  return L >= R ? "L" : "R";
}

export function analyzeSide(pts: Pt[]): Metric[] {
  const s = pickVisibleSide(pts);
  const ear = s === "L" ? pts[LM.L_EAR] : pts[LM.R_EAR];
  const sh = s === "L" ? pts[LM.L_SHOULDER] : pts[LM.R_SHOULDER];
  const hip = s === "L" ? pts[LM.L_HIP] : pts[LM.R_HIP];
  const knee = s === "L" ? pts[LM.L_KNEE] : pts[LM.R_KNEE];
  const ankle = s === "L" ? pts[LM.L_ANKLE] : pts[LM.R_ANKLE];
  const nose = pts[LM.NOSE];

  const topY = Math.min(ear.y, nose.y);
  const height = Math.max(0.05, ankle.y - topY); // visible stature, normalized
  const facingLeft = nose.x < ear.x;
  /** positive = point p is anterior (in front) of reference x, given facing */
  const fwd = (px: number, refX: number) => (facingLeft ? refX - px : px - refX);

  /* 1 · Craniovertebral angle — horizontal through C7 vs C7→tragus line.
        Normal ≈ 50–56°; < 50° associated with forward head posture. */
  const cvaVal = (Math.atan2(Math.abs(ear.y - sh.y), Math.abs(ear.x - sh.x)) * 180) / Math.PI;
  const cvaSev = sevBelow(cvaVal, [50, 45, 40]);
  const cva: Metric = {
    id: "cva",
    label: "Craniovertebral Angle (CVA)",
    unit: "°",
    value: cvaVal,
    display: `${fmt(cvaVal)}°`,
    severity: cvaSev,
    direction: cvaSev === 0 ? "Head stacked over shoulders" : "Ear translated anterior to shoulder line",
    normalRange: "≥ 50° (typ. 50–56°)",
    interpretation:
      cvaSev === 0
        ? "The C7–tragus line is steep relative to horizontal, consistent with a neutral sagittal head position."
        : "A reduced CVA is the most widely reported photogrammetric marker of forward head posture. Systematic review data place mean CVA around 48–49° in forward-head groups versus ≈ 54° in asymptomatic controls.",
    citation: "Salah et al., Gait & Posture 2016; Singla & Veqar, J Chiropr Med 2017",
    weight: 24,
    glyph: "angle",
    glyphT: Math.min(1, Math.max(0, (62 - cvaVal) / 22)),
  };

  /* 2 · Forward head distance, % of visible height */
  const fhdVal = (fwd(ear.x, sh.x) / height) * 100;
  const fhdSev = sevFrom(fhdVal, [8, 12, 16], false);
  const fhd: Metric = {
    id: "fhd",
    label: "Forward Head Distance (FHD)",
    unit: "% h",
    value: fhdVal,
    display: `${signed(fhdVal)}%`,
    severity: fhdSev,
    direction: fhdVal > 0 ? "Head positioned anterior to the shoulder plumb line" : "Head retracted behind the shoulder line",
    normalRange: "0 – 8% of stature",
    interpretation:
      fhdSev === 0
        ? "Horizontal ear–shoulder offset is within the expected range for relaxed standing."
        : "Anterior translation of the head lengthens the gravitational moment arm on the cervical spine — each ~2 cm of forward translation meaningfully increases cervical extensor demand.",
    citation: "Neumann, Kinesiology of the Musculoskeletal System, 3rd ed., 2017",
    weight: 12,
    glyph: "offset",
    glyphT: Math.min(1, Math.max(0, fhdVal / 18)),
  };

  /* 3 · Shoulder sagittal shift — rounded-shoulder / kyphosis screen */
  const shShiftVal = (fwd(sh.x, hip.x) / height) * 100;
  const shShiftSev = sevFrom(shShiftVal, [3, 5.5, 8], false);
  const shShift: Metric = {
    id: "shShift",
    label: "Shoulder Sagittal Shift",
    unit: "% h",
    value: shShiftVal,
    display: `${signed(shShiftVal)}%`,
    severity: shShiftSev,
    direction:
      shShiftVal > 0 ? "Shoulders sit anterior to the hip line (rounded-shoulder pattern)" : "Shoulders sit posterior to the hip line",
    normalRange: "0 – 3% of stature anterior",
    interpretation:
      shShiftSev === 0
        ? "Acromion aligns close to the greater-trochanter plumb line in the sagittal plane."
        : "Anterior shoulder carriage screens for a rounded-shoulder / hyperkyphotic posture. True thoracic Cobb angles require radiography — this is a photographic screen only.",
    citation: "Singla & Veqar, J Chiropr Med 2017; Kendall et al., 2005",
    weight: 16,
    glyph: "offset",
    glyphT: Math.min(1, Math.max(0, shShiftVal / 9)),
  };

  /* 4 · Trunk lean — shoulder–hip–ankle angle deviation */
  const trunkDev = 180 - angleAtDeg(sh, hip, ankle);
  const trunkSev = sevFrom(trunkDev, [5, 9, 13]);
  const trunkFwdLean = fwd(sh.x, ankle.x) > 0;
  const trunk: Metric = {
    id: "trunk",
    label: "Trunk Sagittal Lean",
    unit: "°",
    value: trunkFwdLean ? trunkDev : -trunkDev,
    display: `${fmt(trunkDev)}°`,
    severity: trunkSev,
    direction: trunkSev === 0 ? "Torso aligned over base of support" : trunkFwdLean ? "Whole-trunk forward lean" : "Whole-trunk backward lean",
    normalRange: "< 5° from vertical axis",
    interpretation:
      trunkSev === 0
        ? "The shoulder–hip–ankle chain is close to collinear, indicating an economical stacked posture."
        : "Sustained trunk lean shifts the load axis anterior or posterior to the joint centres, increasing passive tissue and muscle demand through the lumbo-pelvic region.",
    citation: "Sahrmann, Diagnosis & Treatment of Movement Impairment Syndromes, 2002",
    weight: 12,
    glyph: "angle",
    glyphT: Math.min(1, trunkDev / 14),
  };

  /* 5 · Pelvic sagittal offset — hip vs ankle plumb line */
  const pelvisVal = (fwd(hip.x, ankle.x) / height) * 100;
  const pelvisSev = sevFrom(pelvisVal, [2.5, 5, 8]);
  const pelvis: Metric = {
    id: "pelvis",
    label: "Pelvic Sagittal Offset",
    unit: "% h",
    value: pelvisVal,
    display: `${signed(pelvisVal)}%`,
    severity: pelvisSev,
    direction:
      pelvisSev === 0
        ? "Pelvis centred over the base of support"
        : pelvisVal < 0
          ? "Hip falls behind the ankle line — anterior-tilt / lumbar-extended bias"
          : "Hip drifts ahead of the ankle line — posterior-tilt / swayback bias",
    normalRange: "± 2.5% of stature",
    interpretation:
      pelvisSev === 0
        ? "The greater trochanter tracks close to the lateral-ankle plumb line, suggesting a neutral sagittal pelvic position."
        : pelvisVal < 0
          ? "A posterior hip position relative to the ankle commonly accompanies anterior pelvic tilt with increased lumbar lordosis (Janda lower-crossed pattern)."
          : "An anterior hip drift commonly accompanies posterior pelvic tilt or a swayback pattern, loading the anterior hip structures and thoraco-lumbar junction.",
    citation: "Kendall et al., Muscles: Testing & Function, 5th ed., 2005; Page, Frank & Lardner, 2010",
    weight: 16,
    glyph: "offset",
    glyphT: Math.min(1, Math.abs(pelvisVal) / 9),
  };

  /* 6 · Anterior postural sway — ear over ankle */
  const swayVal = (fwd(ear.x, ankle.x) / height) * 100;
  const swaySev = sevFrom(swayVal, [4.5, 8, 11.5], false);
  const sway: Metric = {
    id: "sway",
    label: "Global Anterior Sway",
    unit: "% h",
    value: swayVal,
    display: `${signed(swayVal)}%`,
    severity: swaySev,
    direction: swaySev === 0 ? "Body mass centred over the feet" : "Line of gravity shifted anterior to the lateral malleolus",
    normalRange: "0 – 4.5% of stature",
    interpretation:
      swaySev === 0
        ? "The external auditory meatus sits close to the ankle plumb line — the classic 'line of gravity' alignment."
        : "A forward-shifted line of gravity demands continuous posterior-chain activity to resist the flexion moment at hip, knee and ankle.",
    citation: "Kendall et al., 2005; McGill, Low Back Disorders, 2015",
    weight: 14,
    glyph: "offset",
    glyphT: Math.min(1, Math.max(0, swayVal / 13)),
  };

  /* 7 · Knee sagittal angle — deviation from full extension */
  const kneeAngle = angleAtDeg(hip, knee, ankle);
  const kneeDev = 180 - kneeAngle;
  const kneeSev = sevFrom(kneeDev, [6, 10, 15]);
  const kneeXLine = lineXAtY(hip, ankle, knee.y);
  const kneeFlexed = fwd(knee.x, kneeXLine) > 0;
  const kneeSag: Metric = {
    id: "knee",
    label: "Knee Sagittal Position",
    unit: "°",
    value: kneeFlexed ? kneeDev : -kneeDev,
    display: `${fmt(kneeDev)}°`,
    severity: kneeSev,
    direction:
      kneeSev === 0 ? "Knee near full, relaxed extension" : kneeFlexed ? "Persistent soft/flexed-knee stance" : "Knee driven past neutral — hyperextension (genu recurvatum) pattern",
    normalRange: "< 6° from 180° line",
    interpretation:
      kneeSev === 0
        ? "The hip–knee–ankle chain is close to a straight weight-bearing line."
        : kneeFlexed
          ? "Standing with persistently flexed knees loads the patellofemoral joint and quadriceps continuously, and often pairs with anterior pelvic tilt."
          : "Locking the knees back (genu recurvatum) strains the posterior capsule and shifts load to the plantar-flexors and lumbar spine.",
    citation: "Neumann, 2017; Sahrmann, 2002",
    weight: 10,
    glyph: "angle",
    glyphT: Math.min(1, kneeDev / 16),
  };

  return [cva, fhd, shShift, trunk, pelvis, sway, kneeSag];
}

/* ================================================================== */
/*  FRONT VIEW — coronal plane                                        */
/* ================================================================== */

export function analyzeFront(pts: Pt[]): Metric[] {
  const shL = pts[LM.L_SHOULDER], shR = pts[LM.R_SHOULDER];
  const hipL = pts[LM.L_HIP], hipR = pts[LM.R_HIP];
  const kneeL = pts[LM.L_KNEE], kneeR = pts[LM.R_KNEE];
  const ankleL = pts[LM.L_ANKLE], ankleR = pts[LM.R_ANKLE];
  const earL = pts[LM.L_EAR], earR = pts[LM.R_EAR];

  const shW = Math.max(0.05, dist(shL, shR));
  const hipW = Math.max(0.05, dist(hipL, hipR));
  const midX = (shL.x + shR.x) / 2;
  const sideName = (screenLeftIsLow: boolean) => (screenLeftIsLow ? "screen-left" : "screen-right");

  /* 1 · Shoulder level */
  const shDropVal = (Math.abs(shL.y - shR.y) / shW) * 100;
  const shDropSev = sevFrom(shDropVal, [6, 10, 15]);
  const shLowLeft = shL.y > shR.y;
  const shDrop: Metric = {
    id: "shDrop",
    label: "Shoulder Level Asymmetry",
    unit: "% w",
    value: shLowLeft ? shDropVal : -shDropVal,
    display: `${fmt(shDropVal)}%`,
    severity: shDropSev,
    direction: shDropSev === 0 ? "Acromia level" : `${sideName(shLowLeft)} acromion sits lower`,
    normalRange: "< 6% of shoulder width",
    interpretation:
      shDropSev === 0
        ? "Acromion heights are symmetric within photographic tolerance."
        : "A lateral shoulder drop commonly reflects upper-trapezius/levator imbalance, scoliotic posture, or limb-length variation — worth a professional look if persistent or painful.",
    citation: "Kendall et al., 2005",
    weight: 20,
    glyph: "level",
    glyphT: Math.min(1, shDropVal / 16),
  };

  /* 2 · Head lateral tilt */
  const headTiltVal = (Math.abs(earL.y - earR.y) / shW) * 100;
  const headTiltSev = sevFrom(headTiltVal, [5, 8, 12]);
  const headLowLeft = earL.y > earR.y;
  const headTilt: Metric = {
    id: "headTilt",
    label: "Head Lateral Tilt",
    unit: "% w",
    value: headLowLeft ? headTiltVal : -headTiltVal,
    display: `${fmt(headTiltVal)}%`,
    severity: headTiltSev,
    direction: headTiltSev === 0 ? "Head level over shoulders" : `Head tilts toward the ${sideName(headLowLeft)}`,
    normalRange: "< 5% of shoulder width",
    interpretation:
      headTiltSev === 0
        ? "The inter-aural line is level with the horizon."
        : "Lateral head carriage suggests asymmetry of the lateral cervical flexors/extensors (upper trapezius, levator scapulae, scalenes) — frequently seen with desk and phone postures.",
    citation: "Page, Frank & Lardner, Janda Approach, 2010",
    weight: 12,
    glyph: "level",
    glyphT: Math.min(1, headTiltVal / 13),
  };

  /* 3 · Lateral trunk lean */
  const shMid = { x: (shL.x + shR.x) / 2, y: (shL.y + shR.y) / 2 };
  const hipMid = { x: (hipL.x + hipR.x) / 2, y: (hipL.y + hipR.y) / 2 };
  const trunkTiltVal = tiltSignedDeg(shMid, hipMid);
  const trunkTiltSev = sevFrom(trunkTiltVal, [4, 7, 10]);
  const trunkTilt: Metric = {
    id: "trunkTilt",
    label: "Lateral Trunk Lean",
    unit: "°",
    value: trunkTiltVal,
    display: `${signed(trunkTiltVal)}°`,
    severity: trunkTiltSev,
    direction:
      trunkTiltSev === 0 ? "Shoulders centred over pelvis" : `Shoulder line shifted toward the ${trunkTiltVal > 0 ? "screen-right" : "screen-left"}`,
    normalRange: "< 4° from vertical",
    interpretation:
      trunkTiltSev === 0
        ? "The C7 plumb line falls near mid-sacrum in the coronal plane."
        : "A lateral trunk shift loads the contralateral quadratus lumborum and hip abductors, and can be a functional scoliosis screen — persistent asymmetry deserves clinical assessment.",
    citation: "Sahrmann, 2002; Kendall et al., 2005",
    weight: 18,
    glyph: "angle",
    glyphT: Math.min(1, Math.abs(trunkTiltVal) / 11),
  };

  /* 4 · Hip level */
  const hipDropVal = (Math.abs(hipL.y - hipR.y) / hipW) * 100;
  const hipDropSev = sevFrom(hipDropVal, [5, 8, 12]);
  const hipLowLeft = hipL.y > hipR.y;
  const hipDrop: Metric = {
    id: "hipDrop",
    label: "Pelvic (Iliac Crest) Level",
    unit: "% w",
    value: hipLowLeft ? hipDropVal : -hipDropVal,
    display: `${fmt(hipDropVal)}%`,
    severity: hipDropSev,
    direction: hipDropSev === 0 ? "Iliac crests level" : `${sideName(hipLowLeft)} iliac crest sits lower`,
    normalRange: "< 5% of pelvic width",
    interpretation:
      hipDropSev === 0
        ? "The pelvic girdle is level in the coronal plane."
        : "An unlevel pelvis may reflect hip-abductor weakness (Trendelenburg pattern), leg-length difference, or habitual weight-shifting onto one limb.",
    citation: "Kendall et al., 2005; Neumann, 2017",
    weight: 14,
    glyph: "level",
    glyphT: Math.min(1, hipDropVal / 13),
  };

  /* 5 · Frontal knee alignment (worst side) */
  const kneeDevOf = (hip: Pt, knee: Pt, ankle: Pt) => {
    const angle = angleAtDeg(hip, knee, ankle);
    return 175 - angle; // physiologic alignment ≈ 175° in 2-D projection
  };
  const devL = kneeDevOf(hipL, kneeL, ankleL);
  const devR = kneeDevOf(hipR, kneeR, ankleR);
  const kneeMedial = (hip: Pt, knee: Pt, ankle: Pt) => {
    const xLine = lineXAtY(hip, ankle, knee.y);
    return Math.abs(knee.x - midX) < Math.abs(xLine - midX);
  };
  const worstR = Math.abs(devR) >= Math.abs(devL);
  const kneeVal = worstR ? devR : devL;
  const kneeFSev = sevFrom(kneeVal, [5, 8, 12]);
  const kneeF: Metric = {
    id: "kneeF",
    label: "Frontal Knee Alignment",
    unit: "°",
    value: kneeVal,
    display: `${signed(kneeVal)}°`,
    severity: kneeFSev,
    direction:
      kneeFSev === 0
        ? "Knees tracking over the foot line"
        : kneeMedial(worstR ? hipR : hipL, worstR ? kneeR : kneeL, worstR ? ankleR : ankleL)
          ? `Knee drifts inward — dynamic valgus pattern (${worstR ? "screen-right" : "screen-left"})`
          : `Knee bows outward — varus pattern (${worstR ? "screen-right" : "screen-left"})`,
    normalRange: "± 5° of neutral line",
    interpretation:
      kneeFSev === 0
        ? "The hip–knee–ankle angle sits within the expected physiologic range."
        : kneeVal > 0
          ? "Knee valgus alignment increases medial compartment and patellofemoral stress and is associated with weak hip abductors/external rotators."
          : "Varus alignment increases medial compartment compression; monitor during loading tasks.",
    citation: "Neumann, 2017; Page, Frank & Lardner, 2010",
    weight: 18,
    glyph: "angle",
    glyphT: Math.min(1, Math.abs(kneeVal) / 13),
  };

  /* 6 · Knee asymmetry */
  const kneeAsymVal = Math.abs(Math.abs(devL) - Math.abs(devR));
  const kneeAsymSev = sevFrom(kneeAsymVal, [4, 7, 10]);
  const kneeAsym: Metric = {
    id: "kneeAsym",
    label: "Left–Right Knee Asymmetry",
    unit: "°",
    value: kneeAsymVal,
    display: `${fmt(kneeAsymVal)}°`,
    severity: kneeAsymSev,
    direction: kneeAsymSev === 0 ? "Symmetric knee angles" : "Knee angles differ side-to-side",
    normalRange: "< 4° difference",
    interpretation:
      kneeAsymSev === 0
        ? "Both lower limbs present symmetric frontal-plane angles."
        : "Side-to-side knee asymmetry usually reflects unilateral hip weakness, stance habits, or an old injury — unilateral strengthening is typically indicated.",
    citation: "Sahrmann, 2002",
    weight: 18,
    glyph: "level",
    glyphT: Math.min(1, kneeAsymVal / 11),
  };

  return [shDrop, headTilt, trunkTilt, hipDrop, kneeF, kneeAsym];
}

/* ================================================================== */
/*  Report assembly                                                   */
/* ================================================================== */

const PENALTY: Record<Severity, number> = { 0: 0, 1: 0.35, 2: 0.68, 3: 1 };

export function gradeFor(index: number): GradeInfo {
  if (index >= 85) return { key: "excellent", label: "Well aligned", color: "var(--color-scan)" };
  if (index >= 70) return { key: "good", label: "Mild deviation", color: "var(--color-info)" };
  if (index >= 55) return { key: "fair", label: "Moderate deviation", color: "var(--color-warn)" };
  return { key: "poor", label: "Marked deviation", color: "var(--color-risk)" };
}

export function buildReport(view: ViewMode, pts: Pt[], confidence: number): ReportData {
  const metrics = view === "side" ? analyzeSide(pts) : analyzeFront(pts);
  const penalty = metrics.reduce((acc, m) => acc + m.weight * PENALTY[m.severity], 0);
  const index = Math.round(Math.min(100, Math.max(0, 100 - penalty)));
  const grade = gradeFor(index);

  const flagged = [...metrics].filter((m) => m.severity > 0).sort((a, b) => b.severity - a.severity || b.weight - a.weight);
  const summary: string[] = [];
  if (flagged.length === 0) {
    summary.push("All measured segments fall within published photographic norms. Maintain your current activity levels and re-screen periodically.");
  } else {
    const top = flagged.slice(0, 3);
    summary.push(
      `Primary finding: ${top[0].label.toLowerCase()} at ${top[0].display} — ${SEVERITY_LABEL[top[0].severity].toLowerCase()} (${top[0].direction.toLowerCase()}).`
    );
    if (top[1]) summary.push(`Secondary: ${top[1].label.toLowerCase()} at ${top[1].display} — ${SEVERITY_LABEL[top[1].severity].toLowerCase()}.`);
    const n = flagged.length;
    summary.push(`${n} of ${metrics.length} measures deviate from reference ranges; the prescription below targets the highest-weighted findings first.`);
  }

  return { view, ts: Date.now(), metrics, index, grade, summary, confidence };
}

/** EMA smoothing for live telemetry */
export function smoothMetrics(prev: Metric[] | null, next: Metric[], alpha = 0.35): Metric[] {
  if (!prev || prev.length !== next.length) return next;
  return next.map((m, i) => {
    const p = prev[i];
    if (p.id !== m.id) return m;
    const value = p.value * (1 - alpha) + m.value * alpha;
    return { ...m, value, display: m.display }; // keep crisp display from the latest frame
  });
}
