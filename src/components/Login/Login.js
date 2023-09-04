import classes from './Login.module.scss';

import {_authGame} from '../../database/firebaseUtils.js';

import Button from '../UI/Button.js';
import Input from '../UI/Input.js';

export default function Login(props) {
    const {newGameHandler, loginHandler} = props;

    const formHandler = async e => {
        e.preventDefault();

        const inputGameName = e.target.querySelector('[data-identifier="game-name"]').value;
        const inputPassword = e.target.querySelector('[data-identifier="password"]').value;

        const isAuthenticated = await _authGame(inputGameName, inputPassword);

        if (isAuthenticated) loginHandler(isAuthenticated);

        // TODO ADD ERROR HANDLING AND USER FEEDBACK SCREEN
    };

    return (
        <div className={classes.login}>
            <Button text="New Game" callback={newGameHandler} />
            <form onSubmit={formHandler} className={classes['login-form']}>
                <label>Or if you have a ongoing game.</label>
                <Input dataset={'game-name'} placeholder="Game Name"></Input>
                <Input dataset={'password'} placeholder="Password"></Input>
                <Button text="Login" />
            </form>
        </div>
    );
}
