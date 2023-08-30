import classes from './App.module.scss';

import Header from './components/Header/Header';
import Login from './components/Login/Login';
import NewGame from './components/New Game/NewGame';

import {useState} from 'react';

function App() {
    const [appScreen, setAppScreen] = useState('login');

    // HANDLERS
    const newGameHandler = e => {
        e.preventDefault();
        setAppScreen('new game');
    };

    const loginPassHandler = e => {
        e.preventDefault();
        const passcode = e.target.querySelector('input').value;
        console.log('checking your password: ' + passcode);
        e.target.querySelector('input').value = '';
    };

    // BUILDING SCREEN ELEMENT TO BE RENDERED
    let appScreenEl;

    switch (appScreen) {
        case 'new game':
            appScreenEl = <NewGame />;
            break;

        case 'logged':
            // WILL BE CHANGED FOR THE GAME SCREEN
            appScreenEl = <NewGame />;
            break;
        default:
            appScreenEl = <Login newGameHandler={newGameHandler} loginPassHandler={loginPassHandler} />;
            break;
    }

    return (
        <div className={classes.app}>
            <Header />
            {appScreenEl}
        </div>
    );
}

export default App;
