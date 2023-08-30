import classes from './Header.module.scss';
import joker from '../../assests/images/joker_594660.png';

export default function Header(props) {
    return (
        <header className={classes.header}>
            <img src={joker} alt="Joker Image" />
            <h1>Yaniv Score Tracker</h1>
        </header>
    );
}
