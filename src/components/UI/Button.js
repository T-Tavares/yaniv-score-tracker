import classes from './Button.module.scss';

export default function Button(props) {
    const buttonType = {
        primary: classes.button,
        round: classes.round,
    };
    const classesArr = props.classes ? props.classes.split(' ') : [];
    console.log(classesArr);

    // TODO SET UP BUTTON CLASSES / VARIATIONS PROGRAMATICALLY THROUGH buttonType Obj and user inputs
    // TODO SET UP BUTTON CLASSES / VARIATIONS PROGRAMATICALLY THROUGH buttonType Obj and user inputs
    // TODO SET UP BUTTON CLASSES / VARIATIONS PROGRAMATICALLY THROUGH buttonType Obj and user inputs
    // TODO SET UP BUTTON CLASSES / VARIATIONS PROGRAMATICALLY THROUGH buttonType Obj and user inputs
    // TODO SET UP BUTTON CLASSES / VARIATIONS PROGRAMATICALLY THROUGH buttonType Obj and user inputs

    if (props.callback) {
        return (
            <button onClick={props.callback} className={`${classes.button} ${props.className}`}>
                {props.text}
            </button>
        );
    }
    return <button className={classes.button}>{props.text}</button>;
}
