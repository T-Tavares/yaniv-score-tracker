import React, {useEffect, useState} from 'react';
import classes from './Score.module.scss';
import {
    _fetchLoggedGameData,
    _updateScore,
    _isSessionNew,
    _updateCurrSession,
    _lastTimeStampHandler,
} from '../../../../database/firebaseUtils.js';
import ScoreList from './ScoreList.js';
import ModalBox from '../../../UI/ModalBox/ModalBox.js';
import {useModalBox, modalObjInit, modalMsg} from '../../../UI/ModalBox/useModalBox.js';
import {getTimeStampNow} from '../../../../helpers/Helpers.js';

export default function Score(props) {
    const [scoreData, setScoreData] = useState([]);
    const {modal, setModal} = useModalBox();

    const gameID = props.gameID;

    // ---------------------------------------------------------------- //
    // ---------------------- HANDLER FUNCTIONS ----------------------- //
    // ---------------------------------------------------------------- //

    // ---------------------- HANDLER FUNCTIONS ----------------------- //
    // ---------------------- FETCH DATA FROM DB ---------------------- //

    async function fetchDataHandler() {
        const data = await _fetchLoggedGameData(gameID);
        setScoreData(data.players);
    }

    // ---------------------- HANDLER FUNCTIONS ----------------------- //
    // ----- ADD SCORE TO DB HANDLER AND CHECK FOR LUCKY PLAYERS ------ //

    async function addToScoreHandler(e) {
        e.preventDefault();

        // ----------------------- GET USER INPUTS  ----------------------- //

        const inputsArrEls = [...e.target.querySelectorAll('input')];
        const inputedScoreArr = inputsArrEls.map(inp => +inp.value);

        // --------------- CHECK IF ALL INPUTS ARE NUMBERS ---------------- //

        const areInputsNum = inputedScoreArr.every(input => typeof input === 'number' && input >= 0);
        const areInputsEmpty = inputedScoreArr.every(input => input === 0);
        if (!areInputsNum || areInputsEmpty) return setModal({...modalObjInit, ...modalMsg.wrongInputs});

        // ----------------------- UPDATE DATABASE ------------------------ //
        /* 
            TODO CHECK IF THIS DESCRIPTION MATCHS THE NEW FUNCTION
            _updateScoreDB method will return an array of players if any player
            reach a multiple of 50 / 500 score and gets points deduced.

            If not it'll return 'false'.

            This will be later used to render lucky players names on a modal.

        */
        await _updateScore(gameID, inputedScoreArr);

        // TODO IMPLEMENT MODAL RENDER WHEN PLAYER GET LESS POINTS ( CHECK OBJ RETURNED FROM _scoreRulesCheck - PASS IT TO _updateScore AND SORT HERE)
        // TODO KEEP WORKING ON UPDATED SCORE FUNCTION

        // ---------------------- RERENDER NEW SCORE ---------------------- //
        await fetchDataHandler();

        // -------- IF ANY LUCKY PLAYERS, RENDER CELEBRATION MODAL -------- //
        /* 

            lucky players handler will only render the modal if the luckyPlayersIndexArr is an array
        
        */
        // luckyPlayersHandler(luckyPlayersIndexArr);

        // ------------------------- CLEAR INPUTS ------------------------- //
        inputsArrEls.forEach(inp => (inp.value = ''));
    }

    // ---------------------- HANDLER FUNCTIONS ----------------------- //
    // -------------------- LUCKY PLAYERS HANDLER --------------------- //

    async function luckyPlayersHandler(luckyPlayersIndexArr) {
        if (!luckyPlayersIndexArr) return; // return if no lucky player

        // ---------------------- FETCH DATA FROM DB ---------------------- //
        const data = await _fetchLoggedGameData(gameID);
        const playersData = data.players;

        // ------------- GET LUCKY PLAYERS NAMES ON AN ARRAY -------------- //
        const luckyPlayers = playersData.reduce((players, currPlayer, index) => {
            if (luckyPlayersIndexArr.includes(index)) players.push(currPlayer.playerName);
            return players;
        }, []);

        // -------------- SET AND RENDER LUCKY PLAYERS MODAL -------------- //
        /*  Because the message will always change  */
        const luckyPlayersString = `\n\n\n${luckyPlayers.join('\n')}`;
        setModal({
            ...modalObjInit,
            ...modalMsg.luckyPlayers,
            type: 'msg', // set type of modal to msg
            msg: modalMsg.luckyPlayers.msg + luckyPlayersString, // add lucky players to celebration msg
        });
    }

    // ---- useEffect() TO PREVENT INFINITY LOOP ON DB FETCH/RENDER ----- //
    useEffect(() => {
        fetchDataHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------------------------------------------------------------- //
    // ---------------------- Score.js COMPONENT ---------------------- //
    // ---------------------------------------------------------------- //

    return (
        <React.Fragment>
            {modal.state && <ModalBox />}
            <form onSubmit={addToScoreHandler}>
                <table className={classes[`score-table`]}>
                    <thead>
                        <tr className={classes['table-header']}>
                            <th>Player</th>
                            <th colSpan={3}>Last Rounds</th>
                            <th> +</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ScoreList scoreData={scoreData} />
                        <tr className={classes['table-header']}>
                            <th></th>
                            <th colSpan={3}>Add Points</th>
                            <th>
                                <button>+</button>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </form>
        </React.Fragment>
    );
}
