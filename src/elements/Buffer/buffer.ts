import Or from '../Or/or';
import {Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';

class Buffer extends Or {
  constructor(
    dimensions: Dimensions = {
      originY: 5,
      width: 38,
      height: 38,
      x: 0,
      y: 0,
    },
    props: ElementProperties = {
      inContacts: 1,
      fill: '#ffffff',
      outContacts: 1,
    },
  ) {
    super(
      dimensions,
      props,
    );

    this.name = ELEMENT.BUFFER;
    this.editableProps = ['fill'];
  }
}

export default Buffer;
