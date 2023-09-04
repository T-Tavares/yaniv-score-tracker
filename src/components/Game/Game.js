import classes from './Game.module.scss';
import Tabs from './Tabs.js';
import TabContent from './TabContent.js';

export default function Game(props) {
    return (
        <div>
            <Tabs />
            <TabContent gameID={props.gameID} />
        </div>
    );
}
