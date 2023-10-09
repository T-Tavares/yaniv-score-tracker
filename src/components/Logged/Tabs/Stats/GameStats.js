import React, {Fragment, useState, useEffect} from 'react';
import StatsBox from './StatsBox/StatsBox.js';
import StatsGraph from './StatsGraph/StatsGraph.js';
import {_fetchLoggedGameData} from '../../../../database/firebaseUtils.js';
import {getDayFromTimeStamp, ocurrencesOf} from '../../../../helpers/Helpers.js';

export default function GameStats({gameID}) {
    // TODO CREATE LOADING UI WHEEL

    // ----------------------- COMPONENT SETUP ------------------------ //

    // useState to hold Data
    const [gameData, setGameData] = useState('');

    // useEffect to handle async of fetching data from database
    useEffect(() => {
        async function fetchGameData() {
            setGameData(await _fetchLoggedGameData(gameID));
        }
        fetchGameData();
    }, [gameID]);

    // ------------------ FUNCTIONS TO FORMAT DATA  ------------------- //

    function getTotals(statsType, field, returnType) {
        /* 
            Get totals of: 
                time played
                total sessions
                total rounds

                returns a StatsBox component
        */
        if (!gameData || !statsType || !field) return;

        let value = gameData.stats[field];
        const title = field.slice(5);

        if (returnType === 'value' && field === 'totalTime') return value;

        // TOTAL TIME FORMATTING
        if (field === 'totalTime') {
            const hours = value > 60 ? `${(value / 60).toFixed(0)}h` : '';
            const min = value < 60 ? `${value}min` : `${(value % 60).toFixed(0)}min`;
            value = `${hours} ${min}`;
        }

        if (returnType === 'value') return value;

        return <StatsBox type={statsType} value={value} title={`Total ${title}`} />;
    }

    function getCurrWinners() {
        if (!gameData) return;

        // SET UP ARRAYS TO WORK ON GETTING THE WINNER / WINNERS
        const scoresArray = [];
        const playersArray = [];

        gameData.players.forEach((player, index) => {
            scoresArray.push(+player.points.slice(-1));
            playersArray.push(player.playerName);
        });

        // SET UP TO GET THE INDEXES OF WINNERS
        const minValue = Math.min(...scoresArray);
        const minIndexes = [];

        scoresArray.forEach((score, index) => {
            if (score === minValue) minIndexes.push(index);
        });

        const winnersComponents = minIndexes.map(index => {
            return (
                <StatsBox
                    key={`${playersArray[index]}-currwinner-key`}
                    type="rectangle"
                    value={playersArray[index]}
                    title="Current Winner"
                />
            );
        });

        return winnersComponents;
    }

    function getLastGameDate() {
        if (!gameData) return;
        // const lastGameTimeStamp = gameData.stats.sessions.slice(-1)[0].sessionID;
        /*  
            Old way, last session time stamp, kept for reference 
        */
        const lastGameTimeStamp = gameData.stats.lastTimeStamp;
        const options = {year: 'numeric', month: 'short', day: 'numeric'};
        const lastGameDate = new Date(lastGameTimeStamp).toLocaleDateString('en-AU', options);

        return <StatsBox type="rectangle" value={lastGameDate} title="Last Played Date" />;
    }

    function getAvgRoundsPerSession(rounds, sessions) {
        return <StatsBox type="box" value={+(rounds / sessions).toFixed(0)} title="Avg Rounds p/ Session" />;
    }

    function getAvgTimePerSession(time, sessions) {
        return (
            <StatsBox type="box" value={`${+(time / sessions).toFixed(0)}`} title="Avg Time p/ Session" unit="min" />
        );
    }

    function getTopRoundsWinner() {
        if (!gameData) return;
        // SET UP ARRAYS TO WORK
        const scoresArrays = gameData.players.map(player => player.points);
        const playersNamesArrays = gameData.players.map(player => player.playerName);

        // OBJ TO HOLD PLAYERS AND NUM OF ROUNDS WON DINAMICALLY
        const playersObj = {};

        // LOGIC TO FEED THE playersObj
        scoresArrays.forEach((array, arrIndex) => {
            array.forEach((score, scoreIndex) => {
                if (scoreIndex === 0) return;
                if (score === array[scoreIndex - 1]) {
                    playersObj[playersNamesArrays[arrIndex]] = playersObj[playersNamesArrays[arrIndex]]
                        ? playersObj[playersNamesArrays[arrIndex]] + 1
                        : 1;
                }
            });
        });

        // LOGIC TO CHECK WHICH PLAYER / PLAYERS IS THE WINNER ( HAS MORE ROUND WINS)
        let maxRoundsCount = 0;
        let winnersArr = [];

        for (const player in playersObj) {
            if (playersObj[player] === maxRoundsCount) winnersArr.push(player);
            if (playersObj[player] > maxRoundsCount) {
                maxRoundsCount = playersObj[player];
                winnersArr = [player];
            }
        }

        // RETURN COMPONENT ARR WITH WINNER(S)
        return winnersArr.map(player => {
            return (
                <StatsBox key={`${player}-top-rounds-key`} type="rectangle" value={player} title="Top Rounds Winner" />
            );
        });
    }

    function weekDaysActivityGraph() {
        if (!gameData) return;

        const days = [0, 1, 2, 3, 4, 5, 6]; // days array for the forEach Looping reference
        const percentageArray = new Array(7); // empty array for the percentage of each day

        const sessionsCountArr = gameData.stats.sessions.map(session => getDayFromTimeStamp(session.sessionID)); // week days array count
        const totalSessions = gameData.stats.totalSessions; // total sessions to calculate percentage

        /* 
            For Loop to calculate percentage of occurence for each day and feed the percentageArray with the values
        */
        days.forEach((day, index) => {
            const ocurrenceDecimal = +(ocurrencesOf(day, sessionsCountArr) / totalSessions).toFixed(2);
            percentageArray[index] = ocurrenceDecimal * 100;
        });

        // return Week Activity Graph Component

        return <StatsGraph percentageArr={percentageArray} />;
    }

    // -------- JSX VARIABLES OF COMPONENTS WITH FORMATED DATA -------- //

    const roundsValue = getTotals('_', 'totalRounds', 'value');
    const sessionsValue = getTotals('_', 'totalSessions', 'value');
    const timeValue = getTotals('_', 'totalTime', 'value');

    const timeComponent = getTotals('rectangle', 'totalTime');
    const roundsComponent = getTotals('box', 'totalRounds');
    const sessionsComponent = getTotals('box', 'totalSessions');

    const gameWinnersComponent = getCurrWinners();
    const lastSessionComponent = getLastGameDate();
    const avgRoundsComponent = getAvgRoundsPerSession(roundsValue, sessionsValue);
    const avgTimeComponent = getAvgTimePerSession(timeValue, sessionsValue);
    const topRoundsWinnersComponent = getTopRoundsWinner();
    const weekDayActivityGraph = weekDaysActivityGraph();

    // ---------------------------------------------------------------- //
    // -------------------- SessionStats COMPONENT -------------------- //
    // ---------------------------------------------------------------- //

    return (
        <Fragment>
            {gameWinnersComponent}

            {roundsComponent}
            {avgRoundsComponent}
            {topRoundsWinnersComponent}

            {weekDayActivityGraph}

            {sessionsComponent}
            {avgTimeComponent}

            {timeComponent}

            {lastSessionComponent}
        </Fragment>
    );
}
