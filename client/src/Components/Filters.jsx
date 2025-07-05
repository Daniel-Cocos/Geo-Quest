import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const Filters = () => {
  const [unit, setUnit] = useState('miles');
  const [slider1Left, setSlider1Left] = useState(0);
  const [slider1Right, setSlider1Right] = useState(10);
  const [slider2Left, setSlider2Left] = useState(0);
  const [slider2Right, setSlider2Right] = useState(10);

  const handleToggleChange = () => {
    setUnit(unit === 'miles' ? 'kilometers' : 'miles');
  };

  useEffect(() => {}, []);

  return (
    <div>
      <form>
        <header>
          <button
            type="button"
            onClick={() => window.location.href = '/rules'}
            className="header-button"
          >
            How it works
          </button>

          <Link to="/" className="header-button">
            Play
          </Link>

          <button
            type="button"
            onClick={() => window.location.href = '/filters'}
            className="header-button-selected"
          >
            Filters
          </button>
        </header>

        <div className="unit-toggle">
          <label className="switch">
            <input
              type="checkbox"
              id="unitToggle"
              name="unit"
              value="kilometers"
              checked={unit === 'kilometers'}
              onChange={handleToggleChange}
            />
            <span className="slider-switch round"></span>
          </label>
          <span id="unitLabel" style={{ marginLeft: '2px' }}>
            {unit === 'kilometers' ? 'Kilometers' : 'Miles'}
          </span>
        </div>

        <div className="slider-container">
          <input
            type="range"
            name="slider1_left"
            min="1"
            max="10"
            value={slider1Left}
            onChange={(e) => setSlider1Left(Number(e.target.value))}
            className="left-range"
          />
          <input
            type="range"
            name="slider1_right"
            min="1"
            max="10"
            value={slider1Right}
            onChange={(e) => setSlider1Right(Number(e.target.value))}
            className="right-range"
          />
          <div className="slider">
            <div className="track"></div>
            <div className="range"></div>
            <div className="thumb left"></div>
            <div className="thumb right"></div>
          </div>
        </div>

        <div className="slider-container">
          <input
            type="range"
            name="slider2_left"
            min="1"
            max="10"
            value={slider2Left}
            onChange={(e) => setSlider2Left(Number(e.target.value))}
            className="left-range"
          />
          <input
            type="range"
            name="slider2_right"
            min="1"
            max="10"
            value={slider2Right}
            onChange={(e) => setSlider2Right(Number(e.target.value))}
            className="right-range"
          />
          <div className="slider">
            <div className="track"></div>
            <div className="range"></div>
            <div className="thumb left"></div>
            <div className="thumb right"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filters;

