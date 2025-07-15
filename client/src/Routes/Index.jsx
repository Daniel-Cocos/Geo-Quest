import React from 'react';
import './Index.css';
import Logo from '../assets/logo.png'
import Menu from '../Components/Menu';

function Index() {
    return (
        <div className='index-div'>
            <img src={Logo} alt="Globe"  width="500" height="500" /><br />
            <Menu />
        </div>
    );
}

export default Index;
