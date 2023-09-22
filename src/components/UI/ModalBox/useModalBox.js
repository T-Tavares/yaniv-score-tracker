import React, {createContext, useContext, useState} from 'react';

// ---------------------------------------------------------------- //
// ------------- USECONTEXT() SET UP FOR MODALBOX.JS -------------- //
// ---------------------------------------------------------------- //

/* 

The App.js must be wrapped with the ModalBoxProvider in order to the 
other elements to have access to the Modal and its variables.

The second Section of this file is a series of Error / Warning / Messages
organised to keep the code clean and neat and also so they can be used 
programatically.

*/

// ----------------------- CREATING CONTEXT ----------------------- //
const ModalBoxContext = createContext({
    state: true,
    type: '',
    title: '',
    msg: '',
    closeModalBox: () => {},
});

// ------------ EXPORTING useModalBox() / useContext() ------------ //
export const useModalBox = () => useContext(ModalBoxContext);

// ------------------ CREATING ModalBox.js PROVIDER ------------------ //
export const ModalBoxProvider = props => {
    const [modal, setModal] = useState({
        state: props.state,
        type: props.type,
        title: props.title,
        msg: props.msg,
    });
    const closeModalBox = () => setModal({state: false, type: '', title: '', msg: ''});

    return (
        <ModalBoxContext.Provider value={{modal, setModal, closeModalBox}}>{props.children}</ModalBoxContext.Provider>
    );
};

// ---------------------------------------------------------------- //
// -------- CREATING ERRORS/WARNINGS OBJECTS AND MESSAGES --------- //
// ---------------------------------------------------------------- //

/* 

Use The Spread operator combined with the desired message title. 
To create messages programatically.

ex:

    {...modalObjInit, ...modalMsg.emptySmallGameName}

Keeping all the Warnings and Messages here is easier to maintain consistency.

*/

// -------------------- WARNINGS OBJECT INIT() -------------------- //

export const modalObjInit = {
    state: true,
    type: 'warning',
};

// -------------- WARNINGS MESSAGES / TITLES INIT() --------------- //
export const modalMsg = {
    // ---------------------------- LOGIN ----------------------------- //
    // -------------- Login.js MODAL MESSAGES AND TITLES -------------- //

    userNotFound: {
        title: 'User Not Found',
        msg: 'The game name and/or password provided do not match our database.',
    },

    // --------------------------- NEW GAME --------------------------- //
    // ------------- NewGame.js MODAL MESSAGES AND TITLES ------------- //

    emptySmallGameName: {
        title: 'Size DOES matter. 🥲',
        msg: 'Your game name MUST have 3 or more characters.',
    },
    bigGameName: {
        title: 'It must be a game Title not a book 😜',
        msg: 'Your game name MUST have less than 30  characters.',
    },
    emptySmallPlayerName: {
        title: "There's one or more nameless players 🫥",
        msg: 'Please Name all your players.',
    },
    emptySmallGamePassword: {
        title: 'You do need a password for your game. 🤓',
        msg: 'Just make sure you remember it.',
    },
    duplicateGameName: {
        title: 'This game name is already taken. 💔',
        msg: 'Please choose a different name for your game.',
    },

    // ---------------------------- SCORE ----------------------------- //
    // -------------- Score.js MODAL MESSAGES AND TITLES -------------- //

    wrongInputs: {
        title: 'Wrong Input',
        msg: 'Inputs must be Positive Numbers or Zero',
    },
    luckyPlayers: {
        title: 'Someone Got Lucky Today!',
        msg: 'Congratulations and a few less points to: ',
    },
};
