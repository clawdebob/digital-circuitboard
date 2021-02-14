import {ELEMENT} from '../../../types/consts/element.consts';
import ElementBase, {ElementBaseType} from './element-base';

export interface DcbElementGroup {
  name: string;
  elements: Array<ElementBaseType>
}

export const GROUPS = [
  {
    name: 'groups.gates',
    elements: [
      new ElementBase(ELEMENT.INVERTOR),
      new ElementBase(ELEMENT.BUFFER),
      new ElementBase(ELEMENT.OR),
      new ElementBase(ELEMENT.NOR),
      new ElementBase(ELEMENT.AND),
      new ElementBase(ELEMENT.NAND),
      new ElementBase(ELEMENT.XOR),
      new ElementBase(ELEMENT.NXOR)
    ],
  },
  {
    name: 'groups.io',
    elements: [
      new ElementBase(ELEMENT.CONSTANT),
      new ElementBase(ELEMENT.BUTTON),
      new ElementBase(ELEMENT.OUT_CONTACT)
    ]
  },
  {
    name: 'groups.other',
    elements: [
      new ElementBase(ELEMENT.LABEL)
    ]
  }
];
