import React from 'react';

import classes from './NewGame.module.scss';

import {getTimeStampNow} from '../../helpers/Helpers.js';

import Button from '../UI/Button.js';
import Input from '../UI/Input.js';
import PlayersInput from './PlayersInput.js';
import ModalBox from '../UI/ModalBox/ModalBox.js';

import {_addNewGameDB, _createNewGame} from '../../database/firebaseUtils.js';
import {useModalBox, modalObjInit, modalMsg} from '../UI/ModalBox/useModalBox.js';

export default function NewGame(props) {
    const {modal, setModal} = useModalBox();

    const newGameHandler = async e => {
        e.preventDefault();

        // ---------------------- GET INPUTS VALUES ----------------------- //

        const inputs = [...e.target.querySelectorAll('input')];
        const gameName = inputs[0].value;
        const gamePassword = inputs[inputs.length - 1].value;
        const gamePlayers = inputs.slice(1, inputs.length - 1).map(player => player.value);

        // ---------------------------------------------------------------- //
        // ---------------- CHECKING FOR USERS BAD INPUTS ----------------- //
        // ---------------------------------------------------------------- //

        // CHECK FOR UNDERSIZE GAME NAMES
        if (gameName.trim().length <= 2) return setModal({...modalObjInit, ...modalMsg.emptySmallGameName});

        // CHECK FOR OVERSIZED GAME NAMES
        if (gameName.trim().length > 30) return setModal({...modalObjInit, ...modalMsg.bigGameName});

        // CHECK IF ALL PLAYERS WERE NAMED
        if (gamePlayers.some(player => player.trim().length === 0))
            return setModal({...modalObjInit, ...modalMsg.emptySmallPlayerName});

        // CHECK PASSWORD
        if (gamePassword.length < 1) return setModal({...modalObjInit, ...modalMsg.emptySmallGamePassword});

        // ---------------------------------------------------------------- //
        // ------------- CREATE NEW GAME AND UPDATE DATABASE -------------- //
        // ---------------------------------------------------------------- //

        const newGameID = await _createNewGame(gameName, gamePassword, gamePlayers);

        if (newGameID === undefined || newGameID === null)
            return setModal({...modalObjInit, ...modalMsg.duplicateGameName});

        props.loginHandler(newGameID);
    };

    // ---------------------------------------------------------------- //
    // --------------------- NewGame.js COMPONENT --------------------- //
    // ---------------------------------------------------------------- //
    return (
        <React.Fragment>
            {modal.state && <ModalBox />}
            <form onSubmit={newGameHandler} className={classes['new-game-form']}>
                <Input data-game-title="gameTitle" label="Game Name" placeholder="Chose your Game Name" />
                <PlayersInput />
                <Input data-game-title="gamePassword" label="Password" placeholder="Chose your Game Password" />

                <Button text="Create New Game" />
            </form>
            <div className={classes.back}>
                <Button callback={props.logoutHandler} text="Cancel" />
            </div>
        </React.Fragment>
    );
}
