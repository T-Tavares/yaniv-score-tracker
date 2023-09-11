import classes from './ScoreList.module.scss';
import Input from '../../../UI/Input.js';

export default function ScoreList(props) {
    let last, secondLast, thirdLast;
    const scoreDataArrays = [];
    const scoreDataPlayers = [];

    // Build working arrays
    props.scoreData.forEach((player, index) => {
        scoreDataPlayers.push(player.playerName);
        scoreDataArrays.push(player.points);
    });

    // Build winner indexes array
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

    // Building table with Players and Scores
    return scoreDataArrays.map((score, index) => {
        // is This player the winner check
        const winner = winnerIndexArray.includes(index);

        // starting game logic (no points yet)
        if (score.length === 1) {
            [last] = score;
        }
        if (score.length === 2) {
            [secondLast, last] = score.slice(-2);
        }
        // after 3 points goes back to normal
        if (score.length >= 3) {
            [thirdLast, secondLast, last] = score.slice(-3);
        }

        return (
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
