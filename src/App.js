import classes from './App.module.scss';
import Header from './components/Header/Header.js';
import Login from './components/Login/Login.js';
import NewGame from './components/New Game/NewGame.js';
import Game from './components/Game/Game.js';

import {useState} from 'react';

function App() {
    const [appScreen, setAppScreen] = useState('login');
    const [gameID, setGameID] = useState('');

    // --------------------------- HANDLERS --------------------------- //

    const newGameHandler = () => setAppScreen('new game');
    const loginHandler = retrievedID => {
        setAppScreen('logged');
        setGameID(retrievedID);
    };

    const logoutHandler = () => {
        setAppScreen('login');
        setGameID('');
    };

    // ---------- BUILDING SCREEN COMPONENT TO BE RENDERED  ----------- //
    let appScreenEl;

    switch (appScreen) {
        case 'new game':
            appScreenEl = <NewGame />;
            break;

        case 'logged':
            // WILL BE CHANGED FOR THE GAME SCREEN
            appScreenEl = <Game gameID={gameID} />;
            break;
        default:
            appScreenEl = <Login newGameHandler={newGameHandler} loginHandler={loginHandler} />;
            break;
    }

    // --------------------- APP COMPONENT OUTPUT --------------------- //

    return (
        <div className={classes.app}>
            <Header logoutHandler={logoutHandler} />
            {appScreenEl}
        </div>
    );
}

export default App;
