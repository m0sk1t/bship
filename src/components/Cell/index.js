import React from 'react';
import PropTypes from 'prop-types';

import './cell.css';


const Cell = ({ cell, onClick }) => {
  const classNames = ["cell"];
  cell.hit && classNames.push("hit");
  cell.miss && classNames.push("miss");
  return (
    <div
      onClick={() => onClick(cell.x, cell.y)}
      className={classNames.join(" ")}
    >
      {`${cell.y}, ${cell.x}`}
    </div>
  );
};

export default Cell;