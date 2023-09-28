import classes from './ScoreList.module.scss';
import Input from '../../../UI/Input.js';

export default function ScoreList(props) {
    let last, secondLast, thirdLast; // logic to render initial scores properly
    const scoreDataArrays = []; // Array of scores on order
    const scoreDataPlayers = []; // Array of players on order

    // --------------- BUILD PLAYERS AND SCORES ARRAYS ---------------- //
    props.scoreData.forEach((player, index) => {
        scoreDataPlayers.push(player.playerName);
        scoreDataArrays.push(player.points);
    });

    // ---------- GET WINNERS INDEXES ARRAY (LOWEST POINTS) ----------- //
    /* 
        These indexes will be used to highlight the winner/winners names
        on the component render.
    */
    const {winnerIndexArray} = scoreDataArrays.reduce(
        (indexesObj, currScoreArray, currIndex) => {
            const currScore = +currScoreArray.slice(-1);

            if (currScore === indexesObj.smallestScore) {
                indexesObj.winnerIndexArray.push(currIndex);
            }

            if (currIndex === 0 || currScore < indexesObj.smallestScore) {
                indexesObj.smallestScore = currScore;
                indexesObj.winnerIndexArray = [currIndex];
            }
            return indexesObj;
        },
        {winnerIndexArray: [], smallestScore: 0}
    );

    // -------------------- GET LAST ROUND WINNER --------------------- //

    // TODO LAST ROUND WINNER
    // TODO APPLY RIGHT CLASS FOR LAST ROUND WINNER AND GAME WINNER
    // TODO CREATE roundWinner reduce map to get index of last round winner

    // ------------- BUILD TABLE WITH PLAYERS AND SCORES -------------- //
    // ---------------------- THREE LAST SCORES ----------------------- //

    return scoreDataArrays.map((score, index) => {
        const winner = winnerIndexArray.includes(index); // Check for winning player

        // ------------- STARTING GAME LOGIC (NO POINTS YET) -------------- //

        if (score.length === 1) {
            [last] = score;
        }
        if (score.length === 2) {
            [secondLast, last] = score.slice(-2);
        }
        // --------- // AFTER 3 POINTS LOGIC GOES BACK TO DEFAULT --------- //

        if (score.length >= 3) {
            [thirdLast, secondLast, last] = score.slice(-3);
        }

        // ---------------------------------------------------------------- //
        // -------------------- ScoreList.js COMPONENT -------------------- //
        // ---------------------------------------------------------------- //
        return (
            // <tr className={winner ? classes['last-round-winner'] : ''} key={scoreDataPlayers[index] + '_key'}>
            <tr className={winner ? classes.winning : ''} key={scoreDataPlayers[index] + '_key'}>
                <th>{scoreDataPlayers[index]}</th>
                <th>{thirdLast ? thirdLast : ''}</th>
                <th>{secondLast ? secondLast : ''}</th>
                <th>{last ? last : ''}</th>
                <th>
                    <Input />
                </th>
            </tr>
        );
    });
}
