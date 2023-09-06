import React, {useState, useEffect} from 'react';
import {_fetchLoggedGameData, _updateScoreDB} from '../../../database/firebaseUtils.js';
import classes from './ScoreTracker.module.scss';

export default function ScoreTracker({gameID}) {
    const [gameData, setGameData] = useState([]);

    // fetch data
    // setGameData with fetched data
    async function fetchDataHandler() {
        const data = await _fetchLoggedGameData(gameID);
        console.log(data);
        setGameData(data);

        gameData.map(data => console.log(data));
    }

    function buildScoreEl() {
        // if (!gameData || gameData.length === 0) return;
        console.log(gameData);
        // gameData.map(data => console.log(data));
    }

    useEffect(() => {
        fetchDataHandler();
        buildScoreEl();
    }, []);

    // build sub-component with updated scores
    // render component

    return (
        <div className={classes['score-tracker-tab']}>
            {/* <form onSubmit={formHandler}> */}
            <form>
                <table className={classes['score-table']}>
                    <thead>
                        <tr className={classes['table-header']}>
                            <th></th>
                            <th colSpan={3}>Last Three Rounds</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <ScoreHistory /> */}
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

/* <tr key={player.playerName + '-' + index}>
    <th>{player.playerName}</th>
    <th>{thirdLast ? thirdLast : ' '}</th>
    <th>{secondLast ? secondLast : ' '}</th>
    <th>{last ? last : ' '}</th>
    <th>
        <input data-identifier={player.playerName.toLowerCase()} type="number" />
    </th>
</tr> */
