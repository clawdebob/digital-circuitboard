import {DcbElementName, ELEMENT} from '../types/consts/element.consts';
import And from '../elements/And/and';
import * as _ from 'lodash';
import Nand from '../elements/Nand/nand';
import {Dimensions} from '../elements/dcbElement';
import {ElementProperties} from '../types/consts/elementDetails.consts';

interface BuilderData {
  create: any;
  icon: any;
}

export default class elementBuilder {
  static elementMap = new Map<DcbElementName, BuilderData>([
    [ELEMENT.OR, {create: _.noop, icon: require('../assets/or.svg')}],
    [ELEMENT.AND, {create: (dimensions?: Dimensions, props?: ElementProperties) => new And(dimensions, props), icon: require('../assets/and.svg')}],
    [ELEMENT.NOR, {create: _.noop, icon: require('../assets/nor.svg')}],
    [ELEMENT.NAND, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Nand(dimensions, props), icon: require('../assets/nand.svg')}],
    [ELEMENT.XOR, {create: _.noop, icon: require('../assets/xor.svg')}],
    [ELEMENT.NXOR, {create: _.noop, icon: require('../assets/nxor.svg')}],
    [ELEMENT.CONSTANT, {create: _.noop, icon: require('../assets/const.svg')}],
    [ELEMENT.BUTTON, {create: _.noop, icon: require('../assets/button.svg')}],
    [ELEMENT.JUNCTION, {create: _.noop, icon: null}],
    [ELEMENT.INVERTOR, {create: _.noop, icon: require('../assets/invertor.svg')}],
    [ELEMENT.BUFFER, {create: _.noop, icon: require('../assets/buffer.svg')}],
    [ELEMENT.OUT_CONTACT, {create: _.noop, icon: require('../assets/out-contact.svg')}],
    [ELEMENT.LABEL, {create: _.noop, icon: require('../assets/label.svg')}],
  ]);

  static getCreateFuncByName(name: DcbElementName): any {
    const data = elementBuilder.elementMap.get(name);

    if (!data) {
      return _.noop;
    }

    return data.create;
  }

  static getIconByName(name: DcbElementName): any {
    const data = elementBuilder.elementMap.get(name);

    if (!data) {
      return _.noop;
    }

    return data.icon;
  }
}
