//import { FPMS } from "./types";

export function createItem(
  _canvasWidth: number,
  _canvasHeight: number
): unknown {
  const item: unknown = {};
  return item;
}

export function updateItem(
  _item: unknown,
  _time: number,
  _delta: number,
  _xySpeed: number,
  _canvasWidth: number,
  _canvasHeight: number,
  _zDepth: number
) {
  // const _speedFactor = delta / FPMS; // Normalize to 60 FPS
}

export function drawItem(
  _item: unknown,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
) {
  ctx.beginPath();
  // TODO: Draw the item
  ctx.closePath();
}

export function createItems({
  width,
  height,
  density,
}: {
  width: number;
  height: number;
  density: number;
}) {
  const area = width * height;
  const count = Math.max(10, area / 20000) * density;
  return Array.from({ length: count }, () => createItem(width, height));
}
