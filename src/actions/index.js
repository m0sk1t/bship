import * as type from './types';

export const makeShot = (x, y, hit) => ({
  x,
  y,
  hit,
  type: type.MAKE_SHOT,
});

export const addShip = (ship, positions) => ({
  ship,
  positions,
  type: type.ADD_SHIP,
});

export const sinkShip = (iShip) => ({
  iShip,
  type: type.SINK_SHIP,
});

export const sinkShipPart = (iShip, iPos) => ({
  iPos,
  iShip,
  type: type.SINK_SHIP_PART,
});

export const gameOver = (over) => ({
  over,
  type: type.GAME_OVER,
});

export const gameReset = () => ({
  type: type.GAME_RESET,
});