import React from 'react';
import '../style.css';

const Rules = () => {
  return (
    <div>
      <header>
        <button onClick={() => window.location.href = '/rules'} className="header-button-selected">How it works</button>
        <button onClick={() => window.location.href = '/'} className="header-button">Play</button>
        <button onClick={() => window.location.href = '/filters'} className="header-button">Filters</button>
      </header>

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
