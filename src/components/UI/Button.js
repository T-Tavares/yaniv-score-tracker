import classes from './Button.module.scss';

export default function Button(props) {
    /* 
        The Button component has a map of classes where I can easily add specific styles to
        buttons.
        In the end it works like Tailwind ( in a way ) 
        
        In order to work a class in the class module is nedded and you have to link the class
        on this object to a identifier (key)

        After that you just have to write all the identifier ( classes / keys on a classes props )
        on the button component.

        The primary class will always be applied since on this app is the main button style
        but I am keeping it here for reference and future edits.

        ex:

        <Button classes="round grey"> MY BUTTON </Button>
    */

    // ---------------------------------------------------------------- //

    /* 
        To add any href to the components buttons use vanilla JS.
        window.open('www.linkYouWantToUse', '_blank')
    */

    // ----------------------- CLASSES MAP OBJ ------------------------ //

    const buttonType = {
        primary: classes.button,
        round: classes.round,
        grey: classes.grey,
        small: classes.small,
    };

    // --- CONVERT AND MAP STRING OF CLASSES INTO THE REAL CLASSES ---- //

    const classesArr = props.classes ? props.classes.split(' ') : [];
    let classesResolve = '';

    classesArr.forEach(classEntry => {
        const cls = buttonType[classEntry];
        classesResolve = classesResolve + ' ' + cls;
    });

    // ---------------------------------------------------------------- //
    // ----------------------- BUTTON COMPONENT ----------------------- //
    // ---------------------------------------------------------------- //

    if (props.callback) {
        return (
            <button onClick={props.callback} className={`${classes.button} ${classesResolve}`}>
                {props.text ? props.text : ''}
            </button>
        );
    }
    return <button className={classes.button}>{props.text}</button>;
}
