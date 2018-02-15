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
  gameReset: () => dispatch(gameReset()),
  gameOver: (over) => dispatch(gameOver(over)),
  sinkShip: (iShip) => dispatch(sinkShip(iShip)),
  makeShot: (x, y, hit) => dispatch(makeShot(x, y, hit)),
  addShip: (ship, positions) => dispatch(addShip(ship, positions)),
  sinkShipPart: (iShip, iPos) => dispatch(sinkShipPart(iShip, iPos)),
});


class App extends Component {
  componentDidMount() {
    // FIXME: algo for ship placement
    // this.generateShips();
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
    if (this.isGameOver()) gameOver(true);
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
    const fromX = coord.x ? coord.x - 1 : coord.x;
    const fromY = coord.y ? coord.y - 1 : coord.y;
    let toX = null;
    let toY = null;
    if ((shipSize + coord.x) - field.length < 0 && (shipSize + coord.y) - field.length < 0) {
      switch (coord.direction) {
        case 'row':
          if (fromX) {
            if (fromX + shipSize === field.length - 1) {
              toX = fromX + shipSize;
            }
          } else {
            toX = fromX + shipSize + 1;
          }
          if (fromY) {
            if (fromY === field.length - 2) {
              toY = fromY+ 1;
            }
          } else {
            toY = fromY + 2;
          }
          break;
        case 'col':
          if (fromY) {
            if (fromY + shipSize === field.length - 1) {
              toY = fromY + shipSize;
            }
          } else {
            toY = fromY + shipSize + 1;
          }
          if (fromX) {
            if (fromX === field.length - 2) {
              toX = fromX + 1;
            }
          } else {
            toX = fromX + 2;
          }
          break;
        default:
          return;
      }
      return {
        toX,
        toY,
        fromX,
        fromY,
      }
    }
    return false;
  }

  checkIntersections = (field, coord, shipSize) => {
    const ship = [];
    const shipBoundaries = this.getShipBoundaries(field, coord, shipSize);
    if (!shipBoundaries) return [];
    switch (coord.direction) {
      case 'row': {
        for (let row = shipBoundaries.fromY; row < shipBoundaries.toY; row++) {
          for (let col = shipBoundaries.fromX; col < shipBoundaries.toX; col++) {
            if (field[row][col]) return [];
          }
        }
        for (let row = coord.y; row < coord.y + shipSize; row++) {
          field[coord.y][row] = 1;
          ship.push([coord.y, row]);
        }
        return ship;
      }
      case 'col': {
        for (let row = shipBoundaries.fromY; row < shipBoundaries.toY; row++) {
          for (let col = shipBoundaries.fromX; col < shipBoundaries.toX; col++) {
            if (field[row][col]) return [];
          }
        }
        for (let col = coord.y; col < coord.y + shipSize; col++) {
          field[col][coord.x] = 1;
          ship.push([col, coord.x]);
        }
        return ship;
      }
      default:
        break;
    }
  }

  generateShips = () => {
    const { addShip } = this.props;
    const { shipTypes } = this.props.ships;
    const array10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let field = array10.map((y) => array10.map((x) => 0));

    Object.keys(shipTypes)
      .map(ship => {
        let amount = shipTypes[ship].count;
        const shipSize = shipTypes[ship].size;
        let shipBody = this.checkIntersections(field, this.getRandomCoord(), shipSize);
        while (!shipBody.length) {
          shipBody = this.checkIntersections(field, this.getRandomCoord(), shipSize);
        }
        addShip(ship, shipBody);
      });
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
          <button onClick={() => window.location.reload()}>
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
