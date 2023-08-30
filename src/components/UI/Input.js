import classes from './Input.module.scss';
import React from 'react';

export default function Input(props) {
    return (
        <React.Fragment>
            <label className={classes.label}>{props.label}</label>
            <input
                className={classes.input}
                placeholder={props.placeholder}
                type={props.type ? props.type : 'text'}
            ></input>
        </React.Fragment>
    );
}
