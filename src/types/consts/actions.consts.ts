import {setBoardState, setCurrentElement, updateElementPropsCache} from '../../store/actions/boardActions';
import {setSchemeData, setSchemeElements, setSchemeName, setSchemeWires} from '../../store/actions/schemeDataActions';

export enum ACTIONS_ENUM {
  SET_BOARD_STATE = 'SET_BOARD_STATE',
  SET_SCHEME_NAME = 'SET_SCHEME_NAME',
  SET_SCHEME_WIRES = 'SET_SCHEME_WIRES',
  SET_SCHEME_ELEMENTS = 'SET_SCHEME_ELEMENTS',
  UPDATE_ELEMENT_PROPS_CACHE = 'UPDATE_ELEMENT_PROPS_CACHE',
  BOARD_RESIZE = 'BOARD_RESIZE',
  UPDATE_SCHEME_DATA = 'UPDATE_SCHEME_DATA',
  TOGGLE_LOADING = 'TOGGLE_LOADING',
  SHOW_NOTICE = 'SHOW_NOTICE',
  TOGGLE_GDRIVE_POPUP = 'TOGGLE_GDRIVE_POPUP',
  TOGGLE_FILE_BROWSER = 'TOGGLE_FILE_BROWSER',
  SET_CURRENT_ELEMENT = 'SET_CURRENT_ELEMENT',
  MODELING_OFF = 'MODELING_OFF'
}

export type StoreAction = ReturnType<typeof setBoardState>
  | ReturnType<typeof setCurrentElement>
  | ReturnType<typeof setSchemeData>
  | ReturnType<typeof setSchemeName>
  | ReturnType<typeof setSchemeElements>
  | ReturnType<typeof setSchemeWires>
  | ReturnType<typeof updateElementPropsCache>;
