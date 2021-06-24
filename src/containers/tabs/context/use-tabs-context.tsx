import React from 'react';
import * as _ from 'lodash';

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

interface TabsProviderProps {
  value: TabsContextProps;
  children: React.ReactNode;
}

const TabsContext = React.createContext<TabsContextProps>({
  activeTab: '',
  setActiveTab: _.noop,
});

const TabsProvider: React.FC<TabsProviderProps> = (props: TabsProviderProps) => (
  <TabsContext.Provider value={props.value}>
    {props.children}
  </TabsContext.Provider>
);

const useTabsContext = (): TabsContextProps => {
  const context = React.useContext(TabsContext);

  if (context === undefined) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }

  return context;
};

export {useTabsContext, TabsProvider};
