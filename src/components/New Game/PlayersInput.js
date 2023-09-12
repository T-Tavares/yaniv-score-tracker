import classes from './PlayersInput.module.scss';
import React, {useState} from 'react';
import Input from '../UI/Input.js';

export default function PlayersInput() {
    const [playersInputs, setPlayersInputs] = useState(2); // minimum players 2
    const players = [];

    const setPlayersInputsHandler = e => {
        e.preventDefault();

        // ------------------- PLAYERS INPUT LIST LOGIC ------------------- //

        if (e.target.textContent === '-') {
            return playersInputs <= 2 ? setPlayersInputs(playersInputs) : setPlayersInputs(playersInputs - 1);
        }
        return playersInputs >= 10 ? setPlayersInputs(playersInputs) : setPlayersInputs(playersInputs + 1); // maximum players 10
    };

    // ----------------- PLAYERS INPUT LIST ELEMENTS ------------------ //

    for (let n = 1; n <= playersInputs; n++) {
        players.push(<Input key={`player-${n}-input-key`} placeholder={`Player ${n} Name`} />);
    }

    // ---------------------------------------------------------------- //
    // ------------------ PlayersInput.js COMPONENT ------------------- //
    // ---------------------------------------------------------------- //

    return (
        <React.Fragment>
            <div className={classes['players-amount']}>
                <button onClick={setPlayersInputsHandler}>-</button>
                <p>Players {playersInputs} </p>
                <button onClick={setPlayersInputsHandler}>+</button>
            </div>
            {players}
        </React.Fragment>
    );
}
