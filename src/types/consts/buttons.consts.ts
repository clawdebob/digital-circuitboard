export enum BUTTON_TYPES_ENUM {
  DISABLED = 'disabled',
  REGULAR = 'regular',
  PRIMARY = 'primary',
}

export type ButtonType = BUTTON_TYPES_ENUM.DISABLED
  | BUTTON_TYPES_ENUM.REGULAR
  | BUTTON_TYPES_ENUM.PRIMARY;
