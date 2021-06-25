import React from 'react';
import './App.scss';
import Board from './containers/board/board';
import * as _ from 'lodash';
import MainMenu from './containers/main-menu/main-menu';
import SideMenu from './containers/side-menu/side-menu';
import ActionPanel from './containers/action-panel/action-panel';
import Popup from './containers/popup/popup';
import {Switch, Route, useHistory} from 'react-router-dom';
import TabGroup from './containers/tabs/tabGroup';

function App(): React.ReactElement {
  const history = useHistory();

  const MAIN_MENU_OPTIONS = [
    {
      name: 'main-menu.file',
      subOptions: [
        {name: 'main-menu.options.file.new', action: _.noop},
        {name: 'main-menu.options.file.open', action: _.noop},
        {name: 'main-menu.options.file.save', action: _.noop},
      ]
    },
    {
      name: 'Google Drive',
      subOptions: [
        {name: 'gdrive.manage', action: () => history.push('/auth')},
        {name: 'main-menu.options.file.open', action: () => history.push('/g-drive')},
        {name: 'main-menu.options.file.save', action: () => history.push('/g-drive')}
      ]
    },
    {
      name: 'main-menu.export',
      subOptions: [
        {name: 'main-menu.options.save-as-svg', action: _.noop},
        {name: 'main-menu.options.save-as-png', action: _.noop},
      ]
    },
  ];

  const closePopup = () => {
    history.push('/');
  };

  return (
    <div className="app">
      <MainMenu options={MAIN_MENU_OPTIONS}/>
      <ActionPanel/>
      <div className="drawing-area">
        <SideMenu/>
        <Board/>
      </div>
      <Switch>
        <Route path="/g-drive">
          <Popup close={closePopup} isVisible={true}>
            <h1>Disk FS</h1>
          </Popup>
        </Route>
        <Route path="/auth">
          <Popup close={closePopup} isVisible={true}>
            <h1>Auth</h1>
            <TabGroup>
              <TabGroup.Tab id="tab-1" label="tab-1">
                <span>Link</span>
              </TabGroup.Tab>
              <TabGroup.Tab id="tab-2" label="tab-2">
                <p onClick={() => console.log('click')}>Statement</p>
              </TabGroup.Tab>
            </TabGroup>
          </Popup>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
