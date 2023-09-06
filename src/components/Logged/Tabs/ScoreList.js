import classes from './Score.module.scss';
import Input from '../../UI/Input.js';
export default function ScoreList(props) {
    let last, secondLast, thirdLast;
    return props.scoreData.map(player => {
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
            <tr key={player.playerName + '_key'}>
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
