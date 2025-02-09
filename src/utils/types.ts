export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

export const HSLKeys = ["h", "s", "l"] as const;
export type HSLKey = (typeof HSLKeys)[number];

export type HSLColor = Record<HSLKey, number>;
export type HSLColorRange = Record<HSLKey, NumberRange>;

export interface NumberRange {
  min: number;
  max: number;
}
