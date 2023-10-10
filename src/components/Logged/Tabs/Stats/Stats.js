import classes from './Stats.module.scss';
import SessionStats from './SessionStats.js';
import GameStats from './GameStats.js';

import {useState} from 'react';

export default function Stats(props) {
    const [statsTab, setStatsTab] = useState('sessionStats');

    const sessionTabHandler = () => setStatsTab('sessionStats');
    const gameTabHandler = () => setStatsTab('gameStats');

    return (
        <div className={classes.stats}>
            <button
                onClick={sessionTabHandler}
                className={`${classes['stats-btn']} ${statsTab === 'sessionStats' ? classes.active : ''}`}
            >
                Session Stats
            </button>
            <button
                onClick={gameTabHandler}
                className={`${classes['stats-btn']} ${statsTab === 'gameStats' ? classes.active : ''}`}
            >
                Game Stats
            </button>
            <div className={classes['stats-active-tab']}>
                {statsTab === 'sessionStats' ? <SessionStats gameID={props.gameID} /> : ''}
                {statsTab === 'gameStats' ? <GameStats gameID={props.gameID} /> : ''}
            </div>
        </div>
    );
}
