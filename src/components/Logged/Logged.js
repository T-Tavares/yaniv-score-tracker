import React from 'react';
import classes from './Logged.module.scss';

import Score from './Tabs/Score.js';

export default function Logged(props) {
    return (
        <React.Fragment>
            <div className={classes.tabs}>
                <ul>
                    <li>
                        <button>Score</button>
                    </li>
                    <li>
                        <button>Stats</button>
                    </li>
                    <li>
                        <button>Logout</button>
                    </li>
                </ul>
            </div>
            <Score gameID={props.gameID} />
        </React.Fragment>
    );
}
