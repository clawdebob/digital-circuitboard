import {createStore} from '@reduxjs/toolkit';
import {rootReducer} from './rootReducer';

const store = createStore(rootReducer);

export default store;
