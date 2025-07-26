import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './Components/Topbar';
import LoginModal from './Components/LoginModal';
import Index from './Routes/Index';
import Play from './Routes/Play';
import './App.css';

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Topbar onLoginClick={() => setShowModal(true)} />

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      <div className="content">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </div>
    </>
  );
}

