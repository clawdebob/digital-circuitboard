import React from 'react';
import './App.scss';
import Board from './containers/board/board';
import * as _ from 'lodash';
import MainMenu from './containers/main-menu/main-menu';
import SideMenu from './containers/side-menu/side-menu';
import ActionPanel from './containers/action-panel/action-panel';

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
      {name: 'gdrive.manage', action: _.noop},
      {name: 'main-menu.options.file.open', action: _.noop},
      {name: 'main-menu.options.file.save', action: _.noop}
    ]
  },
  {
    name: 'main-menu.export',
    subOptions: [
      {name: 'main-menu.options.save-as-svg', action: _.noop},
      {name: 'main-menu.options.save-as-png', action: () => console.log('click')},
    ]
  },
];

function App(): React.ReactElement {
  return (
    <div className="app">
      <MainMenu options={MAIN_MENU_OPTIONS}/>
      <ActionPanel/>
      <div className="drawing-area">
        <SideMenu/>
        <Board/>
      </div>
    </div>
  );
}

export default App;
