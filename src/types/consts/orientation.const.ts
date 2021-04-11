export enum ORIENTATION {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum DIRECTION {
  T2B = 'T2B', // top to bottom
  B2T = 'B2T', // bottom to top
  L2R = 'L2R', // left to right
  R2L = 'R2L' // right to left
}

export type ElementOrientation = ORIENTATION.HORIZONTAL
  | ORIENTATION.VERTICAL;

export type ElementDirection = DIRECTION.T2B
  | DIRECTION.B2T
  | DIRECTION.L2R
  | DIRECTION.R2L;
