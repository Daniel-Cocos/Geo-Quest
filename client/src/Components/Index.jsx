import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../style.css';

const FLASK_URL = 'http://127.0.0.1:5000';

const Index = () => {
  const [slider1Left,   setSlider1Left]   = useState(0);
  const [slider1Right,  setSlider1Right]  = useState(10);
  const [slider2Left,   setSlider2Left]   = useState(0);
  const [slider2Right,  setSlider2Right]  = useState(10);
  const [unit,          setUnit]          = useState('miles');
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch(`${FLASK_URL}/api/filters`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSlider1Left(data.slider1.left);
        setSlider1Right(data.slider1.right);
        setSlider2Left(data.slider2.left);
        setSlider2Right(data.slider2.right);
        setUnit(data.unit);
      } catch (err) {
        console.error('Failed to load filters:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  return (
    <div>
      <Header />

      <main style={{ padding: '20px', color: '#fff' }}>
        {loading ? (
          <p>Loading filters…</p>
        ) : error ? (
          <p style={{ color: 'salmon' }}>Error: {error}</p>
        ) : (
          <>
            <h2>Current Filter Settings</h2>
            <p>Slider 1: {slider1Left} – {slider1Right}</p>
            <p>Slider 2: {slider2Left} – {slider2Right}</p>
            <p>Unit: {unit}</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
