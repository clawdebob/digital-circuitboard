import {ACTIONS_ENUM} from '../../types/consts/actions.consts';
import {SchemeDataState} from '../../types/consts/schemeDataStates.consts';

export const setSchemeData = (data: SchemeDataState) => ({
  type: ACTIONS_ENUM.UPDATE_SCHEME_DATA,
  payload: data
} as const);

export const setSchemeName = (name: string) => ({
  type: ACTIONS_ENUM.SET_SCHEME_NAME,
  name,
} as const);
