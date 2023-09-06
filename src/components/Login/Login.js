import classes from './Login.module.scss';

import {_authGame} from '../../database/firebaseUtils.js';

import Button from '../UI/Button.js';
import Input from '../UI/Input.js';

export default function Login(props) {
    const {newGameHandler, loginHandler} = props;

    const formHandler = async e => {
        e.preventDefault();
        console.log('login pressed');
        const form = e.target.closest('form');

        const inputGameName = form.querySelector('[data-identifier="game-name"]').value;
        const inputPassword = form.querySelector('[data-identifier="password"]').value;

        const isAuthenticated = new Promise((resolve, reject) => {
            try {
                const isAuthenticated = _authGame(inputGameName, inputPassword);
                resolve(isAuthenticated);
            } catch (err) {
                console.error('There was an issue on the Login', err);
                reject(err);
            }
        });

        if (await isAuthenticated) loginHandler(await isAuthenticated);

        // TODO ADD ERROR HANDLING AND USER FEEDBACK SCREEN
    };

    return (
        <div className={classes.login}>
            <Button text="New Game" callback={newGameHandler} />
            <form className={classes['login-form']}>
                <label>Or if you have a ongoing game.</label>
                <Input dataset={'game-name'} placeholder="Game Name"></Input>
                <Input dataset={'password'} placeholder="Password"></Input>
                <Button callback={formHandler} text="Login" />
            </form>
        </div>
    );
}
