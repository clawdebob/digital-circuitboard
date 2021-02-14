import React from 'react';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import {SubOption} from '../main-menu';

export interface SubListProps {
  list: Array<SubOption>;
}

const SubList = (props: SubListProps): React.ReactElement => {
  const {t} = useTranslation();
  const list = _.map(props.list, (entry, idx) => (
    <li className="suboptions__option" onClick={entry.action} key={idx}>
      <div className="suboptions__name suboptions__entry">{t(entry.name)}</div>
      <div className="suboptions__hotkey suboptions__entry">{entry.hotkey ? entry.hotkey : null}</div>
    </li>
  ));

  return (
    <ul className="suboptions">
      {list}
    </ul>
  );
};

export default SubList;
