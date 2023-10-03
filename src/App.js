import classes from './App.module.scss';
import Header from './components/Header/Header.js';
import Login from './components/Login/Login.js';
import NewGame from './components/New Game/NewGame.js';
import Logged from './components/Logged/Logged.js';

import {ModalBoxProvider} from './components/UI/ModalBox/useModalBox.js';
import {useState} from 'react';

// TODO WORK ON A RULES AND HOW THE APP WORKS SECTION

function App() {
    // const testingAccLog = '-NfYofx5Gu2nraTQTsBZ';
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
                return <NewGame loginHandler={loginHandler} logoutHandler={logoutHandler} />;
            case 'logged':
                return <Logged gameID={gameID} logoutHandler={logoutHandler} />;
            default:
                return <Login newGameHandler={newGameHandler} loginHandler={loginHandler} />;
        }
    }

    // --------------------- APP COMPONENT OUTPUT --------------------- //

    return (
        <ModalBoxProvider>
            <div className={classes.app}>
                {/* <ModalBox /> */}
                <Header logoutHandler={logoutHandler} />
                <AppScreenEl />
            </div>
        </ModalBoxProvider>
    );
}

export default App;
