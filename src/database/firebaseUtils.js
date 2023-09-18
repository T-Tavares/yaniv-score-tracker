import firebaseApp from './firebaseConfig.js';
import {getDatabase, ref, onValue, get, push, set, off} from 'firebase/database';
import {getTimeStampNow, millisecondsToDecimal, getTimeBetweenTimeStamps} from '../helpers/Helpers.js';

const db = getDatabase(firebaseApp);
const dbRef = ref(db, 'games/');

// ---------------------- ADD NEW GAME TO DB ---------------------- //

export async function _addNewGameDB(gameObj, newGameName) {
    let isDuplicate = false;
    const gamesEntries = await get(dbRef);

    // Check for games with same Name
    gamesEntries.forEach(entry => {
        if (entry.val().gameName === newGameName) {
            isDuplicate = true;
            console.log('Please change the game name. This one is taken.');
        }
    });

    // If name is clear, create New Game
    if (!isDuplicate) {
        const response = await push(ref(db, `games/`), gameObj);
        return response.key;
    }
}

// ---------------------- LOGIN TO A DB GAME ---------------------- //

export async function _authGame(inputGameName, inputPassword) {
    let loggedGameID = false;

    return new Promise((resolve, reject) => {
        onValue(dbRef, snapshot => {
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

// -------------------- RETRIEVE LOGGED GAMNE --------------------- //

export function _fetchLoggedGameData(id) {
    if (!id) {
        console.error('No Game ID Found');
        return;
    }

    const dbGameRef = ref(db, `games/${id}`);

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

// --------------------- SUM NEW SCORE TO DB ---------------------- //

export async function _updateScoreDB(id, scoreArr) {
    const dbGameRef = ref(db, `games/${id}/players`);
    const playersNum = (await get(dbGameRef)).val().length - 1;

    const scoreDataArr = []; // to hold the formated score array to be pushed to the DB
    const reduceWinnerIndex = []; // to catch the index of any player that got deduced points

    // duplicate old score and add new score
    for (let n = 0; n <= playersNum; n++) {
        const oldScoreData = (await get(ref(db, `games/${id}/players/${n}/points`))).val();
        const lastScore = +oldScoreData.slice(-1);

        let currentScore = lastScore + scoreArr[n];

        // Yaniv Reduce points rules
        // number is below 100 / last score is multiple of 50 ( to not reduce again) / current score it multiple of 50
        if (currentScore <= 100 && lastScore % 50 !== 0 && lastScore % 50 !== 0 && currentScore % 50 === 0) {
            currentScore = currentScore - 50;
            reduceWinnerIndex.push(n);
        }

        // number is below 1000 / last score is multiple of 500 ( to not reduce again) / current score it multiple of 500
        if (currentScore >= 1000 && lastScore % 500 !== 0 && currentScore % 500 === 0) {
            currentScore = currentScore - 500;
            reduceWinnerIndex.push(n);
        }

        // add to the last point in the array
        oldScoreData.push(currentScore);

        // push to the updated score array
        scoreDataArr.push(oldScoreData);
    }

    // Update Database
    for (let n = 0; n <= playersNum; n++) {
        await set(ref(db, `games/${id}/players/${n}/points`), scoreDataArr[n]);
    }

    // Return winners index list or false
    if (reduceWinnerIndex.length > 0) return reduceWinnerIndex;
    return false;
}

// ---------------------------------------------------------------- //
// ---------------------- SESSIONS FUNCTIONS ---------------------- //
// ---------------------------------------------------------------- //

export async function _getLastTimeStamp(id) {
    const dbRefTimeStamp = ref(db, `games/${id}/stats/lastTimeStamp`);
    const lastTimeStamp = (await get(dbRefTimeStamp)).val();
    return lastTimeStamp;
}

export async function _updateLastTimeStamp(id, newTimeStamp) {
    const dbRefTimeStamp = ref(db, `games/${id}/stats/lastTimeStamp`);
    try {
        await set(dbRefTimeStamp, newTimeStamp);
    } catch (err) {
        console.error(`There was a problem on fetching the Time Stamp`, err);
    }
}

export async function _isSessionNew(id) {
    /* 
        A new session is fired after a 30 min of difference from the last score added

        returns true if session is new
                false if not
    */

    const lastTimeStamp = _getLastTimeStamp(id);
    const currTimeStamp = getTimeStampNow();
    const timeDiff = millisecondsToDecimal(currTimeStamp - lastTimeStamp, 'min');

    if (timeDiff > 30) return true;
    return false;
}

export async function _updateTotal(id, field, value) {
    /* 
        field: totalRounds, totalSessions, totalTime
    */

    //  increment rounds and sessions automatically when field refers to one of them
    if (field === 'totalRounds' || field === 'totalSessions') {
        value = 1;
    }
    // force totalTime to request a value
    if (field === 'totalTime' && !value)
        return console.error(`To update the ${field} you need to specify the elapsed time.`);

    // fetch initial value and add new or increment it
    const dbUpdateRef = ref(db, `games/${id}/stats/${field}`);
    const initValue = (await get(dbUpdateRef)).val();

    try {
        await set(dbUpdateRef, value + initValue);
        console.log(`${field} updated.`);
    } catch (err) {
        console.error(`There was a problem updating the ${field}`, err);
    }
}

export async function _updateCurrSession(id) {
    // get last timeStamp

    const lastTimeStamp = _getLastTimeStamp(id);
    const currTimeStamp = getTimeStampNow();

    // get currSession Data

    const dbRefCurrSession = ref(db, `games/${id}/stats/currSession`);
    const currSessionInitData = (await get(dbRefCurrSession)).val();
    const {rounds, sessionID, time} = await currSessionInitData;

    // calculate session time
    const elapsedTime = getTimeBetweenTimeStamps(await lastTimeStamp, currTimeStamp);

    // build New currSessionData Obj

    // Session ID remains the same. It's defined by the timeStamp of the time the session was created.
    const newCurrSessionObj = {
        rounds: rounds + 1,
        sessionID: sessionID,
        time: time + elapsedTime,
    };

    // Update Database with currSession and lastTimeStamp

    await set(dbRefCurrSession, newCurrSessionObj);
    await _updateLastTimeStamp(id, currTimeStamp);
    await _updateTotal(id, 'totalRounds');
    await _updateTotal(id, 'totalTime', elapsedTime);
}

// TODO BUILD createNewSession FUNCTION.

export async function _createNewSession() {
    // Get currSession
    // Add currSeassion the sessions array
    // Update totalSessions
    // update lastTimeStamp
    // create NewSession
}
