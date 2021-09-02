import {DcbElement, Dimensions} from '../dcbElement';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import {ELEMENT} from '../../types/consts/element.consts';

class Label extends DcbElement {
  public signature = 'Label';

  public constructor(
    dimensions: Dimensions = {
      originY: 0,
      width: 1,
      height: 1,
      x: 0,
      y: 0,
    },
    props: ElementProperties = {
      fill: '#000000',
      fontSize: 20,
      labelText: 'Label',
    },
    invertOuterPin = false,
  ) {
    super(
      ELEMENT.LABEL,
      dimensions,
      props,
      ['labelText', 'fontSize', 'fill'],
      invertOuterPin
    );
  }


  public operation(): void {
    if (this.modelData.signatureModel) {
      this.modelData.signatureModel
        .text(String(this.props.labelText))
        .attr('font-size', this.props.fontSize);
    }
  }
}

export default Label;
