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

    const roundWinner = scoreDataArrays.reduce((winner, currArray, currIndex) => {
        const lastScore = +currArray.slice(-1);
        const beforeLastScore = +currArray.slice(-2, -1);

        if (lastScore === beforeLastScore) winner = currIndex;
        return winner;
    }, 0);

    // TODO INVESTIGATE BUG ON MOBILE FOR THE INDICATOR OF THE LAST ROUND WINNER
    /* 
        The little yellow triangle renders multiple times for each number on the score and not
        just in front of the player name
    */

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
        // ----------  AFTER 3 POINTS LOGIC GOES BACK TO DEFAULT ---------- //

        if (score.length >= 3) {
            [thirdLast, secondLast, last] = score.slice(-3);
        }

        // --------------- WINNER AND ROUND WINNER CLASSES ---------------- //

        const currentW = winner ? `${classes.winning}` : '';
        const roundW = roundWinner === index ? `${classes['last-round-winner']}` : '';

        // ---------------------------------------------------------------- //
        // -------------------- ScoreList.js COMPONENT -------------------- //
        // ---------------------------------------------------------------- //
        return (
            <tr className={`${currentW} ${roundW}`} key={scoreDataPlayers[index] + '_key'}>
                <th>{scoreDataPlayers[index]}</th>
                <th>{thirdLast ? thirdLast : ''}</th>
                <th>{secondLast ? secondLast : ''}</th>
                <th>{last ? last : ''}</th>
                <th>
                    {/* TODO TRYING TO GET NUMBER KEYBOARD FOR INPUTS */}
                    <Input type="number" />
                </th>
            </tr>
        );
    });
}
