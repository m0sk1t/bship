import { GAME_OVER, GAME_RESET } from '../actions/types';

const initialState = { over: false };

const game = (state = initialState, action) => {
  switch (action.type) {
    case GAME_OVER: {
      return { over: action.over };
    }
    case GAME_RESET:
      return initialState;
    default:
      return state;
  }
}

export default game;