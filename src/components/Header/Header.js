import classes from './Header.module.scss';
import Button from '../UI/Button.js';
import joker from '../../assests/images/joker_594660.png';
import {useState} from 'react';

export default function Header(props) {
    const [isMenu, setIsMenu] = useState(false);

    // header menu hook state
    const isMenuHandler = () => {
        setIsMenu(isMenu ? false : true);
    };

    // Logs out and return header to normal state
    const logoutHandler = () => {
        window.location.reload();
    };

    const menu = (
        <div className={classes.menu}>
            {/* <Button text="Edit" /> */}
            <Button callback={logoutHandler} text="Logout" />
        </div>
    );
    const title = <h1>Yaniv Score Tracker</h1>;

    return (
        <header className={classes.header}>
            <img onClick={isMenuHandler} src={joker} alt="Joker" />
            {isMenu ? menu : title}
        </header>
    );
}
