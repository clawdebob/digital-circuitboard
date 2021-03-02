import React from 'react';
import './action-panel.scss';
import {BOARD_STATES_ENUM, BoardState} from '../../types/consts/boardStates.consts';
import {useDispatch} from 'react-redux';
import {setBoardState} from '../../store/actions/boardActions';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';

enum PANEL_ACTION_ENUM {
  SET_BOARD_STATE = 'SET_BOARD_STATE',
  CREATE_ELEMENT = 'CREATE_ELEMENT'
}

interface PanelAction {
  name: string;
  icon: string;
  title: string;
  type: PANEL_ACTION_ENUM;
  state?: BoardState;
}


const MENU_ACTIONS: Array<PanelAction> = [
  {name: BOARD_STATES_ENUM.EDIT, icon: 'vaadin:cursor', title: 'action.edit', type: PANEL_ACTION_ENUM.SET_BOARD_STATE, state: BOARD_STATES_ENUM.EDIT},
  {name: BOARD_STATES_ENUM.INTERACT, icon: 'fa:hand-pointer-o', title: 'action.interact', type: PANEL_ACTION_ENUM.SET_BOARD_STATE, state: BOARD_STATES_ENUM.INTERACT},
  {name: 'create-button', icon: 'twemoji:black-square-button', title: 'action.create-button', type: PANEL_ACTION_ENUM.CREATE_ELEMENT},
  {name: 'create-outContact', icon: 'fxemoji:radiobutton', title: 'action.create-out-contact', type: PANEL_ACTION_ENUM.CREATE_ELEMENT},
];

const ActionPanel = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const execAction = (action: PanelAction) => {
    switch (action.type) {
      case PANEL_ACTION_ENUM.CREATE_ELEMENT:
        break;
      case PANEL_ACTION_ENUM.SET_BOARD_STATE:
        if (action.state) {
          dispatch(setBoardState(action.state));
        }
        break;
      default:
        break;
    }
  };

  const actions = _.map(MENU_ACTIONS, action => (
    <div
      className={`action-panel__action ${action.name}`}
      key={action.name}
      title={t(action.title)}
      onClick={() => execAction(action)}
    >
      <div
        className="iconify"
        data-icon={action.icon}
      />
    </div>
  ));

  return (
    <div className="action-panel">
      {actions}
    </div>
  );
};

export default ActionPanel;
