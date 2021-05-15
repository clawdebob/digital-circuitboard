import React from 'react';
import ElementBase, {ElementBaseType} from '../../models/element-base';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {connect, useDispatch} from 'react-redux';
import {setBoardState, setCurrentElement} from '../../../../store/actions/boardActions';
import {BOARD_STATES_ENUM} from '../../../../types/consts/boardStates.consts';
import {OptionsMap} from '../../../../types/menuCache.type';
import {RootState} from '../../../../types/consts/states.consts';

export interface ElementGroupElementsProps {
  elements: Array<ElementBaseType>;
  elementPropsCache: OptionsMap;
  className?: string;
}

const ElementGroupElements = (props: ElementGroupElementsProps): React.ReactElement => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleClick = (elementBase: ElementBase) => {
    dispatch(setBoardState(BOARD_STATES_ENUM.CREATE));

    const cacheData = props.elementPropsCache[elementBase.elementName];

    const element = cacheData ?
      elementBase.create(cacheData.dimensions, cacheData.props) : elementBase.create();

    if (cacheData) {
      element.inPins = _.map(cacheData.pinInversions, (invert: boolean, idx: number) => ({
        ...element.inPins[idx],
        invert,
      }));
    }

    return dispatch(setCurrentElement(element));
  };

  const elementsList = _.map(props.elements, (element, idx) => (
    <div
      key={idx}
      className="element"
      title={t(element.name)}
      onClick={() => handleClick(element)}
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

const mapStateToProps = (state: RootState) => ({
  currentElement: state.board.currentElement,
  elementPropsCache: state.board.propsCache,
});

export default connect(mapStateToProps)(ElementGroupElements);
