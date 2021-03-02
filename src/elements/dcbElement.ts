import {G, Text} from '@svgdotjs/svg.js';
import {DIRECTION, ElementDirection, ElementOrientation, ORIENTATION} from '../types/consts/orientation.const';
import {ElementProperties, ElementProperty} from '../types/consts/elementDetails.consts';
import * as _ from 'lodash';
import {Pin} from './Pin/pin';
import {DcbElementName} from '../types/consts/element.consts';

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
  model: G | null;
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

  protected constructor(
    name: DcbElementName,
    dimensions: Dimensions = DEFAULT_DIMENSIONS,
    props: ElementProperties = {},
    editableProps: Array<ElementProperty> = []
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
    this.outPins = this.getOutPins();
  }

  public get positionData(): PositionData {
    return {
      coords: [{x: this.dimensions.x, y: this.dimensions.y}],
      orientation: ORIENTATION.HORIZONTAL,
      direction: DIRECTION.T2B,
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
      _.get(this.inPins, `[${idx}].value`, undefined),
      _.get(this.inPins, `[${idx}].invert`, false),
      _.get(this.inPins, `[${idx}].wiredTo`, null),
    ));
  }

  private getOutPins() {
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
      _.get(this.outPins, `[${idx}].value`, undefined),
      _.get(this.outPins, `[${idx}].invert`, false),
      _.get(this.outPins, `[${idx}].wiredTo`, null),
    ));
  }
}
