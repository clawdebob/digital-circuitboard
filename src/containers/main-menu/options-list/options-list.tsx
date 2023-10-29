import React, {useEffect, useState, MouseEvent} from 'react';
import {fromEvent} from 'rxjs';
import {useTranslation} from 'react-i18next';
import SubList from '../sub-options-list/sub-options-list';
import {SubOption} from '../main-menu';

export interface OptionsListProps {
  name: string;
  subOptions: Array<SubOption>;
}

const OptionsList = (props: OptionsListProps): React.ReactElement => {
  const [areSubOptionsVisible, setSubOptionsVisibility] = useState(false);
  const {t} = useTranslation();
  const classState = areSubOptionsVisible ? 'opened' : 'closed';

  const toggleMenu = (event: MouseEvent) => {
    event.stopPropagation();

    setSubOptionsVisibility(!areSubOptionsVisible);
  };

  useEffect(() => {
    const clickSubscription = fromEvent(document, 'click')
      .subscribe(() => {
        if (areSubOptionsVisible) {
          setSubOptionsVisibility(false);
        }
      });

    return () => clickSubscription.unsubscribe();
  });

  return (
    <li
      className={`main-menu__option-list main-menu__option-list--${classState}`}
    >
      <div
        className="main-menu__option"
        onClick={toggleMenu}
      >
        {t(props.name)}
      </div>
      {areSubOptionsVisible ? <SubList list={props.subOptions}/> : null}
    </li>
  );
};

export default OptionsList;
