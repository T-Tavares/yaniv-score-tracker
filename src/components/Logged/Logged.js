import React, {useState, useEffect} from 'react';
import classes from './Logged.module.scss';

import Score from './Tabs/Score/Score.js';
import Stats from './Tabs/Stats/Stats.js';

import {_ghostTimeStampHandler} from '../../database/firebaseUtils.js';
import {getTimeStampNow} from '../../helpers/Helpers.js';

export default function Logged(props) {
    const [activeTab, setActiveTab] = useState('score');

    useEffect(() => {
        _ghostTimeStampHandler(props.gameID, 'UPDATE', getTimeStampNow());
    }, [props.gameID]);

    const scoreTabHandler = () => setActiveTab('score');
    const statsTabHandler = () => setActiveTab('stats');
    const logoutHandler = () => props.logoutHandler();

    return (
        <React.Fragment>
            <div>
                <div className={classes.tabs}>
                    <ul>
                        <li className={activeTab === 'score' ? classes.active : ''}>
                            <button onClick={scoreTabHandler}>Score</button>
                        </li>
                        <li className={activeTab === 'stats' ? classes.active : ''}>
                            <button onClick={statsTabHandler}>Stats</button>
                        </li>
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    </ul>
                </div>
                {activeTab === 'score' && <Score gameID={props.gameID} />}
                {activeTab === 'stats' && <Stats gameID={props.gameID} />}
            </div>
        </React.Fragment>
    );
}
