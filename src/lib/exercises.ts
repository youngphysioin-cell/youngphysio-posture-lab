import type { ReportData, Metric } from "./posture";

export type ExTag = "mobility" | "activation" | "strength";

export interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  sets: number;
  reps: string;
  hold: string;
  tag: ExTag;
  steps: string[];
  why: string;
  caution?: string;
}

export const EXERCISES: Record<string, Exercise> = {
  chinTuck: {
    id: "chinTuck",
    name: "Chin Tucks (Craniocervical Flexion)",
    target: "Deep cervical flexors · longus colli/capitis",
    equipment: "None / wall",
    sets: 3,
    reps: "10 reps",
    hold: "5 s hold",
    tag: "activation",
    steps: [
      "Sit or stand tall; keep the jaw relaxed and eyes horizontal.",
      "Glide the head straight back as if making a 'double chin' — do not tip it up or down.",
      "Hold 5 s, feeling length at the base of the skull, then release slowly.",
      "Progress by doing it against a wall with the back of the head touching.",
    ],
    why: "Trains the deep cervical flexors that are typically weak and inhibited in forward head posture, restoring the craniovertebral angle.",
    caution: "Stop if you feel dizziness or sharp pain; the movement should be a glide, not a forceful push.",
  },
  pecStretch: {
    id: "pecStretch",
    name: "Doorway Pectoral Stretch",
    target: "Pectoralis major/minor",
    equipment: "Doorframe",
    sets: 3,
    reps: "1 × each side",
    hold: "30–45 s hold",
    tag: "mobility",
    steps: [
      "Forearm on the doorframe, elbow at ~90°, shoulder height.",
      "Step through gently until a stretch is felt across the chest — not the shoulder joint.",
      "Breathe slowly; ease 1–2 mm deeper on each exhale.",
      "Repeat with the elbow slightly higher to bias pec minor.",
    ],
    why: "Shortened pecs pull the shoulders into protraction; restoring length lets the scapulae sit back over the ribcage.",
  },
  wallAngel: {
    id: "wallAngel",
    name: "Wall Angels",
    target: "Lower trapezius · serratus anterior · thoracic extensors",
    equipment: "Wall",
    sets: 2,
    reps: "10 slow reps",
    hold: "—",
    tag: "strength",
    steps: [
      "Back, pelvis and shoulder blades against a wall; ribs down, no arching.",
      "Arms in a 'cactus' — elbows and wrists touching the wall.",
      "Slide the arms overhead as far as contact allows, keeping the low back quiet.",
      "Lower over 3 seconds. If contact is lost, reduce range, not quality.",
    ],
    why: "Integrates thoracic extension with scapular upward rotation — the exact pattern that reverses rounded shoulders.",
  },
  thoracicExt: {
    id: "thoracicExt",
    name: "Foam-Roller Thoracic Extensions",
    target: "Thoracic spine mobility",
    equipment: "Foam roller",
    sets: 2,
    reps: "8 reps per level",
    hold: "3 s at end range",
    tag: "mobility",
    steps: [
      "Roller horizontal under the upper back; hands support the head.",
      "Exhale and extend over the roller, looking slightly up — motion from the mid-back, not the neck.",
      "Hold 3 s, return, move the roller one level down and repeat.",
      "Keep hips heavy; do not push into the lumbar spine.",
    ],
    why: "Stiff mid-back extension forces the head and shoulders to compensate forward; mobilising T1–T8 unlocks upright alignment.",
    caution: "Skip the lower ribs/lumbar area; avoid if you have an acute rib or thoracic injury.",
  },
  pullApart: {
    id: "pullApart",
    name: "Band Pull-Aparts",
    target: "Rhomboids · mid-trapezius · rear deltoid",
    equipment: "Light resistance band",
    sets: 3,
    reps: "15 reps",
    hold: "1 s squeeze",
    tag: "activation",
    steps: [
      "Hold the band at shoulder width, arms long in front of you.",
      "Draw the shoulder blades back and apart, opening the band to the chest.",
      "Pause 1 s with the shoulder blades 'in the back pockets'.",
      "Return slowly — the eccentric controls the posture win.",
    ],
    why: "High-rep, low-load retraction work wakes up the scapular retractors that oppose rounded-shoulder posture.",
  },
  proneY: {
    id: "proneY",
    name: "Prone Y–T Raises",
    target: "Lower/mid trapezius · thoracic extensors",
    equipment: "Mat",
    sets: 2,
    reps: "10 Y + 10 T",
    hold: "2 s hold",
    tag: "strength",
    steps: [
      "Lie face down, forehead on a folded towel, ribs off the floor soft.",
      "Y: thumbs to the ceiling, lift arms at ~120° leading with the shoulder blades.",
      "T: arms out wide, squeeze shoulder blades together without shrugging.",
      "Hold 2 s at the top; lower slowly. Neck stays long and neutral.",
    ],
    why: "Gravity-loaded scapular depression/retraction directly counters the upper-crossed (rounded shoulder) pattern.",
  },
  hipFlexorStretch: {
    id: "hipFlexorStretch",
    name: "Half-Kneeling Hip-Flexor Stretch",
    target: "Iliopsoas · rectus femoris",
    equipment: "Mat / cushion",
    sets: 3,
    reps: "1 × each side",
    hold: "30–45 s hold",
    tag: "mobility",
    steps: [
      "Half-kneel: front foot flat, back knee under the hip on a cushion.",
      "Tuck the pelvis (flatten the low back) before moving — this is the key.",
      "Shift weight slightly forward until a stretch is felt at the front of the back hip.",
      "Keep ribs stacked over the pelvis; no arching.",
    ],
    why: "Tight hip flexors drag the pelvis into anterior tilt; lengthening them lets the pelvis return to neutral.",
  },
  pelvicTilt: {
    id: "pelvicTilt",
    name: "Supine Pelvic Tilts",
    target: "Pelvic control · transversus abdominis",
    equipment: "Mat",
    sets: 2,
    reps: "12 reps",
    hold: "3 s hold",
    tag: "activation",
    steps: [
      "Lie on your back, knees bent, feet hip-width.",
      "Gently rock the pelvis to flatten the low back into the floor, then to a small arch.",
      "Find the comfortable midpoint — that is your neutral pelvis.",
      "Finish with 3 slow tilts to neutral, holding 3 s each.",
    ],
    why: "Restores the feel of neutral pelvis so you can find it standing, not just lying down.",
  },
  gluteBridge: {
    id: "gluteBridge",
    name: "Glute Bridges",
    target: "Gluteus maximus · hamstrings",
    equipment: "Mat",
    sets: 3,
    reps: "12 reps",
    hold: "2 s at top",
    tag: "strength",
    steps: [
      "Lie on your back, knees bent, feet flat and hip-width.",
      "Drive through the heels and lift hips until knees–hips–shoulders form one line.",
      "Squeeze the glutes 2 s at the top without overarching the low back.",
      "Lower one vertebra at a time.",
    ],
    why: "Glute strength posteriorly rotates the pelvis and unloads the lumbar spine — the strength half of fixing anterior tilt.",
  },
  deadBug: {
    id: "deadBug",
    name: "Dead Bugs",
    target: "Anterior core · rib-over-pelvis control",
    equipment: "Mat",
    sets: 3,
    reps: "8 × each side",
    hold: "—",
    tag: "activation",
    steps: [
      "Lie on your back, arms to the ceiling, knees over hips at 90°.",
      "Press the low back gently down; exhale and lower opposite arm/leg toward the floor.",
      "Stop the instant the back wants to lift — that is your current range.",
      "Return and switch sides, keeping ribs stacked over the pelvis.",
    ],
    why: "Teaches the core to hold the pelvis neutral while the limbs move — the pattern behind every good standing posture.",
  },
  pressUp: {
    id: "pressUp",
    name: "Prone Press-Ups (McKenzie Extension)",
    target: "Lumbar extensors · posterior pelvic bias",
    equipment: "Mat",
    sets: 3,
    reps: "10 reps",
    hold: "1–2 s at top",
    tag: "mobility",
    steps: [
      "Lie prone, hands under the shoulders, hips and legs fully relaxed.",
      "Press the chest up with the arms while the pelvis stays heavy on the floor.",
      "Exhale at the top; let the low back relax into gentle extension.",
      "Lower slowly. Range should feel comfortable, never pinching.",
    ],
    why: "Restores lumbar extension for posterior-tilt / swayback patterns that sit with a flattened low back.",
    caution: "If extension reproduces leg symptoms, stop and seek clinical advice.",
  },
  hipMarch: {
    id: "hipMarch",
    name: "Supine Hip Marches",
    target: "Iliopsoas strength · pelvic stability",
    equipment: "Mat",
    sets: 3,
    reps: "10 × each side",
    hold: "—",
    tag: "strength",
    steps: [
      "Lie on your back in neutral pelvis, knees bent.",
      "Lift one knee to 90° without letting the pelvis rock side to side.",
      "Lower with control; keep the opposite hip heavy.",
      "Progress by holding 3 s at the top.",
    ],
    why: "Rebuilds hip-flexor strength for posterior-tilt patterns where the front of the hip is long but weak.",
  },
  hamstringStretch: {
    id: "hamstringStretch",
    name: "Strap Hamstring Stretch",
    target: "Hamstrings",
    equipment: "Strap / towel",
    sets: 3,
    reps: "1 × each side",
    hold: "30 s hold",
    tag: "mobility",
    steps: [
      "Lie on your back, strap around the foot of the stretching leg.",
      "Raise the leg until a mild pull is felt behind the knee/thigh.",
      "Keep the other leg long and the pelvis level.",
      "Breathe; ease deeper on the exhale without bouncing.",
    ],
    why: "Short hamstrings can tether the pelvis into posterior tilt; lengthening them frees neutral pelvic motion.",
  },
  sidePlank: {
    id: "sidePlank",
    name: "Side Planks",
    target: "Obliques · quadratus lumborum · gluteus medius",
    equipment: "Mat",
    sets: 3,
    reps: "1 × each side",
    hold: "20–30 s",
    tag: "strength",
    steps: [
      "Elbow under the shoulder, knees bent (easier) or legs straight.",
      "Lift the hips into one straight line from shoulder to knee/ankle.",
      "Push the floor away; do not let the top hip roll back.",
      "Breathe steadily; drop before the hips sag.",
    ],
    why: "Lateral-core capacity corrects trunk lean and pelvic drop; work the weaker side first and match reps.",
  },
  suitcaseCarry: {
    id: "suitcaseCarry",
    name: "Suitcase Carries",
    target: "Anti-lateral-flexion core · grip",
    equipment: "Dumbbell / kettlebell",
    sets: 3,
    reps: "30 m each side",
    hold: "—",
    tag: "strength",
    steps: [
      "Hold a weight in one hand, stand tall as if balancing a glass on your head.",
      "Walk slowly, refusing to let the weight drag you sideways.",
      "Keep the shoulders level and the stride quiet.",
      "Match distance both sides; add load before adding distance.",
    ],
    why: "Trains the body to resist lateral collapse under load — the functional version of a level shoulder line.",
  },
  neckSideStretch: {
    id: "neckSideStretch",
    name: "Upper-Trap / Levator Stretch",
    target: "Upper trapezius · levator scapulae",
    equipment: "None",
    sets: 2,
    reps: "1 × each side",
    hold: "30 s hold",
    tag: "mobility",
    steps: [
      "Sit tall, anchor one hand under the thigh or on the chair.",
      "Tip the ear toward the opposite shoulder — gentle overpressure only if comfortable.",
      "For levator bias, look down toward the opposite armpit.",
      "Breathe slow; the stretch should feel like release, not strain.",
    ],
    why: "Unloads the overactive side in lateral head tilt and shoulder elevation asymmetry.",
  },
  clamshell: {
    id: "clamshell",
    name: "Clamshells",
    target: "Gluteus medius · deep external rotators",
    equipment: "Mat / mini band",
    sets: 3,
    reps: "12 × each side",
    hold: "1 s at top",
    tag: "activation",
    steps: [
      "Side-lying, hips and knees bent ~45°, heels in line with the spine.",
      "Keep the pelvis stacked vertical and lift the top knee like a clam opening.",
      "Pause 1 s; do not roll the pelvis backward to fake range.",
      "Add a mini band above the knees when 12 reps feel easy.",
    ],
    why: "Hip external-rotator strength is the standard corrective for dynamic knee valgus.",
  },
  lateralWalk: {
    id: "lateralWalk",
    name: "Banded Lateral Walks",
    target: "Gluteus medius/minimus",
    equipment: "Mini band",
    sets: 3,
    reps: "12 steps each way",
    hold: "—",
    tag: "strength",
    steps: [
      "Band around the ankles (harder) or knees, soft athletic stance.",
      "Step sideways, keeping tension on the band and feet pointing forward.",
      "Do not let the knees cave inward between steps.",
      "Stay low and quiet; quality over speed.",
    ],
    why: "Transfers hip-abductor strength to weight-bearing — where knee valgus actually happens.",
  },
  squatToBox: {
    id: "squatToBox",
    name: "Squat-to-Box (Knee-Over-Toe)",
    target: "Quadriceps control · frontal-plane knee tracking",
    equipment: "Chair / box",
    sets: 3,
    reps: "10 reps",
    hold: "1 s pause",
    tag: "strength",
    steps: [
      "Stand in front of a chair, feet hip-width, toes slightly out.",
      "Sit back and down to lightly touch the box — knees track over the second toe.",
      "Pause 1 s, then stand by pressing the floor away.",
      "If knees drift in, slow down and reduce depth.",
    ],
    why: "Re-patterns the squat with correct knee tracking and builds end-range knee control for both flexed-knee stance and valgus.",
  },
  tke: {
    id: "tke",
    name: "Terminal Knee Extensions (TKE)",
    target: "Vastus medialis · knee extension control",
    equipment: "Band",
    sets: 3,
    reps: "15 × each side",
    hold: "2 s at lock",
    tag: "activation",
    steps: [
      "Anchor a band behind the knee, knee softly bent ~20°.",
      "Straighten the knee fully against the band, squeezing the thigh.",
      "Hold 2 s at full extension; keep the hip tall, do not lean back.",
      "Return slowly under control.",
    ],
    why: "Restores active end-range knee extension for people who stand with persistently soft knees.",
  },
};

/* ---------------- prescription builder ---------------------------- */

export interface RxItem {
  ex: Exercise;
  reasons: string[];
}
export interface RxGroup {
  key: ExTag;
  title: string;
  note: string;
  items: RxItem[];
}

export interface Prescription {
  groups: RxGroup[];
  schedule: { day: string; focus: string; detail: string; tone: "work" | "move" | "rest" }[];
  rules: string[];
  references: string[];
  totalMinutes: number;
}

const labelOf = (id: string) => id; // placeholder for mapping metric → short label

function findingLabel(m: Metric): string {
  const map: Record<string, string> = {
    cva: "forward head posture",
    fhd: "anterior head translation",
    shShift: "rounded-shoulder posture",
    trunk: "trunk sagittal lean",
    pelvis: m.value < 0 ? "anterior pelvic tilt bias" : "posterior pelvic tilt / swayback bias",
    sway: "anterior postural sway",
    knee: m.value > 0 ? "flexed-knee stance" : "knee hyperextension pattern",
    shDrop: "shoulder-level asymmetry",
    headTilt: "lateral head tilt",
    trunkTilt: "lateral trunk lean",
    hipDrop: "pelvic drop asymmetry",
    kneeF: "frontal knee malalignment",
    kneeAsym: "knee asymmetry",
  };
  return map[m.id] ?? labelOf(m.id);
}

export function buildPrescription(report: ReportData): Prescription {
  const flagged = report.metrics.filter((m) => m.severity > 0).sort((a, b) => b.severity - a.severity);
  const pick: Record<string, string[]> = {}; // exerciseId -> reasons
  const add = (exId: string, reason: string) => {
    (pick[exId] ||= []).push(reason);
  };

  const has = (id: string) => flagged.some((m) => m.id === id);
  const pelvis = report.metrics.find((m) => m.id === "pelvis");
  const kneeSag = report.metrics.find((m) => m.id === "knee");
  const kneeF = report.metrics.find((m) => m.id === "kneeF");

  if (has("cva") || has("fhd")) {
    add("chinTuck", "forward head posture (CVA / FHD)");
    add("pecStretch", "shortened anterior chest accompanying forward head");
  }
  if (has("shShift") || has("cva") || has("sway")) {
    add("wallAngel", "rounded shoulders / upper-crossed pattern");
    add("thoracicExt", "stiff thoracic extension driving shoulder rounding");
  }
  if (has("shShift")) {
    add("pullApart", "weak scapular retractors");
    add("proneY", "lower-trapezius weakness in rounded-shoulder posture");
  }
  if (pelvis && pelvis.severity > 0 && pelvis.value < 0) {
    add("hipFlexorStretch", "tight hip flexors in anterior pelvic tilt");
    add("pelvicTilt", "re-learn neutral pelvis");
    add("gluteBridge", "gluteal weakness in anterior tilt (lower-crossed pattern)");
    add("deadBug", "anterior core control for pelvic stability");
  }
  if (pelvis && pelvis.severity > 0 && pelvis.value >= 0) {
    add("pressUp", "restore lumbar extension in posterior tilt / swayback");
    add("hipMarch", "weak hip flexors in posterior tilt");
    add("hamstringStretch", "hamstring shortness tethering the pelvis");
  }
  if (has("sway")) {
    add("deadBug", "core control to centre the line of gravity");
  }
  if (has("shDrop") || has("trunkTilt") || has("hipDrop")) {
    add("sidePlank", "lateral core weakness behind trunk lean / pelvic drop");
    add("suitcaseCarry", "anti-lateral control for shoulder and trunk asymmetry");
  }
  if (has("headTilt") || has("shDrop")) {
    add("neckSideStretch", "overactive upper trapezius on the elevated side");
  }
  if ((kneeF && kneeF.severity > 0) || has("kneeAsym")) {
    add("clamshell", "hip external-rotator weakness in knee valgus");
    add("lateralWalk", "weight-bearing hip-abductor strength");
    add("squatToBox", "re-pattern knee tracking under load");
  }
  if (kneeSag && kneeSag.severity > 0) {
    if (kneeSag.value > 0) add("tke", "restore active knee extension");
    else add("squatToBox", "control end-range knee position");
    add("gluteBridge", "posterior-chain support for the knee");
  }

  /* nothing flagged → maintenance program */
  if (Object.keys(pick).length === 0) {
    add("wallAngel", "maintenance of thoracic and scapular control");
    add("deadBug", "maintenance of pelvic-neutral core control");
    add("squatToBox", "maintenance of lower-limb tracking");
  }

  const groups: RxGroup[] = [
    { key: "mobility", title: "Release & Mobilise", note: "Perform daily, ideally after a warm shower or brief walk. Discomfort should stay ≤ 3/10 and ease as you hold.", items: [] },
    { key: "activation", title: "Activate & Control", note: "Low-load, high-attention work. Speed is the enemy — every rep should feel precise.", items: [] },
    { key: "strength", title: "Strengthen & Integrate", note: "Alternate days (e.g. Mon / Wed / Fri). Add ~10% volume or load every 2 weeks while form stays clean.", items: [] },
  ];

  const order = ["chinTuck", "pelvicTilt", "pullApart", "deadBug", "clamshell", "tke", "wallAngel", "proneY", "gluteBridge", "sidePlank", "suitcaseCarry", "hipMarch", "lateralWalk", "squatToBox", "thoracicExt", "pecStretch", "hipFlexorStretch", "hamstringStretch", "pressUp", "neckSideStretch"];
  for (const id of order) {
    if (!pick[id]) continue;
    const ex = EXERCISES[id];
    groups.find((g) => g.key === ex.tag)!.items.push({ ex, reasons: [...new Set(pick[id])] });
  }

  const schedule: Prescription["schedule"] = [
    { day: "MON", focus: "Strength A", detail: "Activate + Strengthen blocks, full circuit", tone: "work" },
    { day: "TUE", focus: "Mobility", detail: "Release block + 20–30 min brisk walk", tone: "move" },
    { day: "WED", focus: "Strength B", detail: "Activate + Strengthen, weaker side first", tone: "work" },
    { day: "THU", focus: "Mobility", detail: "Release block + posture resets hourly", tone: "move" },
    { day: "FRI", focus: "Strength A", detail: "Activate + Strengthen, progress load if clean", tone: "work" },
    { day: "SAT", focus: "Move", detail: "Longer walk / hike / swim, keep it easy", tone: "move" },
    { day: "SUN", focus: "Reset", detail: "10 min mobility + breathing, re-scan weekly", tone: "rest" },
  ];

  const rules = [
    "Pain rule: working discomfort ≤ 3/10 that settles after the set is acceptable. Sharp, radiating or worsening pain = stop and seek clinical advice.",
    "Frequency first: a daily 10-minute mobility block beats a weekly heroic session.",
    "Progress every 2 weeks: add 1 set, ~10% load or 5 s holds — one variable at a time.",
    "Workstation rhythm: change position at least every 30 minutes (the 20-8-2 rule — 20 min sit, 8 min stand, 2 min move).",
    "Re-screen in 4 weeks under identical camera conditions to track your Posture Index trend.",
  ];

  const references = [
    "Salah WM, et al. The relationship between forward head posture and postural control. Gait & Posture. 2016;45:162–166.",
    "Singla D, Veqar Z. Association between forward head, rounded shoulders, and increased thoracic kyphosis: a review of the literature. J Chiropr Med. 2017;16(3):220–229.",
    "Kendall FP, McCreary EK, Provance PG, et al. Muscles: Testing and Function with Posture and Pain. 5th ed. Lippincott Williams & Wilkins; 2005.",
    "Page P, Frank CC, Lardner R. Assessment and Treatment of Muscle Imbalance: The Janda Approach. Human Kinetics; 2010.",
    "Sahrmann S. Diagnosis and Treatment of Movement Impairment Syndromes. Mosby; 2002.",
    "McGill SM. Low Back Disorders: Evidence-Based Prevention and Rehabilitation. 3rd ed. Human Kinetics; 2015.",
    "Neumann DA. Kinesiology of the Musculoskeletal System. 3rd ed. Elsevier; 2017.",
  ];

  const mobility = groups[0].items.length;
  const actStr = groups[1].items.length + groups[2].items.length;
  const totalMinutes = mobility * 2 + actStr * 3 + 5;

  return { groups: groups.filter((g) => g.items.length > 0), schedule, rules, references, totalMinutes };
}

export function findingLabelFor(m: Metric): string {
  return findingLabel(m);
}
