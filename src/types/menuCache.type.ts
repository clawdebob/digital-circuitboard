import {Dimensions} from '../elements/dcbElement';
import {ElementProperties} from './consts/elementDetails.consts';
import {ELEMENT} from './consts/element.consts';

export type OptionsMap = {
  [value in ELEMENT]?: {
    dimensions: Dimensions;
    props: ElementProperties;
    pinInversions: Array<boolean>;
  };
}
