import { SINK_SHIP_PART, GAME_RESET, ADD_SHIP } from '../actions/types';

const initialState = {
  "shipTypes": {
    "carrier": { "size": 5, "count": 1 },
    "battleship": { "size": 4, "count": 1 },
    "cruiser": { "size": 3, "count": 1 },
    "submarine": { "size": 3, "count": 1 },
    "destroyer": { "size": 2, "count": 1 },
  },
  "layout": [
    { "ship": "carrier", "positions": [[2, 9], [3, 9], [4, 9], [5, 9], [6, 9]] },
    { "ship": "battleship", "positions": [[5, 2], [5, 3], [5, 4], [5, 5]] },
    { "ship": "cruiser", "positions": [[8, 1], [8, 2], [8, 3]] },
    { "ship": "submarine", "positions": [[3, 0], [3, 1], [3, 2]] },
    { "ship": "destroyer", "positions": [[0, 0], [1, 0]] }
  ]
};

const ships = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SHIP: {
      const layout = state.layout.concat({
        ship: action.ship,
        positions: action.positions,
      });
      return Object.assign({}, state, { layout });
    }
    case SINK_SHIP_PART: {
      const newState = { ...state };
      newState.layout[action.iShip].positions.splice(action.iPos, 1);
      return newState;
    }
    case GAME_RESET:
      return initialState;
    default:
      return state;
  }
};

export default ships;