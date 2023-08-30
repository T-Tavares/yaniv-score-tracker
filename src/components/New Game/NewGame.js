import classes from './NewGame.module.scss';
import Button from '../UI/Button';
import Input from '../UI/Input';
import PlayersInput from './PlayersInput';

export default function NewGame() {
    const newGameHandler = e => {
        e.preventDefault();
        const inputs = [...e.target.querySelectorAll('input')];

        // Creating New Game Obj

        // Obj INIT()
        const newGameObj = {
            gameName: '',
            gamePasscode: '',
            players: [],
            gamesPlayed: [],
        };

        inputs.forEach((input, index) => {
            if (index === 0) newGameObj.gameName = input.value;
            if (index === inputs.length - 1) newGameObj.gamePasscode = input.value;
            if (index > 0 && index < inputs.length - 1)
                newGameObj.players.push({
                    playerName: input.value,
                    points: 0,
                });
        });

        // TODO CONNECT WITH FIREBASE

        console.log(newGameObj);
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
