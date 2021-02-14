import React, {MouseEventHandler, useRef, useState} from 'react';
import Options from './options/options';
import { ReactComponent as Logo } from '../../assets/dcb-logo.svg';
import {RootState} from '../../types/consts/states.consts';
import {connect, useDispatch} from 'react-redux';
import {setSchemeName} from '../../store/actions/schemeDataActions';
import './main-menu.scss';
import LanguageSelector from '../language-selector/language-selector';

export interface SubOption {
  name: string;
  action: MouseEventHandler<HTMLLIElement>;
  hotkey?: string;
}

export interface Option {
  name: string;
  subOptions: Array<SubOption>
}

interface MainMenuProps {
  options: Array<Option>;
  schemeName: string;
}

const MainMenu = (props: MainMenuProps) => {
  const [isInputVisible, setInputVisibility] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleTitleClick = () => {
    setInputVisibility(true);

    if(nameInput && nameInput.current) {
      nameInput.current.style.display = 'inline-block';
      nameInput.current.focus();
    }
  };

  const handleBlur = () => {
    if (nameInput && nameInput.current) {
      const name = nameInput.current.value;

      nameInput.current.style.display = 'none';

      setInputVisibility(false);

      if (name) {
        dispatch(setSchemeName(name));
      }
    }
  };

  return (
    <div className="main-menu__wrapper">
      <div className="main-menu__section">
        <div className="logo-block">
          <Logo className="logo"/>
        </div>
        <img src="../../assets/tile5px.png"></img>
        <div className="menu-block">
          <div
            className="scheme-title__wrapper"
            key={props.schemeName}
          >
            <h3
              className={`scheme-title scheme-title--${isInputVisible ? 'hidden' : 'visible'}`}
              onClick={() => handleTitleClick()}
            >
              {props.schemeName}
            </h3>
            <input
              className="scheme-title__input"
              ref={nameInput}
              placeholder="Scheme"
              defaultValue={props.schemeName}
              onBlur={() => handleBlur()}
            />
          </div>
          <Options
            className="main-menu"
            options={props.options}
          />
        </div>
      </div>
      <div className="extras__section">
        <LanguageSelector/>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  schemeName: state.schemeData.name
});

export default connect(mapStateToProps)(MainMenu);
