import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './Components/Index';
import Rules from './Components/Rules';
import Filters from './Components/Filters';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/filters" element={<Filters />} />
      </Routes>
    </Router>
  );
}

export default App;
