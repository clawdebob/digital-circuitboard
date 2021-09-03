import {DcbElementName, ELEMENT} from '../types/consts/element.consts';
import And from '../elements/And/and';
import * as _ from 'lodash';
import Nand from '../elements/Nand/nand';
import {DcbElement, Dimensions} from '../elements/dcbElement';
import {ElementProperties} from '../types/consts/elementDetails.consts';
import Button from '../elements/Button/button';
import Or from '../elements/Or/or';
import Nor from '../elements/Nor/nor';
import Xor from '../elements/Xor/xor';
import Nxor from '../elements/Nxor/nxor';
import Invertor from '../elements/Invertor/invertor';
import Buffer from '../elements/Buffer/buffer';
import Constant from '../elements/Constant/constant';
import OutContact from '../elements/OutContact/out-contact';
import Label from '../elements/Label/label';

type createFunc = (dimensions?: Dimensions, props?: ElementProperties) => DcbElement;

interface BuilderData {
  create: createFunc;
  icon: NodeRequire;
}

export default class elementBuilder {
  static elementMap = new Map<DcbElementName, BuilderData>([
    [ELEMENT.OR, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Or(dimensions, props), icon: require('../assets/or.svg')}],
    [ELEMENT.AND, {create: (dimensions?: Dimensions, props?: ElementProperties) => new And(dimensions, props), icon: require('../assets/and.svg')}],
    [ELEMENT.NOR, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Nor(dimensions, props), icon: require('../assets/nor.svg')}],
    [ELEMENT.NAND, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Nand(dimensions, props), icon: require('../assets/nand.svg')}],
    [ELEMENT.XOR, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Xor(dimensions, props), icon: require('../assets/xor.svg')}],
    [ELEMENT.NXOR, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Nxor(dimensions, props), icon: require('../assets/nxor.svg')}],
    [ELEMENT.CONSTANT, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Constant(dimensions, props), icon: require('../assets/const.svg')}],
    [ELEMENT.BUTTON, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Button(dimensions, props), icon: require('../assets/button.svg')}],
    [ELEMENT.INVERTOR, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Invertor(dimensions, props), icon: require('../assets/invertor.svg')}],
    [ELEMENT.BUFFER, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Buffer(dimensions, props), icon: require('../assets/buffer.svg')}],
    [ELEMENT.OUT_CONTACT, {create: (dimensions?: Dimensions, props?: ElementProperties) => new OutContact(dimensions, props), icon: require('../assets/out-contact.svg')}],
    [ELEMENT.LABEL, {create: (dimensions?: Dimensions, props?: ElementProperties) => new Label(dimensions, props), icon: require('../assets/label.svg')}],
  ]);

  static getCreateFuncByName(name: DcbElementName): createFunc {
    const data = elementBuilder.elementMap.get(name);

    if (!data) {
      return _.noop as createFunc;
    }

    return data.create;
  }

  static getIconByName(name: DcbElementName): NodeRequire | null {
    const data = elementBuilder.elementMap.get(name);

    if (!data) {
      return null;
    }

    return data.icon;
  }
}
