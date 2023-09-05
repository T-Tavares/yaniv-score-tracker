import classes from './App.module.scss';
import Header from './components/Header/Header.js';
import Login from './components/Login/Login.js';
import NewGame from './components/New Game/NewGame.js';
import Game from './components/Game/Game.js';

import {useEffect, useState} from 'react';

function App() {
    const [appScreen, setAppScreen] = useState('');
    const [gameID, setGameID] = useState('');

    // --------------------------- HANDLERS --------------------------- //

    const newGameHandler = () => setAppScreen('new game');
    const loginHandler = retrievedID => {
        setAppScreen('logged');
        setGameID(retrievedID);
    };

    const logoutHandler = () => {
        setAppScreen('');
        setGameID('');
    };

    // ---------- BUILDING SCREEN COMPONENT TO BE RENDERED  ----------- //

    function AppScreenEl() {
        switch (appScreen) {
            case 'new game':
                return <NewGame loginHandler={loginHandler} />;
            case 'logged':
                return <Game gameID={gameID} />;
            default:
                return <Login newGameHandler={newGameHandler} loginHandler={loginHandler} />;
        }
    }

    // --------------------- APP COMPONENT OUTPUT --------------------- //

    return (
        <div className={classes.app}>
            <Header logoutHandler={logoutHandler} />
            <AppScreenEl />
        </div>
    );
}

export default App;
