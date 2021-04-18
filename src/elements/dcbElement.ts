import {G, Element, Text} from '@svgdotjs/svg.js';
import {DIRECTION, ElementDirection, ElementOrientation, ORIENTATION} from '../types/consts/orientation.const';
import {ElementProperties, ElementProperty} from '../types/consts/elementDetails.consts';
import * as _ from 'lodash';
import {Pin, PIN_TYPES_ENUM, Signal} from './Pin/pin';
import {DcbElementName} from '../types/consts/element.consts';
import {Subscription} from 'rxjs';
import Renderer from '../utils/renderer';

const PIN_LENGTH = 12;
const DEFAULT_DIMENSIONS = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  originY: 0,
};

export interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
  originY: number;
  signatureSize?: number;
}

export interface PositionData {
  coords: Array<{x: number, y: number}>;
  orientation: ElementOrientation;
  direction: ElementDirection;
}

interface ModelData {
  model: G | Element | null;
  signatureModel?: Text;
  interactionModel?: G;
}

export interface ElementParams {
  id: string;
  name: DcbElementName;
  className: string;
  isInteractive: boolean;
  isSelected: boolean;
  signature?: string;
  dimensions: Dimensions;
  modelData: ModelData;
  props: ElementProperties;
  editableProps: Array<ElementProperty>;
  positionData: PositionData;
  maxContacts: number;
  operation: () => void;
  updateState: (signal?: Signal) => void;
  subscriptions: Subscription;
  inPins: Array<Pin>;
  outPins: Array<Pin>;
}

export abstract class DcbElement implements ElementParams {
  public id = '';
  public name: DcbElementName;
  public className = '';
  public isInteractive = false;
  public isSelected = false;
  public dimensions: Dimensions;
  public editableProps: Array<ElementProperty>;
  public props: ElementProperties;
  public modelData: ModelData = {
    model: null,
  };
  public maxContacts = 0;
  public inPins: Array<Pin>;
  public outPins: Array<Pin>;
  public signature?: string;
  public subscriptions = new Subscription();

  protected constructor(
    name: DcbElementName,
    dimensions: Dimensions = DEFAULT_DIMENSIONS,
    props: ElementProperties = {},
    editableProps: Array<ElementProperty> = [],
    invertOuterPins = false
  ) {
    this.dimensions = dimensions;
    this.name = name;

    this.className = `element-${name} element`;

    this.props = props;
    this.editableProps = editableProps;

    const height = dimensions.height;
    const originY = dimensions.originY;
    const availableLen = height - (2 * originY);

    this.maxContacts = Math.round(availableLen / 10);
    this.inPins = this.getInPins();
    this.outPins = this.getOutPins(invertOuterPins);
  }

  public get positionData(): PositionData {
    return {
      coords: [{x: this.dimensions.x, y: this.dimensions.y}],
      orientation: ORIENTATION.HORIZONTAL,
      direction: DIRECTION.L2R,
    };
  }

  private getYPinCoords(numberOfPins: number): Array<number> {
    const height = this.dimensions.height;
    const originY = this.dimensions.originY;
    const availableLen = height - (2 * originY);
    const maxPoints = Math.round(availableLen / 10);
    const pointsArray = [];
    const pivotPoint = Math.round(maxPoints / 2);

    for (let y1 = 0; y1 < availableLen; y1 += PIN_LENGTH) {
      pointsArray.push(y1 + 1);
    }

    const yPositions = [];

    for (let i = 0; i < Math.floor(numberOfPins / 2); i++) {
      let min = pointsArray[maxPoints - 1] + 1;
      let max = 0;

      for (let c = 0; c < maxPoints; c++) {
        if (pointsArray[c] < min && yPositions.indexOf(pointsArray[c]) < 0) {
          min = pointsArray[c];
        }
        if (pointsArray[c] > max && yPositions.indexOf(pointsArray[c]) < 0) {
          max = pointsArray[c];
        }
      }

      yPositions.push(min, max);
    }

    if (numberOfPins % 2 !== 0) {
      yPositions.push(pointsArray[pivotPoint - 1]);
    }

    return yPositions.sort();
  }

  private getInPins(): Array<Pin> {
    const numberOfPins = this.props.inContacts;

    if (!numberOfPins) {
      return [];
    }

    const pinPositionsArray = _.map(
      this.getYPinCoords(numberOfPins),
      y => [
        {x: -PIN_LENGTH, y},
        {x: 0, y}
      ]
    );

    return _.map(pinPositionsArray, (coords, idx) => new Pin(
      {
        ...this.positionData,
        coords
      },
      PIN_TYPES_ENUM.IN,
      idx,
      _.get(this.inPins, `[${idx}].value`, undefined),
      _.get(this.inPins, `[${idx}].invert`, false),
      _.get(this.inPins, `[${idx}].wiredTo`, null),
    ));
  }

  private getOutPins(invertOuterPins = false) {
    const numberOfPins = this.props.outContacts;

    if (!numberOfPins) {
      return [];
    }

    const width = this.dimensions.width;
    const pinPositionsArray = _.map(
      this.getYPinCoords(numberOfPins),
      y => [
        {x: width, y},
        {x: width + PIN_LENGTH, y}
      ]
    );

    return _.map(pinPositionsArray, (coords, idx) => new Pin(
      {
        ...this.positionData,
        coords
      },
      PIN_TYPES_ENUM.OUT,
      idx,
      _.get(this.outPins, `[${idx}].value`, undefined),
      _.get(this.outPins, `[${idx}].invert`, invertOuterPins),
      _.get(this.outPins, `[${idx}].wiredTo`, null),
    ));
  }

  public operation(): void {
    // each element has unique implementation
  }

  public checkErrors(): void {
    if (
      _.countBy(this.inPins, 'value')['undefined'] === this.inPins.length
      || _.countBy(this.inPins, 'value')['null']
    ) {
      _.map(this.outPins, pin => _.set(pin, 'value', null));
    }
  }

  public initialize(): void {
    _.forEach(this.inPins, pin => {
      const pinSub = pin.valueUpdate.subscribe(() => this.updateState());

      this.subscriptions.add(pinSub);
    });

    this.updateState();
  }

  public updateState(): void {
    if (this.inPins.length) {
      _.forEach(this.inPins, pin => {
        if (pin.model) {
          pin.model.stroke(this.getStateColor(pin.value));
        }
      });
    }

    this.operation();
    this.checkErrors();

    if (this.outPins.length) {
      _.forEach(this.outPins, pin => {
        if (pin.model) {
          pin.model.stroke(this.getStateColor(pin.value));
        }
        pin.valueUpdate.next(pin.value);
      });
    }
  }

  public getStateSignature(signal: Signal): string {
    switch (signal) {
      case false:
        return '0';
      case true:
        return '1';
      default:
        return 'x';
    }
  }

  public toggleInPinHelper(idx: number, value = true): void {
    const model = this.inPins[idx].helper;

    this.inPins[idx].helperEnabled = value;

    if (Renderer.foreground && Renderer.background && model) {
      const layer = value ? Renderer.foreground : Renderer.background;

      layer.add(model);
      model.opacity(0);
    }
  }

  public toggleOutPinHelper(idx: number, value = true): void {
    const model = this.outPins[idx].helper;

    this.outPins[idx].helperEnabled = value;

    if (Renderer.foreground && Renderer.background && model) {
      const layer = value ? Renderer.foreground : Renderer.background;

      layer.add(model);
      model.opacity(0);
    }
  }

  public getStateColor(signal: Signal): string {
    switch (signal) {
      case false:
        return '#006200';
      case true:
        return '#00FF00';
      // case 'overload':
      //   stroke = '#ff7700';
      //   break;
      case undefined:
        return '#0077ff';
      default:
        return '#FF0000';
    }
  }
}
