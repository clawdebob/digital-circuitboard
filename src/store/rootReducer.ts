import boardReducer from './reducers/boardSlice';
import {combineReducers} from 'redux';
import schemeDataReducer from './reducers/schemeDataSlice';

export const rootReducer = combineReducers({
  board: boardReducer,
  schemeData: schemeDataReducer,
});
