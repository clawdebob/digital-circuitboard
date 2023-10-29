import React from 'react';
import './App.scss';
import Board from './containers/board/board';
import * as _ from 'lodash';
import MainMenu from './containers/main-menu/main-menu';
import SideMenu from './containers/side-menu/side-menu';
import ActionPanel from './containers/action-panel/action-panel';
import Popup from './containers/popup/popup';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {FileManager} from './utils/fileManager';
import FileInput from './containers/file-input/file-input';

function App(): React.ReactElement {
  const navigate = useNavigate();

  const MAIN_MENU_OPTIONS = [
    {
      name: 'main-menu.file',
      subOptions: [
        {name: 'main-menu.options.file.new', action: () => FileManager.newFile()},
        {name: 'main-menu.options.file.open', action: () => FileManager.openFile()},
        {name: 'main-menu.options.file.save', action: () => FileManager.saveFile()},
      ]
    },
    {
      name: 'Google Drive',
      subOptions: [
        {name: 'gdrive.manage', action: () => navigate('/auth')},
        {name: 'main-menu.options.file.open', action: () => navigate('/g-drive')},
        {name: 'main-menu.options.file.save', action: () => navigate('/g-drive')}
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
    navigate('/');
  };

  return (
    <div className="app">
      <MainMenu options={MAIN_MENU_OPTIONS}/>
      <ActionPanel/>
      <div className="drawing-area">
        <SideMenu/>
        <Board/>
      </div>
      <Routes>
        <Route
          path="/"
          element={<></>}
        >
        </Route>
        <Route
          path="/g-drive"
          element={
            <Popup close={closePopup} isVisible={true}>
              <h1>Disk FS</h1>
            </Popup>
          }
        >
        </Route>
        <Route
          path="/auth"
          element={
            <Popup close={closePopup} isVisible={true}>
              <h1>Auth</h1>
            </Popup>
          }
        >
        </Route>
      </Routes>
      <FileInput/>
    </div>
  );
}

export default App;
