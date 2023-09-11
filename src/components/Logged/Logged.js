import React, {useState} from 'react';
import classes from './Logged.module.scss';

import Score from './Tabs/Score/Score.js';
import Stats from './Tabs/Stats.js';

export default function Logged(props) {
    const [activeTab, setActiveTab] = useState('score');

    const scoreTabHandler = () => setActiveTab('score');
    const statsTabHandler = () => setActiveTab('stats');
    const logoutHandler = () => props.logoutHandler();

    function tabHandler() {}
    return (
        <React.Fragment>
            <div className={classes.tabs}>
                <ul>
                    <li>
                        <button onClick={scoreTabHandler}>Score</button>
                    </li>
                    <li>
                        <button onClick={statsTabHandler}>Stats</button>
                    </li>
                    <li>
                        <button onClick={logoutHandler}>Logout</button>
                    </li>
                </ul>
            </div>
            {activeTab === 'score' && <Score gameID={props.gameID} />}
            {activeTab === 'stats' && <Stats gameID={props.gameID} />}
        </React.Fragment>
    );
}
