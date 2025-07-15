import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, NotebookText } from 'lucide-react';
import SettingsPopup from './SettingsPopup';
import RulesPopup from './RulesPopup';
import './Menu.css';

function Menu() {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const [showRules, setShowRules] = useState(false);

    return (
        <div className="menu">
            <button className="play-btn" onClick={() => navigate('/play')}>Play</button>
            <button className="icon-btn" onClick={() => setShowSettings(true)}>
                <Settings size={20} />
            </button>

            <button className="icon-btn" onClick={() => setShowRules(true)}>
                <NotebookText size={20} />
            </button>



            {showSettings && (
                <div className="popup-overlay" onClick={() => setShowSettings(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <SettingsPopup />
                    </div>
                </div>
            )}

            {showRules && (
                <div className="popup-overlay" onClick={() => setShowRules(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <RulesPopup />
                    </div>
                </div>
            )}


        </div>
    );
}

export default Menu;
