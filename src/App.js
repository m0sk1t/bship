import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import './App.css';
import logo from './logo.svg';
import Field from './components/Field';
import { gameOver, makeShot, sinkShip, sinkShipPart } from './actions';


const mapStateToProps = (state) => ({
  game: state.game,
  field: state.field,
  ships: state.ships,
});
const mapDispatchToProps = (dispatch) => ({
  gameOver: (over) => dispatch(gameOver(over)),
  sinkShip: (iShip) => dispatch(sinkShip(iShip)),
  makeShot: (x, y, hit) => dispatch(makeShot(x, y, hit)),
  sinkShipPart: (iShip, iPos) => dispatch(sinkShipPart(iShip, iPos)),
});


class App extends Component {
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

  generateShips = () => {
    const { shipTypes } = this.props.ships;
    const array10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const field = array10.map((y) => array10.map((x) => 0));

    getRandomCoord = () => {
      return {
        x: Math.floor((Math.random() * 10) - 1),
        y: Math.floor((Math.random() * 10) - 1),
        direction: Math.floor(Math.random() * 2),
      };
    }

    checkIntersections = (coord, shipSize) => {
      const x = coord.x ? coord.x - 1 : coord.x;
      const y = coord.y ? coord.y - 1 : coord.y;
      const ship = [];
      switch (coord.direction) {
        case 0: {
          if ((shipSize + coord.x) - field.length < 0) {
          }
          return []
        }
        case 1:
          if ((shipSize + coord.y) - field.length < 0) {
          }
          return []
        default:
          break;
      }
    }

    Object.keys(shipTypes)
      .map(key => {
        let amount = shipTypes[key].count;
        const shipSize = shipTypes[key].size;

      });
  }

  isGameOver = () => {
    const { ships } = this.props;
    return ships.layout.map(ship => ship.positions.length).reduce((a, b) => a + b) === 0;
  }

  render() {
    const { game, field, makeShot } = this.props;
    return (
      <div className="App">
        <div className="game-over" style={{ display: game.over? "flex": "none" }}>
          Game over
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
