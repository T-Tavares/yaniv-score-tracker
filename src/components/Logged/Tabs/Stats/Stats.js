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

/* 

    return (
        <div className={classes.stats}>
            <button className={`${classes['stats-btn']} ${classes.active}`}>Session Stats</button>
            <button className={`${classes['stats-btn']}`}>Game Stats</button>
            <div className={`${classes['stats-session']}`}>
                <StatsBox type="rectangle" title="Current Winner" value="Alina" />
                <StatsBox type="box" title="Rounds" value="100" unit="Rounds" />
                <StatsBox type="box" title="Min Played" value="100" unit="min" />
                <StatsBox type="rectangle" title="Most Rounds Won" value="Alina" />
                <StatsBox type="rectangle" title="Time Played" value="32 min" unit="min" />
            </div>
        </div>
    );
*/
