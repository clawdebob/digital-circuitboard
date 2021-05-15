import * as React from 'react';
import {MouseEventHandler} from 'react';
import './button.scss';
import * as _ from 'lodash';
import {BUTTON_TYPES_ENUM, ButtonType} from '../../types/consts/buttons.consts';
import {useTranslation} from 'react-i18next';

export interface ButtonProps {
  type?: ButtonType;
  isDisabled?: boolean;
  className?: string;
  text: string;
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = (props: ButtonProps): React.ReactElement => {
  const type = props.type || BUTTON_TYPES_ENUM.REGULAR;
  const isDisabled = props.isDisabled;
  const {t} = useTranslation();

  return (
    <button
      id={props.id}
      className={`button button--${isDisabled ? BUTTON_TYPES_ENUM.DISABLED : type} ${props.className || ''}`}
      onClick={isDisabled ? _.noop : props.onClick}
      disabled={isDisabled}
    >
      {t(props.text)}
    </button>
  );
};

export default Button;
