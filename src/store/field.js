import { MAKE_SHOT, GAME_RESET } from '../actions/types';

const array10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const initialState = array10.map((y) => array10.map((x) => ({ x: x, y: y })));

const field = (state = initialState, action) => {
  switch (action.type) {
    case MAKE_SHOT: {
      const newState = [...state];
      newState[action.y][action.x][action.hit? "hit": "miss"] = true;
      return newState;
    }
    case GAME_RESET:
      return initialState;
    default:
      return state;
  }
}

export default field;