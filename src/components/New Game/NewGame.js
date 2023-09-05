import classes from './NewGame.module.scss';
import Button from '../UI/Button.js';
import Input from '../UI/Input.js';
import PlayersInput from './PlayersInput.js';
import {_addNewGameDB} from '../../database/firebaseUtils.js';

export default function NewGame({loginHandler}) {
    const newGameHandler = e => {
        e.preventDefault();
        const inputs = [...e.target.querySelectorAll('input')];

        // Creating New Game Obj

        // Obj INIT()
        const newGameObj = {
            gameName: '',
            gamePassword: '',
            players: [],
            gamesPlayed: [],
        };

        inputs.forEach((input, index) => {
            if (index === 0) newGameObj.gameName = input.value;
            if (index === inputs.length - 1) newGameObj.gamePassword = input.value;
            if (index > 0 && index < inputs.length - 1)
                newGameObj.players.push({
                    playerName: input.value,
                    points: {0: 0},
                });
        });

        const logNewGame = async () => {
            new Promise(async (resolve, reject) => {
                try {
                    const gameID = await _addNewGameDB(newGameObj, newGameObj.gameName);
                    loginHandler(gameID);
                } catch (err) {
                    console.error('Error loggin the New Game', err);
                }
            });
        };
        logNewGame();
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
