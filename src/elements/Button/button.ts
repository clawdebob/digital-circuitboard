import {DcbElement, Dimensions} from '../dcbElement';
import {fromEvent} from 'rxjs';
import {ElementProperties} from '../../types/consts/elementDetails.consts';
import store from '../../store/store';
import {ELEMENT} from '../../types/consts/element.consts';
import {filter} from 'rxjs/operators';
import {BOARD_STATES_ENUM} from '../../types/consts/boardStates.consts';

class Button extends DcbElement {
  public signature = '0';
  public isInteractive = true;

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
      initialSignal: false,
    }
  ) {
    super(
      ELEMENT.BUTTON,
      dimensions,
      props,
      ['fill', 'initialSignal']
    );
  }

  initialize() {
    if (this.modelData.model) {
      const modelGroup = this.modelData.model.node;
      const onClick$ = fromEvent(modelGroup, 'click')
        .pipe(
          filter(() => store.getState().board.boardState === BOARD_STATES_ENUM.INTERACT)
        )
        .subscribe(() => {
          this.props.initialSignal = !this.props.initialSignal;
          this.updateState();
        });

      this.subscriptions.add(onClick$);
    }

    this.updateState();
  }

  operation() {
    const signal = this.props.initialSignal;
    const color = this.getStateColor(signal);

    this.outPins[0].value = signal;

    if (this.outPins[0].model) {
      this.outPins[0].model.stroke(color);
    }

    if (this.modelData.signatureModel) {
      this.modelData.signatureModel
        .text(this.getStateSignature(signal))
        .fill(color)
        .stroke(color);
    }
  }
}

export default Button;
