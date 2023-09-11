import React, {useEffect, useState} from 'react';
import classes from './Score.module.scss';
import {_fetchLoggedGameData, _updateScoreDB} from '../../../../database/firebaseUtils.js';
import ScoreList from './ScoreList.js';
import LuckyPlayers from './LuckyPlayers.js';

export default function Score(props) {
    const [scoreData, setScoreData] = useState([]);
    const [luckyPlayers, setLuckyPlayers] = useState('');

    // Fech Data Handler - Fetch and set State
    async function fetchDataHandler() {
        const data = await _fetchLoggedGameData(props.gameID);
        setScoreData(data.players);
    }

    // Add Score to DB Handler
    async function addToScoreHandler(e) {
        e.preventDefault();

        // Get inputs elements
        const inputsArrEls = [...e.target.querySelectorAll('input')];

        // Get inputs Values
        const inputedScoreArr = inputsArrEls.map(inp => +inp.value);

        // Update DB and Rerender Score
        const luckyPlayersIndexArr = await _updateScoreDB(props.gameID, inputedScoreArr);

        await fetchDataHandler();

        // If any lucky player ( reduced points) render celebration
        luckyPlayersHandler(luckyPlayersIndexArr);

        // Clear Inputs
        inputsArrEls.forEach(inp => (inp.value = ''));
    }

    async function luckyPlayersHandler(luckyPlayersIndexArr) {
        if (!luckyPlayersIndexArr) return; // return if no lucky player

        // fetch data from DB
        const data = await _fetchLoggedGameData(props.gameID);
        const playersData = data.players;

        // get winners names on array
        const luckyPlayers = playersData.reduce((players, currPlayer, index) => {
            if (luckyPlayersIndexArr.includes(index)) players.push(currPlayer.playerName);
            return players;
        }, []);

        setLuckyPlayers(luckyPlayers);

        /*       
        time out for the luckyPlayer card
        // ! CLEAR SETTIMEOUT
        // TODO CLEAR SETTIMEOUT
        // ! CLEAR SETTIMEOUT

        setTimeout(() => {
            setLuckyPlayers('');
        }, 5000); */
    }

    const luckyPlayersCloseHandler = () => setLuckyPlayers('');

    useEffect(() => {
        fetchDataHandler();
    }, []);

    return (
        <React.Fragment>
            {luckyPlayers && (
                <LuckyPlayers luckyPlayers={luckyPlayers} luckyPlayersCloseHandler={luckyPlayersCloseHandler} />
            )}
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
