import {BOARD_STATES_ENUM, StoreBoardState} from '../../types/consts/boardStates.consts';
import {ACTIONS_ENUM, StoreAction} from '../../types/consts/actions.consts';

const initialState: StoreBoardState = {
  boardState: BOARD_STATES_ENUM.EDIT,
  currentElement: null,
  propsCache: {},
};

const boardReducer = (state: StoreBoardState = initialState, action: StoreAction): StoreBoardState => {
  switch (action.type) {
    case ACTIONS_ENUM.SET_BOARD_STATE:
      return {
        ...state,
        boardState: action.payload
      };
    case ACTIONS_ENUM.SET_CURRENT_ELEMENT:
      return {
        ...state,
        currentElement: action.element
      };
    case ACTIONS_ENUM.UPDATE_ELEMENT_PROPS_CACHE:
      return {
        ...state,
        propsCache: {
          ...state.propsCache,
          [action.element.name]: {
            props: action.element.props,
            dimensions: action.element.dimensions,
            pinInversions: action.element.inPins.map(pin => pin.invert)
          }
        }
      };
    default:
      return state;
  }
};

export default boardReducer;
