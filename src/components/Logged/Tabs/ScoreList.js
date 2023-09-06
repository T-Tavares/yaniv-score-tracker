import classes from './ScoreList.module.scss';
import Input from '../../UI/Input.js';

export default function ScoreList(props) {
    let last, secondLast, thirdLast;
    const scoreData = props.scoreData;

    // Getting current winner Index
    const winnerIndex = scoreData.reduce((minIndex, currPlayer, currIndex) => {
        const lastLowestScore = +currPlayer.points.slice(-1);
        const currentScoreOnLoop = scoreData[minIndex].points.slice(-1);

        if (currIndex === 0 || lastLowestScore < currentScoreOnLoop) return currIndex;
        return minIndex;
    }, 0);

    // Building table with Players and Scores
    return scoreData.map((player, index) => {
        // is This player the winner check
        const winner = index === winnerIndex;

        // starting game logic (no points yet)
        if (player.points.length === 1) {
            [last] = player.points;
        }
        if (player.points.length === 2) {
            [secondLast, last] = player.points.slice(-2);
        }
        // after 3 points goes back to normal
        if (player.points.length >= 3) {
            [thirdLast, secondLast, last] = player.points.slice(-3);
        }

        return (
            <tr className={winner ? classes.winning : ''} key={player.playerName + '_key'}>
                <th>{player.playerName}</th>
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
