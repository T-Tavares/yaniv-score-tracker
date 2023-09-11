import classes from './LuckyPlayers.module.scss';
import joker from '../../../../assests/images/joker_594660.png';

export default function LuckyPlayers(props) {
    const luckyPlayers = props.luckyPlayers.map(player => {
        return <h2>{player}</h2>;
    });
    return (
        <div onClick={props.luckyPlayersCloseHandler} className={classes.glass}>
            <div className={classes['lucky-box']}>
                <img className={classes.joker} src={joker} alt="Joker" />
                <h2>Someone Got Lucky Today</h2>
                <div>
                    <h4>A few less points and congrats to..</h4>
                    {luckyPlayers}
                </div>
                <img className={classes.joker} src={joker} alt="Joker" />
            </div>
            <p className={classes.note}>Click to dismiss</p>
        </div>
    );
}
