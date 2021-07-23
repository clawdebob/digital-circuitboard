import {ACTIONS_ENUM} from '../../types/consts/actions.consts';
import {SchemeDataState} from '../consts/schemeDataStates.consts';
import {Wire} from '../../elements/Wire/wire';
import {DcbElement} from '../../elements/dcbElement';

export const setSchemeData = (data: SchemeDataState) => ({
  type: ACTIONS_ENUM.UPDATE_SCHEME_DATA,
  payload: data
} as const);

export const setSchemeName = (name: string) => ({
  type: ACTIONS_ENUM.SET_SCHEME_NAME,
  name,
} as const);

export const setSchemeWires = (wires: Array<Wire>) => ({
  type: ACTIONS_ENUM.SET_SCHEME_WIRES,
  wires,
} as const);

export const setSchemeElements = (elements: Array<DcbElement>) => ({
  type: ACTIONS_ENUM.SET_SCHEME_ELEMENTS,
  elements,
} as const);
