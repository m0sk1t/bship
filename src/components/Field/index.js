import React from 'react';
import PropTypes from 'prop-types';

import './field.css';
import Cell from '../Cell';


const Field = ({ field, onClick }) => (
  <div className="field">
    {field.map(row => row.map(cell => <Cell onClick={onClick} key={cell.x + cell.y} cell={cell} />))}
  </div>
);

Field.propTypes = {
  field: PropTypes.array,
  onClick: PropTypes.func,
};

export default Field;