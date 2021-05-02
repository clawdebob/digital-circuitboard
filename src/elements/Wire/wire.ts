import {ELEMENT} from '../../types/consts/element.consts';
import {DcbElement, PositionData} from '../dcbElement';
import {Pin, PIN_TYPES_ENUM, Signal} from '../Pin/pin';
import {BehaviorSubject, Subscription} from 'rxjs';
import * as _ from 'lodash';
import {distinctUntilChanged, filter, map, skipWhile} from 'rxjs/operators';
import {Circle, Line} from '@svgdotjs/svg.js';
import {DIRECTION, ORIENTATION} from '../../types/consts/orientation.const';
import Renderer from '../../utils/renderer';

export interface WiredElement {
  element: DcbElement;
  pin?: Pin;
}

export interface WireHelper {
  isEnabled: boolean,
  model: Circle,
}

/*
* 1. Каждый раз при обновлении сигнала вычислять источники сигнала (долго для длинных цепей, но надежно)
* 2. Всегда хранить источники, но пересчитывать их при каждом изменении цепи (сложная логика)
* 3. Использовать тактику пограничного провода, когда провод присоединенный к пину сам определят правильность сигнала на участке цепи (наименее нагруженный вариант)
*
*
*/

export class Wire extends DcbElement {
  private wiredTo: Array<WiredElement> = [];
  public helpers: Array<WireHelper> = [];
  public junctionHelpers: Array<WireHelper> = [];
  public junctionSubscriptions = new Subscription();
  public value: Signal = undefined;
  public valueUpdate: BehaviorSubject<Signal> = new BehaviorSubject<Signal>(undefined);
  public name = ELEMENT.WIRE;
  public junctions: Array<Circle> = [];

  constructor() {
    super(ELEMENT.WIRE);
  }

  public initialize() {
    if (this.modelData.model) {
      this.modelData.model.stroke(this.getStateColor(undefined));
    }
  }

  private toggleHelper(helper: WireHelper, value = true) {
    helper.isEnabled = value;

    if (!value) {
      helper.model.opacity(0);
    }

    if (Renderer.background && Renderer.foreground) {
      const layer = value ? Renderer.foreground : Renderer.background;

      layer.add(helper.model);
    }
  }

  public wireTo(element: DcbElement | Wire, pin?: Pin, viaJunction = false): void {
    if (
      !_.some(this.wiredTo, elementData => elementData.element.id === element.id)
      // && this.wiredTo.length < 2
    ) {
      if (pin) {
        this.wiredTo.push({
          element,
          pin
        });
        const {coords} = element.positionData;
        const [{x: ex, y: ey}] = coords;

        const closestHelper = _.minBy(this.helpers,
            helper => Math.abs(Math.pow(ex - helper.model.x(), 2) - Math.pow(ey - helper.model.y(), 2))
        );

        if (closestHelper) {
          this.toggleHelper(closestHelper, false);
        }

        if (pin.type === PIN_TYPES_ENUM.OUT) {
          const sub = pin.valueUpdate
            .pipe(
              distinctUntilChanged(),
              filter(value => value !== this.value)
            )
            .subscribe(signal => this.updateState(signal));

          element.toggleOutPinHelper(pin.index, false);

          this.subscriptions.add(sub);
        } else {
          const elementSubscription = this.valueUpdate
            .pipe(
              distinctUntilChanged(),
              // filter(value => value !== pin.value)
            )
            .subscribe(value => {
              pin.value = value;
              pin.valueUpdate.next(value);
            });

          element.toggleInPinHelper(pin.index, false);

          element.subscriptions.add(elementSubscription);
        }
      }

      if (element instanceof Wire) {
        const {orientation, coords} = this.positionData;

        /*
        * To find out which helper needs to be disabled during wiring, the closest one should be found by calculating a distance.
        * The distance between a point and a line, when line is represented like Ax + By + C = 0, is calculated as
        * |A * x0 + B * y0 + C| / sqrt(A^2 + B^2) where (x0, y0) are the point's coords.
        * All wires are represented by either horizontal or vertical straight lines, no diagonal wires are allowed. So:
        * 1. For any vertical wire the equation will be x = C -> -x + C = 0 -> Ax + C = 0,
        *    where A = -1, B = 0, C = x1, where x1 is a const x value.
        * 2. For any horizontal wire the equation will be y = C -> -y + C = 0 -> By + C = 0,
        *    where A = 0, B = -1, C = y1, where y1 is a const y value.
        */

        const closestHelper = _.minBy(element.helpers, helper => {
          const [{x, y}] = coords;
          const x0 = helper.model.x();
          const y0 = helper.model.y();

          if (orientation === ORIENTATION.VERTICAL) {
            return Math.abs(-x0 + x);
          }

          return Math.abs(-y0 + y);
        });

        if (closestHelper && !viaJunction) {
          element.toggleHelper(closestHelper, false);
        }

        this.wiredTo.push({
          element
        });

        element.wireTo(this);

        const sub = element.valueUpdate
          .pipe(
            map(() => element.value),
            distinctUntilChanged(),
            filter(value => value !== this.value),
            skipWhile(value => value === undefined)
          )
          .subscribe(value => {
            this.updateState(value);
          });

        this.subscriptions.add(sub);
      }
    }
  }

  public recursiveUpdate(value: Signal): void {
    const updatedWires: string[] = [];

    const upd = (wire: Wire) => {
      const id = wire.id;
      const wires = _.chain(wire.wiredTo)
        .map('element')
        .filter(element => element instanceof Wire && !_.includes(updatedWires, element.id))
        .value() as Wire[];

      updatedWires.push(id);

      if (wires.length) {
        _.forEach(wires, wire => {
          upd(wire);
        });
      } else {
        _.forEach(wire.wiredTo, ({element, pin}) => {
          if (pin && pin.type === PIN_TYPES_ENUM.IN) {
            element.inPins[pin.index].value = value;
          }
        });
      }
    };

    _.forEach(this.wiredTo, ({element, pin}) => {
      if (pin && pin.type === PIN_TYPES_ENUM.IN) {
        element.inPins[pin.index].value = value;
      }
    });

    upd(this);
  }

  public updateState(signal?: Signal): void {
    this.value = signal;

    if (
      _.every(this.wiredTo, element => element.pin && element.pin.type === PIN_TYPES_ENUM.OUT)
      // && this.wiredTo.length === 2
    ) {
      if (_.some(this.wiredTo, element => element.pin && element.pin.value !== signal)) {
        this.value = null;
      }
    } else if (_.some(this.wiredTo, element => element.pin && element.pin.type === PIN_TYPES_ENUM.OUT)) {
      const wired = _.find(this.wiredTo, element => element.pin && element.pin.type === PIN_TYPES_ENUM.OUT) as undefined | WiredElement;
      const pinValue = _.get(wired, 'pin.value');

      if (wired && signal !== pinValue) {
        if (signal !== undefined) {
          this.value = null;
        } else {
          this.value = pinValue;
        }
      }

      this.recursiveUpdate(this.value);
    }

    const stateColor = this.getStateColor(this.value);

    if (this.modelData.model) {
      this.modelData.model.stroke(stateColor);
    }

    _.forEach(this.wiredTo, element => {
      if (element.pin && element.pin.model) {
        element.pin.model.stroke(stateColor);
      }
    });

    _.forEach(this.junctions, model => {
      model.fill(stateColor);
    });

    this.valueUpdate.next(this.value);
  }

  public delete(): void {
    if (this.modelData.model) {
      this.modelData.model.remove();
    }

    _.forEach(
      _.union(this.helpers, this.junctionHelpers),
      helper => helper.model.remove()
    );

    this.updateState(undefined);
    _.forEach(this.wiredTo, item => {
      if (item.element instanceof Wire) {
        item.element.removeWiredElement(this);
      }
    });

    this.wiredTo = [];
    this.subscriptions.unsubscribe();
    this.junctionSubscriptions.unsubscribe();
  }

  public get positionData(): PositionData {
    const model = this.modelData.model;

    if (model instanceof Line) {
      const [x1, y1] = model.plot()[0];
      const [x2, y2] = model.plot()[1];
      const coords = [{x: x1, y: y1}, {x: x2, y: y2}];
      const orientation = x1 === x2 ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL;
      let direction;

      if (orientation === ORIENTATION.HORIZONTAL) {
        direction = y1 < y2 ? DIRECTION.T2B : DIRECTION.B2T;
      } else {
        direction = x1 < x2 ? DIRECTION.L2R : DIRECTION.R2L;
      }

      return {
        coords,
        orientation,
        direction
      };
    }

    return {
      coords: [{x: this.dimensions.x, y: this.dimensions.y}],
      orientation: ORIENTATION.HORIZONTAL,
      direction: DIRECTION.L2R,
    };
  }

  public resetJunctionHelpers(): void {
    this.junctionSubscriptions.unsubscribe();
    this.junctionSubscriptions = new Subscription();

    _.forEach(this.junctionHelpers, helper => helper.model.remove());
  }

  public removeWiredElement(element: DcbElement): void {
    const currentWiredTo = _.filter(this.wiredTo, item => item.element.id !== element.id);

    // TO-DO update when delete will be implemented
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.wiredTo = [];

    _.forEach(currentWiredTo, item => this.wireTo(item.element, item.pin));
  }
}
