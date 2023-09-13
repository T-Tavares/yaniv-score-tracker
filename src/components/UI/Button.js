import classes from './Button.module.scss';

export default function Button(props) {
    if (props.callback) {
        return (
            <button onClick={props.callback} className={`${classes.button} ${props.className}`}>
                {props.text}
            </button>
        );
    }
    return <button className={classes.button}>{props.text}</button>;
}
