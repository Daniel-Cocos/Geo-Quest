import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, NotebookText } from 'lucide-react';
import SettingsPopup from './SettingsPopup';
import RulesPopup from './RulesPopup';
import axios from 'axios';
import './Menu.css';

function Menu() {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [loginHint, setLoginHint] = useState(false);

    const Play = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/api/check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/play');
        } catch {
            setLoginHint(true);
        }
    };

    return (
        <div className="menu-container">
            <div className="menu">
                <button className="play-btn" onClick={Play}>Play</button>
                <button className="icon-btn" onClick={() => setShowSettings(true)}>
                    <Settings size={20} />
                </button>
                <button className="icon-btn" onClick={() => setShowRules(true)}>
                    <NotebookText size={20} />
                </button>
            </div>

            {loginHint && <p className="login-hint">You must be logged in to play.</p>}

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

