import React, {useEffect, useState} from 'react';
import classes from './Score.module.scss';
import {_fetchLoggedGameData} from '../../../database/firebaseUtils.js';
import ScoreList from './ScoreList.js';

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
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th colSpan={3}> 3 Last Games</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <ScoreList scoreData={scoreData} />
                </tbody>
            </table>
        </form>
    );
}
