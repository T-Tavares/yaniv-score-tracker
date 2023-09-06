import classes from './NewGame.module.scss';
import Button from '../UI/Button.js';
import Input from '../UI/Input.js';
import PlayersInput from './PlayersInput.js';
import {_addNewGameDB} from '../../database/firebaseUtils.js';

export default function NewGame(props) {
    const newGameHandler = e => {
        e.preventDefault();
        const inputs = [...e.target.querySelectorAll('input')];

        // Creating New Game Obj

        // Game Obj INIT()
        const newGameObj = {
            gameName: '',
            gamePassword: '',
            players: [],
            gamesPlayed: [],
        };
        // Feeding Game Obj
        inputs.forEach((input, index) => {
            if (index === 0) newGameObj.gameName = input.value;
            if (index === inputs.length - 1) newGameObj.gamePassword = input.value;
            if (index > 0 && index < inputs.length - 1)
                newGameObj.players.push({
                    playerName: input.value,
                    points: {0: 0},
                });
        });

        // Logging in on the New Game
        new Promise(async (res, rej) => {
            try {
                const ID = await _addNewGameDB(newGameObj, newGameObj.gameName);
                res(props.loginHandler(ID));
            } catch (err) {
                console.error("Ther's an issue on the login", err);
            }
        });
    };

    return (
        <form onSubmit={newGameHandler} className={classes['new-game-form']}>
            <Input data-game-title="gameTitle" label="Game Name" placeholder="Chose your Game Name" />
            <PlayersInput />
            <Input data-game-title="gamePassword" label="Password" placeholder="Chose your Game Password" />

            <Button text="Create New Game" />
        </form>
    );
}
