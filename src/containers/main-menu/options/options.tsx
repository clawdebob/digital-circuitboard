import React from 'react';
import OptionsList from '../options-list/options-list';
import * as _ from 'lodash';
import {Option} from '../main-menu';

interface OptionsProps {
  className: string;
  options: Array<Option>;
}

const Options = (props: OptionsProps): React.ReactElement => {
  const component = _.map(props.options, (option, idx) => (
    <OptionsList
      name={option.name}
      subOptions={option.subOptions}
      key={idx}
    />
  ));

  return <ul className={props.className}>{component}</ul>;
};

export default Options;
