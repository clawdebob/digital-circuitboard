export enum ORIENTATION {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum DIRECTION {
  T2B = 'T2B',
  B2T = 'B2T',
  L2R = 'L2R',
  R2L = 'R2L'
}

export type ElementOrientation = ORIENTATION.HORIZONTAL
  | ORIENTATION.VERTICAL;

export type ElementDirection = DIRECTION.T2B
  | DIRECTION.B2T
  | DIRECTION.L2R
  | DIRECTION.R2L;
