import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../style.css';

const DualSlider = ({ left, right, min, max, onChange }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(null);

  const calcValue = x => {
    const { left: cx, width } = ref.current.getBoundingClientRect();
    let pct = (x - cx) / width;
    pct = Math.max(0, Math.min(1, pct));
    return Math.round(min + pct * (max - min));
  };

  useEffect(() => {
    const onMove = e => {
      if (!dragging) return;
      const val = calcValue(e.clientX);
      if (dragging === 'left') {
        onChange(Math.min(val, right - 1), right);
      } else {
        onChange(left, Math.max(val, left + 1));
      }
    };
    const onUp = () => setDragging(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [dragging, left, right, min, max, onChange]);

  const leftPct  = ((left  - min) / (max - min)) * 100;
  const rightPct = ((right - min) / (max - min)) * 100;

  return (
    <div ref={ref} className="slider-container">
      <div className="track" />
      <div className="range" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
      <div
        className="thumb left"
        style={{ left: `${leftPct}%` }}
        onMouseDown={() => setDragging('left')}
      >
        {left}
      </div>
      <div
        className="thumb right"
        style={{ left: `${rightPct}%` }}
        onMouseDown={() => setDragging('right')}
      >
        {right}
      </div>
    </div>
  );
};

const Filters = () => {
  const nav = useNavigate();
  const [unit,   setUnit]   = useState('miles');
  const [s1,     setS1]     = useState({ left: 2, right: 8 });
  const [s2,     setS2]     = useState({ left: 2, right: 10 });
  const [loading, setLoading] = useState(true);
  const STORAGE_KEY = 'filters-draft';

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const { unit, slider1, slider2 } = JSON.parse(draft);
        setUnit(unit);
        setS1(slider1);
        setS2(slider2);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/filters', { credentials: 'include' });
        const data = await res.json();
        setUnit(data.unit);
        setS1(data.slider1);
        setS2(data.slider2);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      const draft = JSON.stringify({
        unit,
        slider1: s1,
        slider2: s2,
      });
      localStorage.setItem(STORAGE_KEY, draft);
    }
  }, [unit, s1, s2, loading]);

  const submit = async e => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/filters', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slider1_left:  s1.left,
          slider1_right: s1.right,
          slider2_left:  s2.left,
          slider2_right: s2.right,
          unit,
        }),
      });
      localStorage.removeItem(STORAGE_KEY);
      nav('/');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="loading">Loading filters…</div>;

  return (
    <form onSubmit={submit}>
      <Header />
      <div className="unit-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={unit === 'kilometers'}
            onChange={() => setUnit(u => u === 'miles' ? 'kilometers' : 'miles')}
          />
          <span className="slider-switch round" />
        </label>
        <span>{unit === 'kilometers' ? 'Kilometers' : 'Miles'}</span>
      </div>

      <div className="sliders-wrap">
        <DualSlider min={1} max={10} left={s1.left} right={s1.right} onChange={(l, r) => setS1({ left: l, right: r })} />
        <DualSlider min={1} max={10} left={s2.left} right={s2.right} onChange={(l, r) => setS2({ left: l, right: r })} />
        <button type="submit" className="header-button save-btn">Save</button>
      </div>
    </form>
  );
};

export default Filters;

