import { HSLColorRange, NumberRange } from "../utils/types";

/**
 * Generate a random floating point number between 0 and 1.
 */
function float(): number;
/**
 * Generate a random floating point number between `min` and `max`.
 * @param min The inclusive lower boundary.
 * @param maxThe inclusive upper boundary.
 */
function float(min: number, max: number): number;
function float(range: NumberRange): number;
function float(minOrRange?: number | NumberRange, max?: number): number {
  const seed = Math.random();
  let min: number, maxVal: number;
  if (typeof minOrRange === "object") {
    ({ min, max: maxVal } = minOrRange);
  } else {
    min = minOrRange ?? 0;
    maxVal = max ?? 1;
  }
  if (min > maxVal) {
    throw new Error("Cannot generate float, max must be greater than min");
  }
  return seed * (maxVal - min) + min;
}

/**
 * Generate a random boolean value.
 */
function bool() {
  return Math.random() > 0.5;
}

/**
 * Generates a random bit (1 or 0).
 */
function bit() {
  return Number(bool());
}

/**
 * Generates a random floating-point number in the range [-range/2, range/2).
 * The distribution is centered around 0.
 *
 * @param range The total range of possible values. Must be positive.
 */
function balancedFloat(range: number) {
  if (range <= 0) {
    throw new Error(
      "Cannot generate balanced float. Range must be greater than 0"
    );
  }
  return Math.random() * range - range / 2;
}

/**
 * Generates a random number between `MIN_SAFE_INTEGER and `MAX_SAFE_INTEGER`
 */
function int(): number;
/**
 * Generates a random number between `min` and `max`.
 */
function int(min: number, max: number): number;
function int(
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  if (min > max) {
    throw new Error("Cannot generate int, max must be greater than min");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random color presented as an HSL string
 */
function hsl({ h: _h, s: _s, l: _l }: HSLColorRange) {
  const h = float(_h.min, _h.max);
  const s = float(_s.min, _s.max);
  const l = float(_l.min, _l.max);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function item<T>(...items: Array<T>): T {
  return items[int(0, items.length - 1)];
}

export default {
  float,
  bool,
  bit,
  balancedFloat,
  int,
  hsl,
  item,
};
