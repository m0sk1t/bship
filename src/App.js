import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import './App.css';
import logo from './logo.svg';
import Field from './components/Field';
import {
  addShip,
  gameOver,
  gameReset,
  makeShot,
  sinkShip,
  sinkShipPart,
} from './actions';


const mapStateToProps = (state) => ({
  game: state.game,
  field: state.field,
  ships: state.ships,
});
const mapDispatchToProps = (dispatch) => ({
  gameOver: () => dispatch(gameOver()),
  gameReset: () => dispatch(gameReset()),
  sinkShip: (iShip) => dispatch(sinkShip(iShip)),
  makeShot: (x, y, hit) => dispatch(makeShot(x, y, hit)),
  addShip: (ship, positions) => dispatch(addShip(ship, positions)),
  sinkShipPart: (iShip, iPos) => dispatch(sinkShipPart(iShip, iPos)),
});


class App extends Component {
  componentDidMount() {
    // FIXME: algo for ship placement
    this.generateShips();
  }

  checkHit = (x, y) => {
    const { ships, gameOver, sinkShip, sinkShipPart } = this.props;
    let hit = false;
    ships.layout  
      .map((ship, iShip) => ship.positions.map((pos, iPos) => {
        if (pos[0] === x && pos[1] === y) {
          hit = true;
          if (ship.positions.length === 1) sinkShip(iShip)
          sinkShipPart(iShip, iPos);
        }
      }));
    if (this.isGameOver()) gameOver();
    return hit;
  }

  getRandomCoord = () => {
    return {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      direction: Math.floor(Math.random() * 2)? 'row': 'col',
    };
  }

  getShipBoundaries = (field, coord, shipSize) => {
    let boundaries = [];
    let rowBoundary = 0, colBoundary = 0;
    const fieldLength = field.length;
    const fromX = coord.x ? coord.x - 1 : coord.x;
    const fromY = coord.y ? coord.y - 1 : coord.y;
    switch (coord.direction) {
      case 'row': {
        if ((shipSize + coord.x) - fieldLength >= 0) return [];
        rowBoundary = coord.y + 1;
        colBoundary = coord.x + shipSize;
      }
      case 'col': {
        if ((shipSize + coord.y) - fieldLength >= 0) return [];
        rowBoundary = coord.y + shipSize;
        colBoundary = coord.x + 1;
      }
    }
    for (let row = fromY; row < rowBoundary; row++) {
      if (row === fieldLength) break;
      for (let col = fromX; col < colBoundary; col++) {
        if (col === fieldLength) break;
        boundaries.push([row, col]);
      }
    }
    return boundaries;
  }

  checkIntersections = (field, coord, shipSize) => {
    const ship = [];
    const shipBoundaries = this.getShipBoundaries(field, coord, shipSize);
    if (!shipBoundaries.length) return [];
    for (let b = 0, l = shipBoundaries.length; b < l; b++) {
      if (field[shipBoundaries[b][0]][shipBoundaries[b][1]]) return [];
    }
    switch (coord.direction) {
      case 'row': {
        for (let row = coord.y; row < coord.y + shipSize; row++) {
          field[coord.y][row] = 1;
          ship.push([coord.y, row]);
        }
        return ship;
      }
      case 'col': {
        for (let col = coord.y; col < coord.y + shipSize; col++) {
          field[col][coord.x] = 1;
          ship.push([col, coord.x]);
        }
        return ship;
      }
      default:
        return [];
    }
  }

  generateShips = () => {
    const { addShip } = this.props;
    const { shipTypes } = this.props.ships;
    const array10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const field = array10.map((y) => array10.map((x) => 0));

    Object.keys(shipTypes)
      .map(shipType => {
        let amount = shipTypes[shipType].count;
        const shipSize = shipTypes[shipType].size;
        while (amount--) {
          let shipBody = this.checkIntersections(field, this.getRandomCoord(), shipSize);
          while (!shipBody.length) {
            shipBody = this.checkIntersections(field, this.getRandomCoord(), shipSize);
          }
          addShip(shipType, shipBody);
        }
      });
    console.log(
      field
        .map(row => `${row.map(cell => cell ? '*' : '-').join('')}\n`).join('')
    );
  }

  isGameOver = () => {
    const { ships } = this.props;
    return ships.layout.map(ship => ship.positions.length).reduce((a, b) => a + b) === 0;
  }

  render() {
    const { game, field, makeShot, gameReset } = this.props;
    return (
      <div className="App">
        <div className="game-over" style={{ display: game.over? "flex": "none" }}>
          Game over
          {/* FIXME: dispatch gameReset when if figure out where initialState mutating */}
          <button onClick={() => gameReset()}>
            refresh
          </button>
        </div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ReactBattleShip game</h1>
        </header>

        <Field field={field} onClick={(x, y) => makeShot(x, y, this.checkHit(x, y))} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
