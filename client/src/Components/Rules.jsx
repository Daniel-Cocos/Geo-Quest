import React from 'react';
import Header from './Header';
import '../style.css';

const Rules = () => {
  return (
    <div>
      <Header />

      <div className="flexbox-container rules-container-1">
        <div className="flexbox-item flexbox-item-1">text text</div>
        <div className="flexbox-item flexbox-item-1"></div>
      </div>
      <div className="flexbox-container rules-container-2">
        <div className="flexbox-item flexbox-item-1">text text</div>
        <div className="flexbox-item flexbox-item-1"></div>
        <div className="flexbox-item flexbox-item-1"></div>
        <div className="flexbox-item flexbox-item-1"></div>
      </div>
      <div className="flexbox-container rules-container-3">
        <div className="flexbox-item flexbox-item-1">text text</div>
        <div className="flexbox-item flexbox-item-1"></div>
        <div className="flexbox-item flexbox-item-1"></div>
      </div>
    </div>
  );
};

export default Rules;
