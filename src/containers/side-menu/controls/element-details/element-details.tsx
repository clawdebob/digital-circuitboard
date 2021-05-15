import React from 'react';
import './element-details.scss';
import {useTranslation} from 'react-i18next';
import {DcbElement} from '../../../../elements/dcbElement';
import {RootState} from '../../../../types/consts/states.consts';
import {connect, useDispatch} from 'react-redux';
import * as _ from 'lodash';
import {
  DETAIL_PRESETS_DICT,
  DETAILS_VALUE_TYPES_ENUM,
  DetailsValueType,
  ElementProperty
} from '../../../../types/consts/elementDetails.consts';
import {setCurrentElement, updateElementPropsCache} from '../../../../store/actions/boardActions';
import elementBuilder from '../../../../utils/elementBuilder';
import {fromEvent} from 'rxjs';
import {pluck} from 'rxjs/operators';
import {OptionsMap} from '../../../../types/menuCache.type';

export interface ElementDetailsProps {
  currentElement: DcbElement | null;
  elementPropsCache: OptionsMap;
  className?: string;
}

const ElementDetails = (props: ElementDetailsProps): React.ReactElement | null => {
  const {t} = useTranslation();
  const {currentElement, className} = props;
  const dispatch = useDispatch();

  if (!currentElement) {
    return null;
  }

  const createElement = elementBuilder.getCreateFuncByName(currentElement.name);
  const getOptionArray = (array: Array<string | number>): Array<React.ReactElement> =>
    _.map(array, (val: string | number) => (<option value={val} key={val}>{val}</option>));

  const updateElementPins = (pinIdx: number, value: string): void => {
    const {dimensions, props} = currentElement;
    const newElement = createElement(dimensions, props);

    newElement.inPins = currentElement.inPins;
    newElement.inPins[pinIdx].invert = value === 'true';

    dispatch(setCurrentElement(newElement));
    dispatch(updateElementPropsCache(newElement));
  };

  const getInvertPinsOptions = () => {
    if (!props.currentElement) {
      return [null];
    }

    const element = props.currentElement;
    const pinsCount = element.inPins.length;
    const pinsRange = _.range(0, pinsCount);

    if (pinsCount < 2) {
      return [null];
    }

    return _.map(pinsRange, pinNum => {
      const key = `${element.name}_invert_${pinNum}`;

      return (
        <tr
          key={key}
        >
          <td key={`invert_${pinNum}`}>
            <span className="prop-name">{t('props.invert') + ` ${pinNum}`}</span>
          </td>
          <td key={key}>
          <span>
            <select
              defaultValue={String(element.inPins[pinNum].invert)}
              onChange={e => updateElementPins(pinNum, e.target.value)}
              name={key}
              className="prop-input"
              key={key}
            >
              {generateOptions(DETAILS_VALUE_TYPES_ENUM.ANSWER)}
            </select>
          </span>
          </td>
        </tr>
      );
    });
  };

  const updateElementState = (prop: ElementProperty, value: string): void => {
    const {dimensions, props} = currentElement;

    switch (prop) {
      case 'signal':
      case 'initialSignal':
        props[prop] = value === 'true';
        break;
      case 'fill':
      case 'labelText':
        props[prop] = value;
        break;
      case 'outContacts':
      case 'inContacts':
      case 'fontSize':
        props[prop] = Number(value);
        break;
      default:
        return;
    }

    const newElement = createElement(dimensions, props);

    dispatch(setCurrentElement(newElement));
    dispatch(updateElementPropsCache(newElement));
  };

  const generateOptions = (type: DetailsValueType): Array<React.ReactElement> => {
    if (!currentElement) {
      return [(<option key={0}>Not specified</option>)];
    }

    switch(type) {
      case DETAILS_VALUE_TYPES_ENUM.SIGNAL:
        return getOptionArray([0, 1]);
      case DETAILS_VALUE_TYPES_ENUM.PIN_RANGE:
        return getOptionArray(_.range(2, currentElement.maxContacts + 1));
      case DETAILS_VALUE_TYPES_ENUM.FONT_SIZE:
        return getOptionArray(_.range(12, 26, 2));
      case DETAILS_VALUE_TYPES_ENUM.ANSWER:
        return _.map(
          ['no', 'yes'],
          val => {
            const mean = String(val === 'yes');

            return (<option value={mean} key={val}>{t(val)}</option>);
          }
        );
    }

    return [(<option key={0}>Not specified</option>)];
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>, prop: ElementProperty): void => {
    const input = e.target;

    const blurEvent$ = fromEvent(input, 'blur')
      .subscribe(() => {
        updateElementState(prop, e.target.value);
        blurEvent$.unsubscribe();
      });

    const keyUpEvent$ = fromEvent<KeyboardEvent>(input, 'keyup')
      .pipe(
        pluck('key')
      )
      .subscribe(keycode => {
        if (keycode === 'Enter') {
          input.blur();
          keyUpEvent$.unsubscribe();
        }
      });
  };

  const generatePropsFields = (): Array<React.ReactElement | null> => _.map(
    currentElement.editableProps,
    (prop: ElementProperty) => {
      const key = `${currentElement.name}_${prop}`;
      const preset = DETAIL_PRESETS_DICT[prop];

      if (!preset) {
        return null;
      }

      const {label, valueType, inputType} = preset;
      const inputLabel = label ? t(`props.${label}`) : null;

      return (
        <tr key={key}>
          <td key={prop}>
            <span className="prop-name">{inputLabel || prop}</span>
          </td>
          <td key={key}>
            <span>
              { inputType !== 'select' || !valueType ? (
                <input
                  type={inputType}
                  defaultValue={String(currentElement.props[prop])}
                  onFocus={inputType === 'color' ? _.noop : (e: React.FocusEvent<HTMLInputElement>) => handleFocus(e, prop)}
                  onChange={inputType === 'color' ? e => updateElementState(prop, e.target.value) : _.noop}
                  name={prop}
                  className="prop-input"
                  key={key}
                />
              ) : (
                <select
                  defaultValue={String(currentElement.props[prop])}
                  onChange={e => updateElementState(prop, e.target.value)}
                  name={prop}
                  className="prop-input"
                  key={key}
                >
                  {generateOptions(valueType)}
                </select>
              )}
            </span>
          </td>
        </tr>
      );
    }
  );

  const elementNameLabel = t(`elements.${currentElement.name.toLowerCase()}`);

  return (
    <div className={`${className}__wrapper`}>
      <table className={className}>
        <caption className={`${className}__title`}>
          {t('properties', {element: elementNameLabel})}
        </caption>
        <tbody>
        <tr>
          <th>{t('name')}</th>
          <th>{t('value')}</th>
        </tr>
        {generatePropsFields()}
        {getInvertPinsOptions()}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentElement: state.board.currentElement,
  elementPropsCache: state.board.propsCache,
});

export default connect(mapStateToProps)(ElementDetails);
