import {BoardState} from '../consts/boardStates.consts';
import {ACTIONS_ENUM} from '../../types/consts/actions.consts';
import {DcbElement} from '../../elements/dcbElement';

export const setBoardState = (data: BoardState) => ({
  type: ACTIONS_ENUM.SET_BOARD_STATE,
  payload: data
} as const);

export const setCurrentElement = (element: DcbElement | null) => ({
  type: ACTIONS_ENUM.SET_CURRENT_ELEMENT,
  element,
} as const);

export const updateElementPropsCache = (element: DcbElement) => ({
  type: ACTIONS_ENUM.UPDATE_ELEMENT_PROPS_CACHE,
  element,
} as const);
