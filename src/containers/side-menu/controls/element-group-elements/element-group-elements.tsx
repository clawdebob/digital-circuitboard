import React from 'react';
import {ElementBaseType} from '../../models/element-base';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {DcbElement} from '../../../../elements/dcbElement';
import {useDispatch} from 'react-redux';
import {setBoardState, setCurrentElement} from '../../../../store/actions/boardActions';
import {BOARD_STATES_ENUM} from '../../../../types/consts/boardStates.consts';

export interface ElementGroupElementsProps {
  elements: Array<ElementBaseType>;
  className?: string;
}

const ElementGroupElements = (props: ElementGroupElementsProps): React.ReactElement => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleClick = (element: DcbElement) => {
    dispatch(setBoardState(BOARD_STATES_ENUM.CREATE));
    dispatch(setCurrentElement(element));
  };

  const elementsList = _.map(props.elements, (element, idx) => (
    <div
      key={idx}
      className="element"
      title={t(element.name)}
      onClick={() => handleClick(element.create())}
    >
      <img src={element.icon.default} alt={t(element.name)}/>
    </div>
  ));

  return (
    <div className={props.className}>
      {elementsList}
    </div>
  );
};

export default ElementGroupElements;
