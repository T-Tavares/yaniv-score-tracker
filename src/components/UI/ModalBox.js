import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import joker from '../../assests/images/joker_594660.png';
import classes from './ModalBox.module.scss';

export default function ModalBox(props) {
    const [isModalOn, setIsModalOn] = useState(true);
    const [modalType, setModalType] = useState('');

    const closeModalHandler = () => setIsModalOn(false);

    // Sub-Components
    const Backdrop = () => {
        return <div className={classes.backdrop}></div>;
    };

    const cardTypeToClass = {
        error: classes.error,
        warning: classes.warning,
        msg: classes.msg,
    };
    const cardType = cardTypeToClass[props.type] || cardTypeToClass['msg'];

    const MsgCard = props => {
        return (
            <div onClick={closeModalHandler} className={`${classes.card} ${cardType}`}>
                <img className={classes.joker} src={joker} alt="Joker Card" />
                <h1>Error</h1>
                <h1>😥</h1>
                <h3> Something went wrong</h3>
                <p>{props.msg}</p>
                <p className={classes.dismiss}>Click to Dismiss</p>
                <img className={classes.joker} src={joker} alt="Joker Card" />
            </div>
        );
    };

    return (
        <React.Fragment>
            {isModalOn && ReactDOM.createPortal(<MsgCard msg={props.msg} />, document.getElementById('modal-box'))}
            {isModalOn && ReactDOM.createPortal(<Backdrop />, document.getElementById('modal-box'))}
        </React.Fragment>
    );
}
