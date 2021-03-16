import {ELEMENT} from '../../types/consts/element.consts';
import {DcbElement} from '../dcbElement';

export class Wire extends DcbElement {
  constructor() {
    super(ELEMENT.WIRE);
  }
}
