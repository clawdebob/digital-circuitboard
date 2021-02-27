import {PositionData, DcbElement} from '../dcbElement';
import {Line, Circle} from '@svgdotjs/svg.js';
import {BehaviorSubject, Observable} from 'rxjs';

export type Signal = boolean | null | undefined;
export type Wired = DcbElement | null;

interface PinProps {
  positionData: PositionData;
  value: Signal,
  invert: boolean,
  model?: Line,
  helper?: Circle,
  helperEnabled?: boolean,
  wiredTo: Wired,
  valueUpdate: BehaviorSubject<boolean>,
  observable: Observable<boolean>,
}

export class Pin implements PinProps {
  public positionData: PositionData;
  public value: Signal;
  public invert: boolean;
  public wiredTo: Wired;
  public valueUpdate = new BehaviorSubject(false);
  public observable: Observable<boolean>;
  public model?: Line;
  public helper?: Circle;

  constructor(
    positionData: PositionData,
    value: Signal = undefined,
    invert = false,
    wiredTo: Wired = null,
  ) {
    this.positionData = positionData;
    this.value = value;
    this.invert = invert;
    this.observable = new Observable<boolean>();
    this.wiredTo = wiredTo;
  }
}
