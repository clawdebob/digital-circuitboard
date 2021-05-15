import {DcbElementName, ELEMENT} from '../../../types/consts/element.consts';
import elementBuilder from '../../../utils/elementBuilder';
import {Dimensions} from '../../../elements/dcbElement';
import {ElementProperties} from '../../../types/consts/elementDetails.consts';

export default class ElementBase {
  public name: string;
  public elementName: ELEMENT;
  public create: (dimensions?: Dimensions, props?: ElementProperties) => any;
  public icon: any;

  constructor(name: DcbElementName) {
    this.name = 'elements.' + name.toLowerCase();
    this.elementName = name;
    this.create = elementBuilder.getCreateFuncByName(name);
    this.icon = elementBuilder.getIconByName(name);
  }
}

export type ElementBaseType = ElementBase;
