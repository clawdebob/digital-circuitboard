import React, {useEffect, useState} from 'react';
import {mergeCssClasses} from '../../utils/helpers';
import {TabsProvider} from './context/use-tabs-context';
import Tab, {TabProps} from './components/tab';
import './tabs.scss';
import * as _ from 'lodash';

interface TabGroupProps {
  className?: string;
  children: React.ReactNode[];
}

type TabsComponent = React.FC<TabGroupProps> & {Tab: React.FC<TabProps>};

const TabGroup: TabsComponent = (props: TabGroupProps) => {
  const [activeTab, setActiveTab] = useState('');
  const className = mergeCssClasses([
    props.className || '',
    'app__tabs'
  ]);

  useEffect(() => {
    if (!props.children.length) {
      throw new Error('No tabs provided');
    }

    setActiveTab(_.get(props.children, '[0].props.id'));
  }, []);

  const activeTabComponent = _.find(props.children, ['props.id', activeTab]);
  const activeTabContent = _.get(activeTabComponent, 'props.children');

  return (
    <TabsProvider value={{activeTab, setActiveTab}}>
      <div className={className}>
        <div className="app__tabs__list">
          {props.children}
        </div>
      </div>
      <div className="app__tabs__content">{activeTabContent}</div>
    </TabsProvider>
  );
};

TabGroup.Tab = Tab;

export default TabGroup;
