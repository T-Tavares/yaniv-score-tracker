import firebaseApp from './firebaseConfig.js';
import {getDatabase, ref, onValue, get, push, set, off, remove} from 'firebase/database';
import {getTimeStampNow, millisecondsToDecimal, getTimeBetweenTimeStamps} from '../helpers/Helpers.js';

const db = getDatabase(firebaseApp);
const dbRef = ref(db, 'games/');

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
            lastTimeStamp: timeStampNow,

            totalRounds: 0,
            totalSessions: 0,
            totalTime: 0,

            ghostSessionID: timeStampNow, // Used to check logins with no actions

            /* 
                currSession: {
                    sessionID: timeStampNow,
                    time: 0,
                    rounds: 0,
                }, 
            */

            /* 
                sessions: [], 
            */
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

export async function _createNewSession(id) {
    const timeStampNow = getTimeStampNow();
    const currSessionRef = ref(db, `games/${id}/stats/currSession`);
    const sessionsArrRef = ref(db, `games/${id}/stats/sessions`);
    const totalSessionsRef = ref(db, `games/${id}/stats/totalSessions`);

    // Get current values of sessions [] and currSession
    const currSession = (await get(currSessionRef)).val();
    const sessionsArr = (await get(sessionsArrRef)).val();

    // Sort new sessions []
    let newSessionsArr;

    if (!sessionsArr) newSessionsArr = [currSession]; // exeption for the first session added
    else newSessionsArr = [...sessionsArr, currSession];

    // Update sessions []
    await set(sessionsArrRef, newSessionsArr);

    // clear currSessioon
    await set(currSessionRef, {rounds: 0, sessionID: timeStampNow, time: 0});

    // Update totalSessions
    const totalSessions = (await get(totalSessionsRef)).val();
    await set(totalSessionsRef, totalSessions + 1);

    // Update lastTimeStamp
    await _lastTimeStampHandler(id, 'UPDATE', timeStampNow);
}

// ---------------------- ADD NEW GAME TO DB ---------------------- //

// export async function _addNewGameDB(gameObj, newGameName) {

//     let isDuplicate = false;
//     const gamesEntries = await get(dbRef);

//     // Check for games with same Name
//     gamesEntries.forEach(entry => {
//         if (entry.val().gameName === newGameName) {
//             isDuplicate = true;
//             console.log('Please change the game name. This one is taken.');

//             // TODO RETURN MESSAGE TO BE DISPLAYED ON ERROR/WARNING MODAL
//         }
//     });

//     // If name is clear, create New Game
//     if (!isDuplicate) {
//         console.log('game added to DB');
//         const response = await push(ref(db, `games/`), gameObj);
//         console.log(response);
//         return response.key;
//     }
// }

// ---------------------------------------------------------------- //
// ------------- AUTHENTICATIONS AND CHECK FUNCTIONS -------------- //
// ---------------------------------------------------------------- //

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

export async function _isSessionNew(id) {
    /* 
        A new session is fired after a 25 min of difference from the last score added

        returns true if session is new
                false if not
    */

    const lastTimeStamp = await _lastTimeStampHandler(id, 'GET');
    const currTimeStamp = getTimeStampNow();

    const timeDiff = millisecondsToDecimal(currTimeStamp - lastTimeStamp, 'min');

    if (timeDiff > 25) return true;
    return false;
}

// ---------------------------------------------------------------- //
// ----------------------- FETCH GAME DATA ------------------------ //
// ---------------------------------------------------------------- //

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

// ---------------------------------------------------------------- //
// --------------- UPDATE SCORE AND STATS FUNCTIONS --------------- //
// ---------------------------------------------------------------- //

export async function _feedSessionsArray(id) {
    const sessionsRef = ref(db, `games/${id}/stats/sessions`);
    const currSessionRef = ref(db, `games/${id}/stats/currSession`);

    const currSession = (await get(currSessionRef)).val();
    let sessions = (await get(sessionsRef)).val();
    try {
        if (currSession === undefined || currSession === null) {
            throw new Error(`There's no current session to be transfered to the sessions array`);
        }
        if (sessions === undefined || sessions === null) {
            sessions = [];
        }

        const newSessions = [...sessions, currSession];

        const result = await set(sessionsRef, newSessions);
        console.log(result);
    } catch (err) {
        console.error(
            `There was a problem updating the current session to the sessions list. Contact our support team for more details.`
        );
    }
}

export async function _sessionsHandler(id) {
    // is ghost session? yes => count with ghostSessionID / no => count with lastTimeStamp
    // is session new?
    // Yes - // add oldSession to sessions array /
    // create new session (currSession)/
    // add to currSession
    // No -  //add to currSession
}

export async function _updateScore(id, scoreArr) {
    // TODO KEEP WORKING ON UPDATED SCORE FUNCTION

    // REFS
    // const currSessionRef = ref(db, `games/${id}/stats/currSession`);
    /* 
        The GhostSession was created to mitigate erros on counting the time of each session.
        simple logins to check the score will not count as a session.
    */

    // CHECK GHOST SESSION
    const isGhostSession = await _ghostSessionHandler(id, 'IS');
    let lastTimeStamp = (await isGhostSession)
        ? await _ghostSessionHandler(id, 'GET')
        : _lastTimeStampHandler(id, 'GET');

    // PASS POINTS THROUGH RULES CHECK
    const scoreANDlucky = await _scoreRulesCheck(id, scoreArr);
    const {scoreDataArr, playersNum, luckyPlayersIndex} = scoreANDlucky;

    // UPDATE DATABASE
    for (let n = 0; n <= playersNum; n++) {
        await set(ref(db, `games/${id}/players/${n}/points`), scoreDataArr[n]);
        console.log('points added to DB: ', scoreDataArr[n]);
    }

    // CHECK IF NEW SESSION
    const elapsedTime = getTimeBetweenTimeStamps(lastTimeStamp, getTimeStampNow(), 'min');
    if (elapsedTime < 30) {
        // add to curr Session
        // delete _ghostSession
    } else {
        // ----- CREATE NEW SESION ----- //
        // move currSession to sessionsArray
        // clear currSession
        // add to curr Session
        // delete _ghostSession
    }
}

export async function _scoreRulesCheck(id, scoreArr) {
    const dbGameRef = ref(db, `games/${id}/players`);
    const playersNum = (await get(dbGameRef)).val().length - 1;

    const scoreDataArr = []; // to hold the formated score array to be pushed to the DB
    const reduceWinnerIndex = []; // to catch the index of any player that got deduced points

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
    let luckyPlayersIndex;

    if (reduceWinnerIndex.length > 0) luckyPlayersIndex = reduceWinnerIndex;
    luckyPlayersIndex = false;

    return {
        scoreDataArr: scoreDataArr,
        playersNum: playersNum,
        luckyPlayersIndex: luckyPlayersIndex,
    };
}

//
// export async function _updateScoreBackup(id) {
//     //prettier-ignore
//     /*
//         The GhostSession was created to mitigate erros on counting the time of each session.
//         simple logins to check the score will not count as a session.
//     */

//     // 1 check if ghostSession.
//     const isGhostSession = await _ghostSessionHandler(id, 'IS');

//     if (isGhostSession) {
//         // 1.1 calculate time elapsed since login(ghost session)
//         const ghostSessionDiff = await _ghostSessionHandler(id, 'DIFF');

//         //  IF (time elapsed > 30 min) => NEW SESSION
//         if (ghostSessionDiff > 30) {
//             //  copy currSession to sessionsArr
//             await _feedSessionsArray(id);
//             //  create new session with getTimeStampNow() (currSession)
//         }
//     }

//     //  ELSE
//     //  copy currSession to sessionsArr
//     //  create new session with ghostSessionID (currSession)

//     //  update currSession
//     //  Delete ghost session
//     //  Update lastTimeStamp
//     //  Update Score

//     // 2 else
//     // 2.1 calculate time elapsed since login(ghost session)

//     //  IF time elapsed > 30 min
//     //  copy currSession to sessionsArr
//     //  create new session with ghostSessionID (currSession)

//     //  ELSE
//     //  Do nothing and proceed to update currSession

//     //  update currSession
//     //  Update lastTimeStamp
//     //  Update Score

//     // 2.2 Update
// }

// export async function _updateScoreDB(id, scoreArr) {
//     const dbGameRef = ref(db, `games/${id}/players`);
//     const playersNum = (await get(dbGameRef)).val().length - 1;

//     const scoreDataArr = []; // to hold the formated score array to be pushed to the DB
//     const reduceWinnerIndex = []; // to catch the index of any player that got deduced points

//     // duplicate old score and add new score
//     for (let n = 0; n <= playersNum; n++) {
//         const oldScoreData = (await get(ref(db, `games/${id}/players/${n}/points`))).val();
//         const lastScore = +oldScoreData.slice(-1);

//         let currentScore = lastScore + scoreArr[n];

//         // Yaniv Reduce points rules
//         // number is below 100 / last score is multiple of 50 ( to not reduce again) / current score it multiple of 50
//         if (currentScore <= 100 && lastScore % 50 !== 0 && lastScore % 50 !== 0 && currentScore % 50 === 0) {
//             currentScore = currentScore - 50;
//             reduceWinnerIndex.push(n);
//         }

//         // number is below 1000 / last score is multiple of 500 ( to not reduce again) / current score it multiple of 500
//         if (currentScore >= 1000 && lastScore % 500 !== 0 && currentScore % 500 === 0) {
//             currentScore = currentScore - 500;
//             reduceWinnerIndex.push(n);
//         }

//         // add to the last point in the array
//         oldScoreData.push(currentScore);

//         // push to the updated score array
//         scoreDataArr.push(oldScoreData);
//     }

//     // Update Database
//     for (let n = 0; n <= playersNum; n++) {
//         await set(ref(db, `games/${id}/players/${n}/points`), scoreDataArr[n]);
//     }

//     // Return winners index list or false
//     if (reduceWinnerIndex.length > 0) return reduceWinnerIndex;
//     return false;
// }

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

    const lastTimeStamp = _lastTimeStampHandler(id, 'GET');
    const currTimeStamp = getTimeStampNow();
    console.log(currTimeStamp);

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
    await _lastTimeStampHandler(id, 'UPDATE', currTimeStamp);
    await _updateTotal(id, 'totalRounds');
    await _updateTotal(id, 'totalTime', elapsedTime);
}

export async function _newCurrSession(id) {}

// ---------------------------------------------------------------- //
// ---------------- TIME AND TIMESTAMPS FUNCTINOS ----------------- //
// ---------------------------------------------------------------- //

export async function _lastTimeStampHandler(id, action, value) {
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

export async function _ghostSessionHandler(id, action, value) {
    /* 
        Handles ghostSessionID GET, UPDATE and DELETE
        Value have to be set if action is SET

        TODO WORK ON THE DESCRIPTION OF EACH CASE AND USE
    */
    const dbGhostSession = ref(db, `games/${id}/stats/ghostSessionID`);
    try {
        switch (action) {
            case 'GET':
                return (await get(dbGhostSession)).val();

            case 'UPDATE':
                await set(dbGhostSession, value);
                return (await get(dbGhostSession)).val();

            case 'DELETE':
                return await remove(dbGhostSession);

            case 'DIFF':
                // Returns time difference between last ghostSessionTimeStamp and Now in minutes.
                const ghostTimeStamp = (await get(dbGhostSession)).val();
                const nowTimeStamp = getTimeStampNow();
                return getTimeBetweenTimeStamps(ghostTimeStamp, nowTimeStamp, 'min');

            case 'IS':
                // Returns true or false if the GhostSessionID exists or not
                const GS = (await get(dbGhostSession)).val();
                if (GS === undefined || GS === null) return false;
                return true;

            default:
                break;
        }
    } catch (err) {
        console.error(`There was a problem on the _ghostSessionHandler: ${action}`, err);
    }
}
