import React, {Fragment, useEffect, useState} from 'react';
import StatsBox from './StatsBox/StatsBox.js';
import {_fetchLoggedGameData} from '../../../../database/firebaseUtils.js';

import {getTimeStampNow, getTimeBetweenTimeStamps} from '../../../../helpers/Helpers.js';

export default function SessionStats({gameID}) {
    // ----------------------- COMPONENT SETUP ------------------------ //

    // useState to hold Data
    const [gameData, setGameData] = useState('');

    // useEffect to handle async of fetching data from database
    useEffect(() => {
        async function fetchData() {
            setGameData(await _fetchLoggedGameData(gameID));
        }
        fetchData();
    }, [gameID]);

    // ------------------ FUNCTIONS TO FORMAT DATA  ------------------- //

    function sessionRoundsWinners() {
        if (!gameData) return;

        const roundsCheckObj = {}; // We need an obj to dinamically add all players rounds count and check the winner

        // Set up of score and players arrays
        const sessionRounds = gameData.stats.currSession.rounds;
        const scoreArrays = gameData.players.map(player => {
            return player.points.slice(-sessionRounds + 1);
        });
        const playersArray = gameData.players.map(player => player.playerName);

        // Check how many rounds each player won
        scoreArrays.forEach((arr, arrIndex) => {
            arr.forEach((score, scoIndex) => {
                // skip the zero index
                if (scoIndex === 0) return;
                // add points for each player when the curr point mach the previous (round winner)
                if (score === arr[scoIndex - 1]) {
                    roundsCheckObj[arrIndex] = roundsCheckObj[arrIndex] ? roundsCheckObj[arrIndex] + 1 : 1;
                }
            });
        });

        // Check which player won more rounds

        // Used mac points count and a array with indexes

        let maxPointsCount = 0;
        let roundsWinnerIndex = [];

        for (const index in roundsCheckObj) {
            if (roundsCheckObj[index] === maxPointsCount) {
                roundsWinnerIndex.push(+index);
            }

            if (roundsCheckObj[index] > maxPointsCount) {
                maxPointsCount = roundsCheckObj[index];
                roundsWinnerIndex = [+index];
            }
        }

        // Set array of Components to be render for each winner player
        const winners = playersArray.map((player, index) => {
            if (roundsWinnerIndex.includes(index)) {
                return (
                    <StatsBox
                        key={`${player}-stats-${index}`}
                        type="rectangle"
                        value={player}
                        title="Top Rounds Winner"
                        unit={maxPointsCount}
                    />
                );
            }
            return null;
        });
        return winners;
    }

    function sessionTotalRounds(returnType) {
        if (!gameData) return;

        const rounds = gameData.stats.currSession.rounds;

        if (returnType === 'value') return rounds;
        if (rounds === 0)
            return <StatsBox type="rectangle" title="More Stats will be calculated as your game progress" />;
        return <StatsBox type="box" value={rounds} title="Rounds" />;
    }

    function sessionDuration(returnType) {
        if (!gameData) return;
        const sessionStart = gameData.stats.currSession.sessionID;
        const now = getTimeStampNow();
        let durationMinRaw = getTimeBetweenTimeStamps(sessionStart, now);

        // If Session is old it'll count with the lastTimeStamp
        if (durationMinRaw > 90) {
            durationMinRaw = getTimeBetweenTimeStamps(sessionStart, gameData.stats.lastTimeStamp);
        }

        const hours = durationMinRaw > 60 ? `${(durationMinRaw / 60).toFixed(0)} h` : '';
        const min = durationMinRaw < 60 ? `${durationMinRaw} min` : `${(durationMinRaw % 60).toFixed(0)} min`;

        const duration = `${hours} ${min}`;

        if (returnType === 'value') return durationMinRaw;
        return <StatsBox type="rectangle" value={duration} title="Session Duration" />;
    }

    function avgTimePerRound() {
        const duration = sessionDuration('value');
        const rounds = sessionTotalRounds('value');
        const avgTime = (duration / rounds).toFixed(0);

        if (duration === 0 || rounds === 0) return '';
        return <StatsBox type="box" value={avgTime} title="Avg Time p/ Round" unit="min" />;
    }

    function blankSessionCheck() {
        if (!gameData) return;
        if (getTimeBetweenTimeStamps(gameData.stats.lastTimeStamp, gameData.stats.ghostTimeStamp, 'min') > 90) {
            return true;
        }
        return false;
    }

    function blankSession() {
        if (!gameData) return;
        if (blankSessionCheck()) {
            return <StatsBox type="rectangle" title="A new session will start when you log a new score." />;
        }
    }

    // -------- JSX VARIABLES OF COMPONENTS WITH FORMATED DATA -------- //

    const blankSessionComponent = blankSession();

    const winnersComponent = !blankSessionCheck() ? sessionRoundsWinners() : '';
    const totalRoundsComponent = !blankSessionCheck() ? sessionTotalRounds() : '';
    const durationComponent = !blankSessionCheck() ? sessionDuration() : '';
    const avgTimePerRoundComponent = !blankSessionCheck() ? avgTimePerRound() : '';

    // ---------------------------------------------------------------- //
    // -------------------- SessionStats COMPONENT -------------------- //
    // ---------------------------------------------------------------- //
    return (
        <Fragment>
            {blankSessionComponent}
            {winnersComponent}
            {totalRoundsComponent}
            {avgTimePerRoundComponent}
            {durationComponent}
        </Fragment>
    );
}
