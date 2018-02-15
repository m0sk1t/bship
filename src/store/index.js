import {
  createStore,
  combineReducers,
} from 'redux';

import game from './game';
import field from './field';
import ships from './ships';

export default createStore(combineReducers({
  game,
  field,
  ships,
}));