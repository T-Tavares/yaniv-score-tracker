import classes from './Login.module.scss';

import Button from '../UI/Button';
import Input from '../UI/Input';

export default function Login(props) {
    const {newGameHandler, loginPassHandler} = props;

    return (
        <div className={classes.login}>
            <Button text="New Game" callback={newGameHandler} />
            <form onSubmit={loginPassHandler} className={classes['login-form']}>
                <label>Or if you have a ongoing game.</label>
                <Input placeholder="Enter Your Game Passcode Here"></Input>
                <Button text="Login" />
            </form>
        </div>
    );
}
