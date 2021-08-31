import {Dimensions} from '../dcbElement';
import {ELEMENT} from '../../types/consts/element.consts';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import And from '../And/and';

class Nand extends And {
  public constructor(
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
    }
  ) {
    super(
      dimensions,
      props,
      true
    );

    this.name = ELEMENT.NAND;
  }
}

export default Nand;
