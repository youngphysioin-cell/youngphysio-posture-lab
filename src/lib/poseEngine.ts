import { FilesetResolver, PoseLandmarker, type NormalizedLandmark } from "@mediapipe/tasks-vision";
import { LM } from "./posture";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

export const DEMO_IMAGES = {
  side: "https://image.qwenlm.ai/generated-images/a576870b-f30c-4868-a72b-78fe54c39cb1/_result.png",
  front: "https://image.qwenlm.ai/generated-images/509101ef-6bb6-44b5-bb77-b1a1a51c0b52/_result.png",
} as const;

let videoLm: PoseLandmarker | null = null;
let imageLm: PoseLandmarker | null = null;

async function fileset() {
  return FilesetResolver.forVisionTasks(WASM_URL);
}

export async function getVideoLandmarker(): Promise<PoseLandmarker> {
  if (!videoLm) {
    const fs = await fileset();
    videoLm = await PoseLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  }
  return videoLm;
}

export async function getImageLandmarker(): Promise<PoseLandmarker> {
  if (!imageLm) {
    const fs = await fileset();
    imageLm = await PoseLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: "IMAGE",
      numPoses: 1,
    });
  }
  return imageLm;
}

/* ---------------- rendering --------------------------------------- */

export const POSE_LINKS: [number, number][] = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24],
  [23, 25], [25, 27], [24, 26], [26, 28],
  [27, 29], [28, 30], [29, 31], [30, 32], [15, 17], [16, 18], [15, 21], [16, 22],
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
];

const KEY_POINTS = new Set([7, 8, 11, 12, 23, 24, 25, 26, 27, 28, 0]);

export function avgVisibility(lms: NormalizedLandmark[]): number {
  if (!lms.length) return 0;
  const idxs = [7, 8, 11, 12, 23, 24, 25, 26, 27, 28];
  const s = idxs.reduce((a, i) => a + (lms[i]?.visibility ?? 0), 0);
  return s / idxs.length;
}

function project(p: NormalizedLandmark, w: number, h: number, mirror: boolean) {
  const x = mirror ? 1 - p.x : p.x;
  return { x: x * w, y: p.y * h };
}

export function drawPose(
  ctx: CanvasRenderingContext2D,
  lms: NormalizedLandmark[],
  w: number,
  h: number,
  opts: { mirror?: boolean; plumb?: boolean } = {}
) {
  const { mirror = false, plumb = true } = opts;
  ctx.save();
  ctx.lineWidth = Math.max(2, w / 420);
  ctx.lineCap = "round";

  if (plumb) {
    const ankleL = lms[LM.L_ANKLE], ankleR = lms[LM.R_ANKLE];
    if (ankleL && ankleR) {
      const ax = (((mirror ? 1 - ankleL.x : ankleL.x) + (mirror ? 1 - ankleR.x : ankleR.x)) / 2) * w;
      ctx.strokeStyle = "rgba(176,138,80,0.5)";
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(ax, 0);
      ctx.lineTo(ax, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* bones */
  ctx.strokeStyle = "rgba(31,45,38,0.82)";
  ctx.beginPath();
  for (const [a, b] of POSE_LINKS) {
    const pa = lms[a], pb = lms[b];
    if (!pa || !pb) continue;
    if ((pa.visibility ?? 0) < 0.4 || (pb.visibility ?? 0) < 0.4) continue;
    const A = project(pa, w, h, mirror), B = project(pb, w, h, mirror);
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
  }
  ctx.stroke();

  /* joints */
  for (let i = 0; i < lms.length; i++) {
    const p = lms[i];
    if (!KEY_POINTS.has(i)) continue;
    if ((p.visibility ?? 0) < 0.4) continue;
    const P = project(p, w, h, mirror);
    ctx.beginPath();
    ctx.fillStyle = i === 0 ? "#B08A50" : "#FFFFFF";
    ctx.strokeStyle = i === 0 ? "#B08A50" : "#2E4238";
    ctx.arc(P.x, P.y, Math.max(3, w / 210), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------------- offline fallback (synthetic subjects) ----------- */
/* Plausible landmark sets used when the WASM runtime or model CDN is
   unreachable, so the full pipeline remains demonstrable offline.    */

function blank(): NormalizedLandmark[] {
  return Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 0 }));
}

export function fallbackLandmarks(view: "side" | "front"): NormalizedLandmark[] {
  const l = blank();
  const put = (i: number, x: number, y: number) => (l[i] = { x, y, z: 0, visibility: 0.98 });

  if (view === "side") {
    put(LM.NOSE, 0.38, 0.175);
    put(LM.L_EAR, 0.407, 0.189);
    put(LM.R_EAR, 0.43, 0.189);
    put(LM.L_SHOULDER, 0.485, 0.27);
    put(LM.R_SHOULDER, 0.51, 0.27);
    put(13, 0.47, 0.385); put(14, 0.495, 0.385);
    put(15, 0.465, 0.49); put(16, 0.49, 0.49);
    put(LM.L_HIP, 0.512, 0.5);
    put(LM.R_HIP, 0.535, 0.5);
    put(LM.L_KNEE, 0.505, 0.72);
    put(LM.R_KNEE, 0.528, 0.72);
    put(LM.L_ANKLE, 0.49, 0.915);
    put(LM.R_ANKLE, 0.513, 0.915);
    put(29, 0.52, 0.93); put(30, 0.543, 0.93);
    put(31, 0.455, 0.93); put(32, 0.478, 0.93);
  } else {
    put(LM.NOSE, 0.5, 0.152);
    put(LM.L_EAR, 0.47, 0.17);
    put(LM.R_EAR, 0.53, 0.178);
    put(LM.L_SHOULDER, 0.405, 0.28);
    put(LM.R_SHOULDER, 0.605, 0.298);
    put(13, 0.385, 0.395); put(14, 0.625, 0.413);
    put(15, 0.375, 0.5); put(16, 0.635, 0.518);
    put(LM.L_HIP, 0.445, 0.5);
    put(LM.R_HIP, 0.555, 0.506);
    put(LM.L_KNEE, 0.4505, 0.715);
    put(LM.R_KNEE, 0.52, 0.715);
    put(LM.L_ANKLE, 0.45, 0.915);
    put(LM.R_ANKLE, 0.54, 0.915);
    put(29, 0.445, 0.93); put(30, 0.545, 0.93);
    put(31, 0.46, 0.93); put(32, 0.55, 0.93);
  }
  return l;
}
