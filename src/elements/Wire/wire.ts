import {ELEMENT} from '../../types/consts/element.consts';
import {DcbElement} from '../dcbElement';
import {Pin, PIN_TYPES_ENUM, Signal} from '../Pin/pin';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {distinctUntilChanged, filter, map, skipWhile} from 'rxjs/operators';
import {Circle} from '@svgdotjs/svg.js';

export interface WiredElement {
  element: DcbElement;
  pin?: Pin;
}

/*
* 1. Каждый раз при обновлении сигнала вычислять источники сигнала (долго для длинных цепей, но надежно)
* 2. Всегда хранить источники, но пересчитывать их при каждом изменении цепи (сложная логика)
* 3. Использовать тактику пограничного провода, когда провод присоединенный к пину сам определят правильность сигнала на участке цепи (наименее нагруженный вариант)
*
*
*
*
*
*
*
*
 */

export class Wire extends DcbElement {
  private wiredTo: Array<WiredElement> = [];
  public helpers: Array<Circle> = [];
  public value: Signal = undefined;
  public valueUpdate: BehaviorSubject<Signal> = new BehaviorSubject<Signal>(undefined);
  public name = ELEMENT.WIRE;

  constructor() {
    super(ELEMENT.WIRE);
  }

  public initialize() {
    if (this.modelData.model) {
      this.modelData.model.stroke(this.getStateColor(undefined));
    }
  }

  public wireTo(element: DcbElement | Wire, pin?: Pin): void {
    if (
      !_.find(this.wiredTo, elementData => elementData.element.id === element.id)
      && this.wiredTo.length < 2
    ) {
      if (pin) {
        this.wiredTo.push({
          element,
          pin
        });

        if (pin.type === PIN_TYPES_ENUM.OUT) {
          const sub = pin.valueUpdate
            .pipe(
              distinctUntilChanged(),
              filter(value => value !== this.value)
            )
            .subscribe(signal => this.updateState(signal));

          this.subscriptions.add(sub);
        } else {
          const elementSubscription = this.valueUpdate
            .pipe(
              distinctUntilChanged(),
              filter(value => value !== pin.value)
            )
            .subscribe(value => {
              pin.value = value;
              pin.valueUpdate.next(value);
            });

          element.subscriptions.add(elementSubscription);
        }
      }

      if (element instanceof Wire) {
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

  public updateState(signal?: Signal): void {
    this.value = signal;

    if (
      _.every(this.wiredTo, element => element.pin && element.pin.type === PIN_TYPES_ENUM.OUT)
      && this.wiredTo.length === 2
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
        }
      }
    }

    if (this.modelData.model) {
      this.modelData.model.stroke(this.getStateColor(this.value));
    }

    _.forEach(this.wiredTo, element => {
      if (element.pin && element.pin.model) {
        element.pin.model.stroke(this.getStateColor(this.value));
      }
    });

    this.valueUpdate.next(this.value);
  }
}
