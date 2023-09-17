import React from 'react';

import classes from './NewGame.module.scss';

import {getTimeStampNow} from '../../helpers/Helpers.js';

import Button from '../UI/Button.js';
import Input from '../UI/Input.js';
import PlayersInput from './PlayersInput.js';
import ModalBox from '../UI/ModalBox/ModalBox.js';

import {_addNewGameDB} from '../../database/firebaseUtils.js';
import {useModalBox, modalObjInit, modalMsg} from '../UI/ModalBox/useModalBox.js';

export default function NewGame(props) {
    const {modal, setModal} = useModalBox();

    const newGameHandler = e => {
        e.preventDefault();

        // ---------------------- GET INPUTS VALUES ----------------------- //
        const inputs = [...e.target.querySelectorAll('input')];

        // --------------------- CREATING GAME OBJECT --------------------- //
        // ---------------------- GAME OBJECT INIT() ---------------------- //

        const newGameObj = {
            gameName: '',
            gamePassword: '',
            stats: {
                lastTimeStamp: Number,

                totalRounds: 0,
                totalSessions: 0,
                totalTime: 0,

                currSession: {
                    sessionID: Number,
                    time: 0,
                    rounds: 0,
                },

                sessions: [],
            },
            players: [],
        };

        // ------------- FEEDING GAME OBJECT WITH USER INPUTS ------------- //

        inputs.forEach((input, index) => {
            // GAMENAME INPUT IS THE FIRST INPUT
            if (index === 0) newGameObj.gameName = input.value;

            // PASSWORD INPUT IS THE LAST INPUT
            if (index === inputs.length - 1) newGameObj.gamePassword = input.value;

            // EVERYTHING IN BETWEEN IS PLAYERS NAMES
            if (index > 0 && index < inputs.length - 1) {
                newGameObj.players.push({
                    playerName: input.value,
                    points: {0: 0},
                });
            }
        });

        // ------------- FEEDING GAME OBJECT WITH TIME STAMPS ------------- //
        // ------------------------- STATS INIT() ------------------------- //

        // Add TimeStamp to NewGame -  CurrSession && lastTimeStamp
        newGameObj.stats.currSession.sessionID = newGameObj.stats.lastTimeStamp = getTimeStampNow();

        // ---------------------------------------------------------------- //
        // ---------------- CHECKING FOR USERS BAD INPUTS ----------------- //
        // ---------------------------------------------------------------- //

        // CHECK FOR UNDERSIZE GAME NAMES
        if (newGameObj.gameName.trim().length <= 2) return setModal({...modalObjInit, ...modalMsg.emptySmallGameName});

        // CHECK FOR OVERSIZED GAME NAMES
        if (newGameObj.gameName.trim().length > 30) return setModal({...modalObjInit, ...modalMsg.bigGameName});

        // CHECK IF ALL PLAYERS WERE NAMED
        if (newGameObj.players.some(player => player.playerName.trim().length === 0))
            return setModal({...modalObjInit, ...modalMsg.emptySmallPlayerName});

        // CHECK PASSWORD
        if (newGameObj.gamePassword.length < 1) return setModal({...modalObjInit, ...modalMsg.emptySmallGamePassword});

        // ---------------------------------------------------------------- //
        // ---------- UPDATING DATABASE AND LOGGING TO NEW GAME ----------- //
        // ---------------------------------------------------------------- //

        new Promise(async (res, rej) => {
            try {
                // -------------------------- UPDATE DB --------------------------- //
                const ID = await _addNewGameDB(newGameObj, newGameObj.gameName);

                // ---------------------- LOGIN TO NEW GAME ----------------------- //

                res(props.loginHandler(ID));
            } catch (err) {
                console.error("Ther's an issue on the New game login", err);
            }
        });
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
