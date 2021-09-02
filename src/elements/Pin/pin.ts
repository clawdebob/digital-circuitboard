import {PositionData, DcbElement} from '../dcbElement';
import {Line, Circle} from '@svgdotjs/svg.js';
import {BehaviorSubject, Observable} from 'rxjs';
import {Wire} from '../Wire/wire';

export const OVERLOAD_SIGNAL = 'overload';
export type Signal = boolean | null | undefined | typeof OVERLOAD_SIGNAL;
export type Wired = Wire | Pin | null;

export enum PIN_TYPES_ENUM {
  IN = 'IN',
  OUT = 'OUT'
}

interface PinProps {
  positionData: PositionData;
  value: Signal,
  invert: boolean,
  model?: Line,
  helper?: Circle,
  helperEnabled?: boolean,
  wiredTo: Wired,
  valueUpdate: BehaviorSubject<Signal>,
  observable: Observable<boolean>,
  type: PIN_TYPES_ENUM,
  index: number,
}

export class Pin implements PinProps {
  public positionData: PositionData;
  public value: Signal;
  public invert: boolean;
  public wiredTo: Wired;
  public valueUpdate: BehaviorSubject<Signal>;
  public observable: Observable<boolean>;
  public type: PIN_TYPES_ENUM;
  public index: number;
  public model?: Line;
  public helper?: Circle;
  public helperEnabled = true;

  constructor(
    positionData: PositionData,
    type: PIN_TYPES_ENUM,
    index = -1,
    value: Signal = undefined,
    invert = false,
    wiredTo: Wired = null,
  ) {
    this.positionData = positionData;
    this.value = value;
    this.invert = invert;
    this.observable = new Observable<boolean>();
    this.wiredTo = wiredTo;
    this.type = type;
    this.index = index;
    this.valueUpdate = new BehaviorSubject<Signal>(value);
  }
}
