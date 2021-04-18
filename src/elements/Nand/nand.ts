import {DcbElement, Dimensions} from '../dcbElement';
import * as _ from 'lodash';
import {ELEMENT} from '../../types/consts/element.consts';
import {ElementProperties} from '../../types/consts/elementDetails.consts';

class Nand extends DcbElement {
  public signature = '&';

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
      ELEMENT.NAND,
      dimensions,
      props,
      ['inContacts', 'fill'],
      true
    );
  }


  public operation(): void {
    this.outPins[0].value = !_.reduce(
      this.inPins,
      (acc: boolean, pin) => acc && Boolean(pin.invert ? !pin.value : pin.value),
      true
    );
  }
}

export default Nand;
