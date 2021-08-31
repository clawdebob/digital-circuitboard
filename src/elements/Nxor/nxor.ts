import Xor from '../Xor/xor';
import {Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';

class Nxor extends Xor {
  constructor(
    dimensions: Dimensions = {
      originY: 5,
      width: 50,
      height: 60,
      x: 0,
      y: 0,
    },
    props: ElementProperties = {
      inContacts: 3,
      fill: '#ffffff',
      outContacts: 1
    },
  ) {
    super(
      dimensions,
      props,
      true
    );

    this.name = ELEMENT.NXOR;
  }
}

export default Nxor;
