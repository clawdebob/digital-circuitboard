import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DcbElementGroup} from '../../models/element-groups';
import ElementGroupElements from '../element-group-elements/element-group-elements';

export interface ElementGroupProps {
  group: DcbElementGroup,
  className?: string,
  groupIndex?: number,
}

const ElementGroup = (props: ElementGroupProps): React.ReactElement => {
  const [isOpened, setState] = useState(false);
  const {t} = useTranslation();

  const handleClick = () => {
    setState(!isOpened);
  };

  const {group} = props;

  return (
    <div className={`${props.className}-${isOpened ? 'opened' : 'closed'} ${props.className}`}>
      <div
        className={`details detail--${props.groupIndex}`}
        onClick={handleClick}
      >
        <span>{t(group.name)}</span>
        <div className={'arrow'}/>
      </div>
      <ElementGroupElements
        elements={group.elements}
        className="elements-list"
      />
    </div>
  );
};

export default ElementGroup;
