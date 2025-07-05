import React, { useState, useEffect } from 'react';
import '../style.css';

const Index = () => {
  const [slider1Left, setSlider1Left] = useState(0);
  const [slider1Right, setSlider1Right] = useState(10);
  const [slider2Left, setSlider2Left] = useState(0);
  const [slider2Right, setSlider2Right] = useState(10);
  const [unit, setUnit] = useState('miles');

  useEffect(() => {
  }, []);

  return (
    <div>
      <header>
        <button onClick={() => window.location.href = '/rules'} className="header-button">How it works</button>
        <button onClick={() => window.location.href = '/'} className="header-button-selected">Play</button>
        <button onClick={() => window.location.href = '/filters'} className="header-button">Filters</button>
        <p>Slider 1: {slider1Left} – {slider1Right}</p>
        <p>Slider 2: {slider2Left} – {slider2Right}</p>
        <p>Unit: {unit}</p>
      </header>
    </div>
  );
};

export default Index;
