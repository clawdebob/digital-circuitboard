import {ACTIONS_ENUM, StoreAction} from '../../types/consts/actions.consts';
import {SchemeDataState} from '../../types/consts/schemeDataStates.consts';

const initialState: SchemeDataState = {
  name: 'Scheme',
  wires: [],
  elements: [],
};

const schemeDataReducer = (state: SchemeDataState = initialState, action: StoreAction): SchemeDataState => {
  switch (action.type) {
    case ACTIONS_ENUM.UPDATE_SCHEME_DATA:
      return action.payload;
    case ACTIONS_ENUM.SET_SCHEME_NAME:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
};

export default schemeDataReducer;
