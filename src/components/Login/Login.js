import React from 'react';
import classes from './Login.module.scss';

import {_authGame} from '../../database/firebaseUtils.js';

import Button from '../UI/Button.js';
import Input from '../UI/Input.js';

import ModalBox from '../UI/ModalBox/ModalBox.js';
import {useModalBox, modalObjInit, modalMsg} from '../UI/ModalBox/useModalBox.js';

import Rules from '../Rules/Rules.js';
import {useRules} from '../Rules/useRules.js';

export default function Login(props) {
    const {newGameHandler, loginHandler} = props;
    const {modal, setModal} = useModalBox();
    const {isRulesOn, toggleRulesHandler} = useRules();

    // ---------------------------------------------------------------- //
    // ---------------------- LOGIN FORM HANDLER ---------------------- //
    // ---------------------------------------------------------------- //
    const formHandler = async e => {
        e.preventDefault();

        // ----------- GET USER INPUTS OF GAMENAME AND PASSWORD ----------- //
        const form = e.target.closest('form');
        const inputGameName = form.querySelector('[data-identifier="game-name"]').value;
        const inputPassword = form.querySelector('[data-identifier="password"]').value;

        // ------- CHECK IF USER AND PASSWORD ARE VALID ON DATABASE ------- //
        const isAuthenticated = new Promise((resolve, reject) => {
            try {
                const isAuthenticated = _authGame(inputGameName, inputPassword);
                resolve(isAuthenticated);
            } catch (err) {
                // catch any DB error
                reject(new Error("There's a problem on the authentication, please contact our support team.", err));
            }
        });

        // -------- IF USER AND PASSWORD ARE VALID, LOGIN TO GAME --------- //
        if (await isAuthenticated) return loginHandler(await isAuthenticated);

        // ------ RENDER MODAL IF USER / PASSWORD IS NOT FOUND ON DB ------ //
        setModal({...modalObjInit, ...modalMsg.userNotFound});
    };

    // ---------------------------------------------------------------- //
    // ---------------------- Login.js COMPONENT ---------------------- //
    // ---------------------------------------------------------------- //

    return (
        <React.Fragment>
            {modal.state && <ModalBox />}
            {isRulesOn && <Rules />}
            <div className={classes.login}>
                <Button className={classes['new-game-btn']} text="New Game" callback={newGameHandler} />
                <form className={classes['login-form']}>
                    <label>Or if you have a ongoing game.</label>
                    <Input dataset={'game-name'} placeholder="Game Name"></Input>
                    <Input dataset={'password'} placeholder="Password"></Input>
                    <Button callback={formHandler} text="Login" />
                </form>
                <div>
                    <Button text="Developer" callback={toggleRulesHandler} classes="test one two lala-la" />
                    {/* <Button text="Rules" callback={toggleRulesHandler} className={classes['rules-btn']} /> */}
                </div>

                <a href="https://www.freepik.com/icon/joker_594660" target="_blank" rel="noreferrer">
                    Joker Icon by Freepik
                </a>
            </div>
        </React.Fragment>
    );
}
