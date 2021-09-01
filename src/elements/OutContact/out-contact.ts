import {DcbElement, Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';

class OutContact extends DcbElement {
  public signature = '✕';

  public constructor(
    dimensions: Dimensions = {
      originY: 0,
      width: 26,
      height: 26,
      radius: 13,
      x: 0,
      y: 0,
    },
    props: ElementProperties = {
      fill: '#ffffff',
      inContacts: 1,
    },
  ) {
    super(
      ELEMENT.OUT_CONTACT,
      dimensions,
      props,
      ['fill'],
    );
  }

  operation(): void {
    const signal = this.inPins[0].value;
    const color = this.getStateColor(signal);

    if (this.modelData.signatureModel) {
      this.modelData.signatureModel
        .text(this.getStateSignature(signal))
        .cx(this.dimensions.x + this.dimensions.width / 2)
        .fill(color)
        .stroke(color);
    }
  }
}

export default OutContact;
