import {DcbElement, Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';

class Constant extends DcbElement {
  public signature = 'C';

  public constructor(
    dimensions: Dimensions = {
      originY: 0,
      width: 26,
      height: 26,
      x: 0,
      y: 0,
    },
    props: ElementProperties = {
      fill: '#ffffff',
      outContacts: 1,
      signal: false,
    }
  ) {
    super(
      ELEMENT.CONSTANT,
      dimensions,
      props,
      ['fill', 'signal']
    );
  }

  operation(): void {
    const {signal} = this.props;
    const color = this.getStateColor(signal);

    this.outPins[0].value = signal;

    if (this.outPins[0].model) {
      this.outPins[0].model.stroke(color);
    }

    if (this.modelData.signatureModel) {
      this.modelData.signatureModel
        .text(this.signature)
        .fill(color)
        .stroke(color);
    }
  }
}

export default Constant;
