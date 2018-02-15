import React from 'react';
import PropTypes from 'prop-types';

import './field.css';
import Cell from '../Cell';


const Field = ({ field, onClick }) => (
  <div className="field">
    {field.map(row => row.map(cell => <Cell onClick={onClick} key={cell.x + cell.y} cell={cell} />))}
  </div>
);

export default Field;