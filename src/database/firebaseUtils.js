import firebaseApp from './firebaseConfig.js';
import {getDatabase, ref, onValue, get, push, set, off, remove} from 'firebase/database';
import {getTimeStampNow, getTimeBetweenTimeStamps} from '../helpers/Helpers.js';

const db = getDatabase(firebaseApp);

// ---------------------------------------------------------------- //

export async function _updateScore(id, scoreArr) {
    /* 
        Most important function on the Score Section. Here all the other functions will
        come together and make the magic happen.
    */

    /* 
        The GhostSession was created to mitigate erros on counting the time of each session.
        simple logins to check the score will not count as a session.
    */

    // PASS POINTS THROUGH RULES CHECK
    const scoreANDlucky = await _scoreRulesCheck(id, scoreArr);
    const {scoreDataArr, playersNum, luckyPlayersIndex} = scoreANDlucky;

    // UPDATE DATABASE => Players - points - []
    for (let n = 0; n <= playersNum; n++) {
        await set(ref(db, `games/${id}/players/${n}/points`), scoreDataArr[n]);
    }

    // CHECK HOW LONG SINCE LAST SCORE ADD -> CHECK FOR NEW SESSION

    const elapsedTimeSinceLastScore = await _getElapsedTime(id, true);

    // Check if new Session needs to be created
    if (elapsedTimeSinceLastScore > 30) await _newSession(id);

    // UPDATE CURR SESSION AND DELETE GHOST TIME STAMP
    await _updateCurrSession(id);
    await _ghostTimeStampHandler(id, 'DELETE');

    // updat lastTimeStamp
    await _lastTimeStampHandler(id, 'UPDATE', getTimeStampNow());

    // LUCKY PLAYERS
    if (luckyPlayersIndex) return luckyPlayersIndex;
}

// ---------------------------------------------------------------- //
// --------------------- CREATE NEW FUNCTIONS --------------------- //
// ---------------------------------------------------------------- //

export async function _createNewGame(gameName, gamePassword, playersArr) {
    // --------------------- CREATING GAME OBJECT --------------------- //
    // ---------------------- GAME OBJECT INIT() ---------------------- //

    const timeStampNow = getTimeStampNow();

    const playersArray = playersArr.map(player => {
        return {
            playerName: player,
            points: {0: 0},
        };
    });

    const newGameObj = {
        /*  
                Commented Values are here just as a reference on how this object pattern will 
                be built through the game.

                I choose to keep this part of the code longer for readability and understanding
                on future code reviews.
            */

        gameName: gameName,
        gamePassword: gamePassword,
        stats: {
            totalRounds: 0,
            totalSessions: 0,
            totalTime: 0,

            // ghostTimeStamp: timeStampNow,
            lastTimeStamp: timeStampNow,

            currSession: {
                sessionID: timeStampNow,
                time: 0,
                rounds: 0,
            },

            sessions: [],
        },
        players: playersArray,
    };

    let isDuplicate = false;
    const gamesEntries = await get(ref(db, `games/`));

    // Check for games with same Name
    gamesEntries.forEach(entry => {
        if (entry.val().gameName === gameName) {
            isDuplicate = true;
            return new Error('This name is alredy taken, please chose another one.');
        }
    });

    // If name is clear, create New Game
    if (!isDuplicate) {
        const response = await push(ref(db, `games/`), newGameObj); // push new game to DB and get it's obj back
        return response.key; // return they game id
    }
}

// ---------------------------------------------------------------- //
// ------------- AUTHENTICATIONS AND CHECK FUNCTIONS -------------- //
// ---------------------------------------------------------------- //

export async function _authGame(inputGameName, inputPassword) {
    let loggedGameID = false;
    /* 
        Made this function a bit different from the others as a practice.
        Might change to make everything consistent in future
    */

    return new Promise((resolve, reject) => {
        onValue(ref(db, 'games/'), snapshot => {
            snapshot.forEach(snap => {
                const gameName = snap.val().gameName;
                const gamePassword = snap.val().gamePassword;

                // if Login is sucessfull returns the game ID code
                if (gameName === inputGameName && gamePassword === inputPassword) {
                    loggedGameID = snap.key;
                    resolve(loggedGameID);
                }
            });

            // Failed to login returns a false value
            if (!loggedGameID) {
                resolve(false);
            }
        });
    });
}

// ---------------------------------------------------------------- //
// ----------------------- FETCH GAME DATA ------------------------ //
// ---------------------------------------------------------------- //

export function _fetchLoggedGameData(id, narrowPath) {
    if (!id) {
        console.error('No Game ID Found');
        return;
    }
    const dbGameRef = ref(db, `games/${id}${narrowPath ? narrowPath : ''}`);

    return new Promise((resolve, reject) => {
        const callback = snapshot => {
            const data = snapshot.val();
            if (data !== null) {
                resolve(data);
            } else {
                reject(new Error('Game data not found'));
            }
        };
        const errorCallback = error => {
            console.error('Error on fetching data', error);
            reject(error);
        };

        onValue(dbGameRef, callback, errorCallback);

        return () => off(dbGameRef, callback, errorCallback);
    });
}

// ---------------------------------------------------------------- //
// --------------- UPDATE SCORE AND STATS FUNCTIONS --------------- //
// ---------------------------------------------------------------- //

async function _scoreRulesCheck(id, scoreArr) {
    const dbGameRef = ref(db, `games/${id}/players`);
    const playersNum = (await get(dbGameRef)).val().length - 1;

    const scoreDataArr = []; // to hold the formated score array to be pushed to the DB
    const reduceWinnerIndex = []; // to catch the index of any player that got deduced points

    for (let n = 0; n <= playersNum; n++) {
        const oldScoreData = (await get(ref(db, `games/${id}/players/${n}/points`))).val();
        const lastScore = +oldScoreData.slice(-1);

        let currentScore = lastScore + scoreArr[n];

        // Yaniv Reduce points rules
        if (currentScore % 500 === 0 && lastScore % 500 !== 0) {
            currentScore = currentScore - 500;
            reduceWinnerIndex.push(n);
        } else if (currentScore % 50 === 0 && lastScore % 50 !== 0) {
            currentScore = currentScore - 50;
            reduceWinnerIndex.push(n);
        }

        // add to the last point in the array
        oldScoreData.push(currentScore);

        // push to the updated score array
        scoreDataArr.push(oldScoreData);
    }

    let luckyPlayersIndex;
    if (reduceWinnerIndex.length > 0) {
        luckyPlayersIndex = reduceWinnerIndex;
    }

    return {
        scoreDataArr: scoreDataArr,
        playersNum: playersNum,
        luckyPlayersIndex: luckyPlayersIndex,
    };
}

async function _updateTotal(id, field, value) {
    const dbUpdateRef = ref(db, `games/${id}/stats/${field}`);
    const initialValue = (await get(dbUpdateRef)).val();

    switch (field) {
        case 'totalRounds':
        case 'totalSessions':
            return await set(dbUpdateRef, initialValue + 1);

        case 'totalTime':
            if (value === null || value === undefined)
                return console.error('_updateTotal Time MUST have a value input to be added to total.');
            return await set(dbUpdateRef, initialValue + value);

        default:
            break;
    }
}

async function _updateCurrSession(id) {
    // get currSession Data

    const dbRefCurrSession = ref(db, `games/${id}/stats/currSession`);
    const currSessionInitData = (await get(dbRefCurrSession)).val();
    const {rounds, sessionID, time} = await currSessionInitData;

    // calculate session time
    const elapsedTime = await _getElapsedTime(id);

    // build New currSessionData Obj

    // Session bv ID remains the same. It's defined by the timeStamp of the time the session was created.
    const newCurrSessionObj = {
        rounds: rounds + 1,
        sessionID: sessionID,
        time: time + elapsedTime,
    };

    // Update Database with currSession and lastTimeStamp

    await set(dbRefCurrSession, newCurrSessionObj);
    await _updateTotal(id, 'totalRounds');
    await _updateTotal(id, 'totalTime', elapsedTime);
    await _lastTimeStampHandler(id, 'UPDATE', getTimeStampNow());
}

async function _newSession(id) {
    // GET SESSIONS ARRAY
    const sessionsRef = ref(db, `games/${id}/stats/sessions`);
    let sessionsArr = (await get(sessionsRef)).val();

    // MITIGATE EMPTY SESSIONS OBJ
    if (sessionsArr === null || sessionsArr === undefined) sessionsArr = [];

    // GET CurrSession
    const currSessionRef = ref(db, `games/${id}/stats/currSession`);
    let currSessionObj = (await get(currSessionRef)).val();

    // MITIGATE EMPTY CURR SESSION OBJ
    if (currSessionObj === null || currSessionObj === undefined) {
        currSessionObj = {
            sessionID: getTimeStampNow(),
            time: 0,
            rounds: 0,
        };
    }

    // UPDATE DATABASE
    sessionsArr.push(currSessionObj);
    await set(sessionsRef, sessionsArr);

    // CLEAR CURR SESSION
    await set(currSessionRef, {
        sessionID: getTimeStampNow(),
        time: 0,
        rounds: 0,
    });
    // UPDATE TOTAL SESSIONS
    await _updateTotal(id, 'totalSessions');
}

// ---------------------------------------------------------------- //
// ---------------- TIME AND TIMESTAMPS FUNCTINOS ----------------- //
// ---------------------------------------------------------------- //

async function _lastTimeStampHandler(id, action, value) {
    /* 
        Handles lastTimeStamp GET and UPDATE
        Value have to be set if action is SET
    */

    const dbLastTimeStamp = ref(db, `games/${id}/stats/lastTimeStamp`);

    try {
        switch (action) {
            case 'GET':
                return (await get(dbLastTimeStamp)).val();
            case 'UPDATE':
                await set(dbLastTimeStamp, value);
                return (await get(dbLastTimeStamp)).val();

            default:
                break;
        }
    } catch (err) {
        console.error(`There was a problem on the _lastTimeStampHandler: ${action}`, err);
    }
}

export async function _ghostTimeStampHandler(id, action, value) {
    const ghostTSRef = ref(db, `games/${id}/stats/ghostTimeStamp`);

    switch (action) {
        case 'GET':
            return (await get(ghostTSRef)).val();
        case 'UPDATE':
            return await set(ghostTSRef, value);
        case 'DELETE':
            return await remove(ghostTSRef);
        case 'IS':
            return (await get(ghostTSRef)).val() !== null;
        default:
            break;
    }
}

async function _getElapsedTime(id, isSession) {
    /* 
        The second argument isSession returns the elapsed time between the lastTimeStamp and Current Time Stamp
        used to identify if a session is new or not 

        ( A new session is created if theres a 30 min gap(inactivity) between the current Time Stamp and the 
        lastTimeStamp on Score ADD )

    */

    // REFS
    const ghostTimeStampRef = ref(db, `games/${id}/stats/ghostTimeStamp`);
    const lastTimeStampRef = ref(db, `games/${id}/stats/lastTimeStamp`);

    const ghostTimeStamp = (await get(ghostTimeStampRef)).val();
    const lastTimeStamp = (await get(lastTimeStampRef)).val();
    const timeStampNow = getTimeStampNow();

    // --------

    if (ghostTimeStamp && !isSession) return getTimeBetweenTimeStamps(ghostTimeStamp, timeStampNow, 'min');
    return getTimeBetweenTimeStamps(lastTimeStamp, timeStampNow, 'min');
}
