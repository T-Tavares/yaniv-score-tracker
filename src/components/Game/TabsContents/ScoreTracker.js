import React, {useState, useEffect} from 'react';
import {_retrieveLoggedGame, _updateScoreDB} from '../../../database/firebaseUtils.js';
import classes from './ScoreTracker.module.scss';

export default function ScoreTracker({gameID}) {
    const [gameData, setGameData] = useState([]);

    // FETCHING GAME DATA AND STORING IT ON useState() hook (setGameData)
    const fetchGameDataHandler = async () => {
        try {
            const fetchedData = await _retrieveLoggedGame(gameID);
            const playersDataArr = fetchedData.players;

            setGameData(playersDataArr);
        } catch (err) {
            console.error("Can't fetch game data", err);
        }
    };

    // useEffect to prevent infinite loops or unwanted behaviour on component render
    useEffect(() => {
        fetchGameDataHandler();
    }, [gameID, gameData]);

    // --------------------------- HANDLERS --------------------------- //
    const formHandler = e => {
        e.preventDefault();

        const inputsEls = [...e.target.querySelectorAll('input')];
        const inputsArr = inputsEls.map(input => +input.value);

        _updateScoreDB(gameID, inputsArr);
    };

    // BUILD SCORE HISTORY ELEMENTS
    const ScoreHistory = gameData.map((player, index) => {
        const [thirdLast, secondLast, last] = player.points.slice(-3);

        return (
            <tr key={player.playerName + '-' + index}>
                <th>{player.playerName}</th>
                <th>{thirdLast ? thirdLast : ' '}</th>
                <th>{secondLast ? secondLast : ' '}</th>
                <th>{last ? last : ' '}</th>
                <th>
                    <input data-identifier={player.playerName.toLowerCase()} type="number" />
                </th>
            </tr>
        );
    });

    return (
        <div className={classes['score-tracker-tab']}>
            <form onSubmit={formHandler}>
                <table className={classes['score-table']}>
                    <thead>
                        <tr className={classes['table-header']}>
                            <th></th>
                            <th colSpan={3}>Last Three Rounds</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ScoreHistory}
                        <tr>
                            <th colSpan={4}></th>
                            <th>
                                <button>+</button>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
