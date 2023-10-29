import React, {MouseEvent, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import i18n from 'i18next';
import {setBoardState} from '../../store/actions/boardActions';
import {BOARD_STATES_ENUM} from '../../store/consts/boardStates.consts';
import {fromEvent} from 'rxjs';
import * as _ from 'lodash';
import './language-selector.scss';
import {COOKIE_TTL, COOKIES_NAMES_ENUM} from '../../types/consts/cookies.consts';

const LANGUAGE_DATA = [
  {
    id: 'en',
    label: 'English',
  },
  {
    id: 'ru',
    label: 'Русский',
  }
];

const LanguageSelector = (): React.ReactElement => {
  const [cookies, setCookie] = useCookies([COOKIES_NAMES_ENUM.LANGUAGE]);
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [language, setLanguage] = useState(_.get(cookies, COOKIES_NAMES_ENUM.LANGUAGE, i18n.language));
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const toggleSelector = (event: MouseEvent) => {
    event.stopPropagation();

    setMenuVisibility(!isMenuVisible);
  };

  const changeLanguage = (language: string) => {
    const expires = new Date(Date.now() + COOKIE_TTL);

    i18n.changeLanguage(language);

    setCookie(COOKIES_NAMES_ENUM.LANGUAGE, language, {path: '/', expires});
    dispatch(setBoardState(BOARD_STATES_ENUM.EDIT));
    setLanguage(language);

    if (isMenuVisible) {
      setMenuVisibility(false);
    }
  };

  useEffect(() => {
    const clickSubscription = fromEvent(document, 'click')
      .subscribe(() => {
        if (isMenuVisible) {
          setMenuVisibility(false);
        }
      });

    return () => clickSubscription.unsubscribe();
  });

  return (
    <div
      className="language"
      title={t('select-language')}
    >
      <div
        className="language--icon"
        onClick={toggleSelector}
      >
        <span
          className="iconify"
          data-icon="ic:baseline-language"
        />
      </div>
      <li className={`language--list language--list--${isMenuVisible ? 'visible' : 'hidden'}`}>
        {
          _.map(LANGUAGE_DATA, languageData => (
            <ul
              className="language--list--option"
              onClick={() => changeLanguage(languageData.id)}
              key={languageData.id}
            >
              <span>{languageData.label}</span>
              <span className={`language--check language--check--${language === languageData.id ? 'visible' : 'hidden'}`}>
                <span
                  className="iconify"
                  data-icon="ant-design:check-outlined"
                />
              </span>
            </ul>
          ))
        }
      </li>
    </div>
  );
};

export default LanguageSelector;
