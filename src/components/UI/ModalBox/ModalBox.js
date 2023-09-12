import React from 'react';
import ReactDOM from 'react-dom';
import joker from '../../../assests/images/joker_594660.png';
import classes from './ModalBox.module.scss';
import {useModalBox} from './useModalBox.js';

export default function ModalBox(props) {
    const {modal, closeModalBox} = useModalBox();

    // obj used to convert input type to titles and classes for the modal card
    const cardTypeTo = {
        error: classes.error,
        errorTitle: 'ERROR',

        warning: classes.warning,
        warningTitle: 'OOOPS.',

        msg: classes.msg,
        msgTitle: 'Hey',
    };

    // get classes to style modal according to the type of msg (error, warning, msg)
    const cardType = cardTypeTo[modal.type] || cardTypeTo['msg'];

    // If a title is not provided render a automatic title according to type of modal
    const cardTitle = modal.title ? modal.title : cardTypeTo[modal.type + 'Title'];

    // Sub-Componentsmodal
    const Backdrop = () => {
        return <div className={classes.backdrop}></div>;
    };

    const MsgCard = props => {
        return (
            <div onClick={closeModalBox} className={`${classes.card} ${cardType}`}>
                <img className={classes.joker} src={joker} alt="Joker Card" />
                <h1>{cardTitle}</h1>
                <h3>{modal.msg}</h3>
                <p className={classes.dismiss}>Click to Dismiss</p>
                <img className={classes.joker} src={joker} alt="Joker Card" />
            </div>
        );
    };

    return (
        <React.Fragment>
            {modal.state && ReactDOM.createPortal(<MsgCard msg={modal.msg} />, document.getElementById('modal-box'))}
            {modal.state && ReactDOM.createPortal(<Backdrop />, document.getElementById('modal-box'))}
        </React.Fragment>
    );
}
