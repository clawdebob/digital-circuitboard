import React from 'react';
import {useTabsContext} from '../context/use-tabs-context';
import {mergeCssClasses} from '../../../utils/helpers';
import './tab.scss';

export interface TabProps {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const {setActiveTab, activeTab} = useTabsContext();
  const className = mergeCssClasses([
    props.className || '',
    activeTab === props.id ? 'app__tab--active' : '',
    'app__tab'
  ]);

  return (
    <div
      className={className}
      onClick={() => setActiveTab(props.id)}
    >
      <div className="app__tab__label">{props.label}</div>
    </div>
  );
};

export default Tab;
