import {DcbElementName} from '../../../types/consts/element.consts';
import elementBuilder from '../../../utils/elementBuilder';

export default class ElementBase {
  public name: string;
  public create: () => any;
  public icon: any;

  constructor(name: DcbElementName) {
    this.name = 'elements.' + name.toLowerCase();
    this.create = elementBuilder.getCreateFuncByName(name);
    this.icon = elementBuilder.getIconByName(name);
  }
}

export type ElementBaseType = ElementBase;
