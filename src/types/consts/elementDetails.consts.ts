import * as _ from 'lodash';
import {Signal} from '../../elements/Pin/pin';

export type ElementProperties = {
  fill?: string,
  inContacts?: number,
  outContacts?: number,
  initialSignal?: Signal,
  fontSize?: number,
  signal?: Signal,
  labelText?: string,
};

export type ElementProperty = keyof ElementProperties;

export enum DETAILS_INPUT_TYPES_ENUM {
  TEXT = 'text',
  SELECT = 'select',
  COLOR = 'color'
}

export type DetailsInputType = DETAILS_INPUT_TYPES_ENUM.TEXT
  | DETAILS_INPUT_TYPES_ENUM.SELECT
  | DETAILS_INPUT_TYPES_ENUM.COLOR;

export enum DETAILS_VALUE_TYPES_ENUM {
  PIN_RANGE = 'pin-range',
  SIGNAL = 'signal',
  ANSWER = 'answer',
  FONT_SIZE = 'font-size'
}

export type DetailsValueType = DETAILS_VALUE_TYPES_ENUM.PIN_RANGE
  | DETAILS_VALUE_TYPES_ENUM.SIGNAL
  | DETAILS_VALUE_TYPES_ENUM.ANSWER
  | DETAILS_VALUE_TYPES_ENUM.FONT_SIZE;

export interface ElementPropertyDetail {
  name: ElementProperty;
  label: string;
  inputType: DetailsInputType;
  valueType?: DetailsValueType;
}

export const DETAIL_PRESETS_ARRAY: Array<ElementPropertyDetail> = [
  {
    name: 'fill',
    label: 'color',
    inputType: DETAILS_INPUT_TYPES_ENUM.COLOR,
  },
  {
    name: 'inContacts',
    label: 'in',
    inputType: DETAILS_INPUT_TYPES_ENUM.SELECT,
    valueType: DETAILS_VALUE_TYPES_ENUM.PIN_RANGE,
  },
  {
    name: 'initialSignal',
    label: 'initial-value',
    inputType: DETAILS_INPUT_TYPES_ENUM.SELECT,
    valueType: DETAILS_VALUE_TYPES_ENUM.SIGNAL,
  },
  {
    name: 'signal',
    label: 'current-value',
    inputType: DETAILS_INPUT_TYPES_ENUM.SELECT,
    valueType: DETAILS_VALUE_TYPES_ENUM.SIGNAL,
  },
  // {
  //   name: 'invert',
  //   label: 'invert',
  //   inputType: DETAILS_INPUT_TYPES_ENUM.SELECT,
  //   valueType: DETAILS_VALUE_TYPES_ENUM.SIGNAL,
  // },
  {
    name: 'fontSize',
    label: 'font-size',
    inputType: DETAILS_INPUT_TYPES_ENUM.SELECT,
    valueType: DETAILS_VALUE_TYPES_ENUM.FONT_SIZE
  },
  {
    name: 'labelText',
    label: 'name',
    inputType: DETAILS_INPUT_TYPES_ENUM.TEXT,
  }
];

export const DETAIL_PRESETS_DICT: {[value in ElementProperty]?: ElementPropertyDetail} = _.reduce(
  DETAIL_PRESETS_ARRAY,
  (acc, val: ElementPropertyDetail) => ({...acc, [val.name]: val}),
  {}
);
