import firebaseApp from './firebaseConfig.js';
import {getDatabase, ref, onValue, get, push, set, off} from 'firebase/database';

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
