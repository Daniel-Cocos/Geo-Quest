import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Topbar from './Components/Topbar';

import Index from './Routes/Index';
import Play from './Routes/Play';

function App() {
    return (
        <div>
            <Topbar />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/play" element={<Play />} />
            </Routes>
        </div>
    );
}

export default App;
