import classes from './Input.module.scss';
import React from 'react';

export default function Input(props) {
    let inputMode,
        pattern = '[a-zA-Z0-9-]';
    // Number Inputs display a number Keyboard on Mobile
    if (props.type === 'number') {
        inputMode = 'numeric';
        pattern = '[0-9]*';
    }

    return (
        <React.Fragment>
            <label className={classes.label}>{props.label}</label>
            <input
                data-identifier={props.dataset}
                className={classes.input}
                placeholder={props.placeholder}
                type={props.type ? props.type : 'text'}
                inputMode={inputMode}
                pattern={pattern}
            ></input>
        </React.Fragment>
    );
}
