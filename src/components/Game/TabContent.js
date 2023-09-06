import classes from './TabContent.module.scss';
import {useState} from 'react';
import ScoreTracker from './TabsContents/ScoreTracker.js';

export default function TabContent(props) {
    /* 
        ! Uncomment to build other tabs
        ! Uncomment to build other tabs
        
        const [tab, setTab] = useState('Score Tracker');

    let tabScreenEl;

    switch (tab) {
        case 'Score Tracker':
            tabScreenEl = <ScoreTracker gameID={props.gameID} />;
            break;
        case 'Stats':
            // tabScreenEl = <Stats/>

            break;
        case 'Edit':
            // tabScreenEl = <Edit/>
            break;

        default:
            break;
    } */

    return (
        <div className={classes['tab-content-container']}>
            {/*  */}
            {/* {tabScreenEl} */}
            <ScoreTracker gameID={props.gameID} />
        </div>
    );
}
