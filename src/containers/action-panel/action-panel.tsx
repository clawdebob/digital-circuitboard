import React from 'react';
import './action-panel.scss';
import {BOARD_STATES_ENUM, BoardState} from '../../store/consts/boardStates.consts';
import {useDispatch} from 'react-redux';
import {setBoardState, setCurrentElement} from '../../store/actions/boardActions';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {DcbElementName, ELEMENT} from '../../types/consts/element.consts';
import elementBuilder from '../../utils/elementBuilder';

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
  element?: DcbElementName;
}


const MENU_ACTIONS: Array<PanelAction> = [
  {name: BOARD_STATES_ENUM.EDIT, icon: 'vaadin:cursor', title: 'action.edit', type: PANEL_ACTION_ENUM.SET_BOARD_STATE, state: BOARD_STATES_ENUM.EDIT},
  {name: BOARD_STATES_ENUM.INTERACT, icon: 'fa:hand-pointer-o', title: 'action.interact', type: PANEL_ACTION_ENUM.SET_BOARD_STATE, state: BOARD_STATES_ENUM.INTERACT},
  {name: 'create-button', icon: 'twemoji:black-square-button', title: 'action.create-button', type: PANEL_ACTION_ENUM.CREATE_ELEMENT, element: ELEMENT.BUTTON},
  {name: 'create-outContact', icon: 'fxemoji:radiobutton', title: 'action.create-out-contact', type: PANEL_ACTION_ENUM.CREATE_ELEMENT, element: ELEMENT.OUT_CONTACT},
];

const ActionPanel = (): React.ReactElement => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const execAction = (action: PanelAction) => {
    switch (action.type) {
      case PANEL_ACTION_ENUM.CREATE_ELEMENT:
        if (action.element) {
          const create = elementBuilder.getCreateFuncByName(action.element);

          dispatch(setCurrentElement(create()));
          dispatch(setBoardState(BOARD_STATES_ENUM.CREATE));
        }
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
