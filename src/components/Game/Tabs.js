import classes from './Tabs.module.scss';

export default function Tabs() {
    return (
        <ul className={classes.tabs}>
            <li className={classes.active}>Game</li>
            <li>Stats</li>
            <li>Edit</li>
        </ul>
    );
}
