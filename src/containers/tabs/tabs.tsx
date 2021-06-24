import React, {useEffect, useState} from 'react';
import {mergeCssClasses} from '../../utils/helpers';
import {TabsProvider} from './context/use-tabs-context';
import Tab, {TabProps} from './components/tab';
import './tabs.scss';

interface TabsProps {
  className?: string;
  children: React.ReactNode;
  tabsList: Array<string>;
}

type TabsComponent = React.FC<TabsProps> & {Tab: React.FC<TabProps>};

const Tabs: TabsComponent = (props: TabsProps) => {
  const [activeTab, setActiveTab] = useState('');
  const className = mergeCssClasses([
    props.className || '',
    'app__tabs'
  ]);

  useEffect(() => {
    if (!props.tabsList.length) {
      throw new Error('Tabs id list is empty');
    }

    setActiveTab(props.tabsList[0]);
  }, []);

  return (
    <TabsProvider value={{activeTab, setActiveTab}}>
      <div className={className}>
        <div className="app__tabs__list">
          {props.children}
        </div>
      </div>
    </TabsProvider>
  );
};

Tabs.Tab = Tab;

export default Tabs;
