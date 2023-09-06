import React, {useEffect, useState} from 'react';
import classes from './Score.module.scss';
import {_fetchLoggedGameData} from '../../../database/firebaseUtils.js';
import ScoreList from './ScoreList.js';
import Button from '../../UI/Button.js';

export default function Score(props) {
    const [scoreData, setScoreData] = useState([]);

    // Fech Data Handler - Fetch and set State
    async function fetchDataHandler() {
        const data = await _fetchLoggedGameData(props.gameID);
        setScoreData(data.players);
    }

    useEffect(() => {
        fetchDataHandler();
    }, []);

    return (
        <form>
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
    );
}
