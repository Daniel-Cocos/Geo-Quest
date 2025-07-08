import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <button
        onClick={() => navigate('/rules')}
        className={isActive('/rules') ? 'header-button-selected' : 'header-button'}
      >
        How it works
      </button>
      <button
        onClick={() => navigate('/')}
        className={isActive('/') ? 'header-button-selected' : 'header-button'}
      >
        Play
      </button>
      <button
        onClick={() => navigate('/filters')}
        className={isActive('/filters') ? 'header-button-selected' : 'header-button'}
      >
        Filters
      </button>
    </header>
  );
};

export default Header;
