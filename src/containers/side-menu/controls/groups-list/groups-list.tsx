import React from 'react';
import {GROUPS} from '../../models/element-groups';
import * as _ from 'lodash';
import ElementGroup from '../element-group/element-group';

const GroupsList = (props: {className?: string}): React.ReactElement => {
  const groups = _.map(GROUPS, (group, idx) => (
    <ElementGroup
      group={group}
      className={`${props.className}__group`}
      groupIndex={idx}
      key={group.name}
    />
  ));

  return (
    <div
      className={props.className}
    >
      {groups}
    </div>
  );
};

export default GroupsList;
