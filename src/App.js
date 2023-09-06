import classes from './App.module.scss';
import Header from './components/Header/Header.js';
import Login from './components/Login/Login.js';
import NewGame from './components/New Game/NewGame.js';
import Logged from './components/Logged/Logged.js';
// import Game from './components/Game/Game.js';

import {useEffect, useState} from 'react';

function App() {
    const testingAccLog = ['-NdZnfGP2fd89lepPRYv', '-NdZntH7MHYVl4A8PBNZ', '-NdZoSYdEn12zlF5i071'];
    const [appScreen, setAppScreen] = useState('logged');
    const [gameID, setGameID] = useState(testingAccLog[0]);

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
                return <Logged gameID={gameID} />;
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
