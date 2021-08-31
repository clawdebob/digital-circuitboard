import {DcbElement, Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';
import * as _ from 'lodash';

class Xor extends DcbElement {
  public signature = '=1';

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
    },
    invertOutPins = false,
  ) {
    super(
      ELEMENT.XOR,
      dimensions,
      props,
      ['inContacts', 'fill'],
      invertOutPins,
    );
  }


  public operation(): void {
    this.outPins[0].value = _.countBy(this.inPins, 'value')['true'] >= 1;
  }
}

export default Xor;
