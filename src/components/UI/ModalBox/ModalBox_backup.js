import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import joker from '../../assests/images/joker_594660.png';
import classes from './ModalBox.module.scss';

export default function ModalBox(props) {
    const [modal, setModal] = useState({state: true, type: props.type, title: props.title, msg: props.msg});

    const closeModalHandler = () => {
        props.closeModalHandler();
        setModal({state: false, type: '', msg: ''});
    };

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
            <div onClick={closeModalHandler} className={`${classes.card} ${cardType}`}>
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
            {modal && ReactDOM.createPortal(<MsgCard msg={modal.msg} />, document.getElementById('modal-box'))}
            {modal && ReactDOM.createPortal(<Backdrop />, document.getElementById('modal-box'))}
        </React.Fragment>
    );
}
