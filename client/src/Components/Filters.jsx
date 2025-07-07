import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';

const DualSlider = ({ left, right, min, max, onChange }) => {
  const leftPercent = ((left - min) / (max - min)) * 100;
  const rightPercent = ((right - min) / (max - min)) * 100;

  const handleLeftChange = e => onChange(Math.min(+e.target.value, right - 1), right);
  const handleRightChange = e => onChange(left, Math.max(+e.target.value, left + 1));

  return (
    <div className="slider-container" style={{ position: 'relative', width: '300px', height: '30px' }}>
      <div className="slider" style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <div className="track" />
        <div className="range" style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }} />
        <div className="thumb left" style={{ left: `${leftPercent}%` }}>{left}</div>
        <div className="thumb right" style={{ left: `${rightPercent}%` }}>{right}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={left}
        onChange={handleLeftChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          zIndex: 3,
          cursor: 'pointer'
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={right}
        onChange={handleRightChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          zIndex: 2,
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

const Filters = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState('miles');
  const [slider1, setSlider1] = useState({ left: 2, right: 8 });
  const [slider2, setSlider2] = useState({ left: 2, right: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('http://localhost:5000/api/filters', { credentials: 'include' });
        const data = await res.json();
        setSlider1(data.slider1);
        setSlider2(data.slider2);
        setUnit(data.unit);
      } catch {} finally { setLoading(false); }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      slider1_left: slider1.left,
      slider1_right: slider1.right,
      slider2_left: slider2.left,
      slider2_right: slider2.right,
      unit,
    };
    await fetch('http://localhost:5000/api/filters', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    navigate('/');
  };

  if (loading) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <header>
          <button type="button" onClick={() => navigate('/rules')} className="header-button">How it works</button>
          <Link to="/" className="header-button">Play</Link>
          <button type="button" className="header-button-selected">Filters</button>
        </header>
        <div className="unit-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={unit === 'kilometers'}
              onChange={() => setUnit(u => u === 'miles' ? 'kilometers' : 'miles')}
            />
            <span className="slider-switch round" />
          </label>
          <span style={{ marginLeft: '2px' }}>{unit === 'kilometers' ? 'Kilometers' : 'Miles'}</span>
        </div>
        <DualSlider min={1} max={10} left={slider1.left} right={slider1.right} onChange={(l, r) => setSlider1({ left: l, right: r })} />
        <DualSlider min={1} max={10} left={slider2.left} right={slider2.right} onChange={(l, r) => setSlider2({ left: l, right: r })} />
      </form>
    </div>
  );
};

export default Filters;
