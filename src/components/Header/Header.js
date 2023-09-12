import React from 'react';
import classes from './Header.module.scss';
import joker from '../../assests/images/joker_594660.png';
import {useState} from 'react';

export default function Header(props) {
    const [easterEgg, setEasterEgg] = useState(false);

    // header menu hook state
    const isMenuHandler = () => {
        setEasterEgg(easterEgg ? false : true);
    };

    const hiddenMsg = (
        <div className={classes.menu}>
            <h1>🍀🍀</h1>
            <h1>46 Potter</h1>
            <h1>🍀🍀</h1>
        </div>
    );
    const title = <h1>Yaniv Score Tracker</h1>;

    return (
        <header className={classes.header}>
            <img onClick={isMenuHandler} src={joker} alt="Joker" />
            {easterEgg ? hiddenMsg : title}
        </header>
    );
}
