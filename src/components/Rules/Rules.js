import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {useRules} from './useRules.js';
import classes from './Rules.module.scss';

export default function Rules() {
    const {isRulesOn, setIsRulesOn} = useRules();

    // RULES TOGGLE HANDLER
    const rulesTogglerHandler = () => setIsRulesOn(!isRulesOn);

    // RULES LIST COMPONENT
    const RulesComponent = props => {
        return (
            <div className={classes['rules-box']}>
                <button onClick={rulesTogglerHandler} className={classes['close-btn']}>
                    ⎋
                </button>

                <h2>Yaniv Game Rules</h2>
                <p>
                    The rules on 46 Potter Yaniv are a bit different. There were tweaks made in order to keep the game
                    going over years if you want.
                </p>
                <ol>
                    <li>
                        <h4>Setup</h4>
                        <ul>
                            <li className={classes.subtitle}>Deck: Use a standard 52-card deck with Jokers.</li>
                            <li className={classes.subtitle}>Deal: Each player is dealt 7 cards.</li>
                        </ul>
                    </li>
                    <li>
                        <h4>Gameplay</h4>
                        <ul>
                            <li className={classes.subtitle}>Players take turns clockwise.</li>
                            <li className={classes.subtitle}>On a player's turn, they can either:</li>
                            <ul className={classes.subitem}>
                                <li>
                                    Discard a Set: In order to get rid of points the player can discard sets of cards.
                                    Valid Sets are explained on the next topic.
                                </li>
                                <li>
                                    Draw a Card: Either the top card from the discard pile or an unknown card from the
                                    deck.
                                </li>
                                <li>
                                    Call Yaniv: If a player thinks they have the lowest total points, they can call
                                    "Yaniv" to end the round.
                                </li>
                                <li>Players can only call Yaniv when they have less than 5 points</li>
                            </ul>
                            <li></li>
                        </ul>
                    </li>

                    <li>
                        <h4>Scoring</h4>
                        <ul>
                            <li className={classes.subtitle}>Card Values</li>
                            <ul className={classes.subitem}>
                                <li>Number cards (2-10): Face value in points.</li>
                                <li>Face cards (King, Queen, Jack): 10 points each.</li>
                                <li>Ace: 1 point.</li>
                                <li>Joker: 0 point.</li>
                            </ul>
                            <li className={classes.subtitle}>Valid Sets</li>
                            <ul className={classes.subitem}>
                                <li>Group: Three or four cards of the same rank (e.g., 3 sevens or 4 jacks).</li>
                                <li>Run: Three or more consecutive cards (e.g., 3, 4, 5).</li>
                            </ul>
                            <li className={classes.subtitle}>Round End</li>
                            <ul className={classes.subitem}>
                                <li>If a player calls "Yaniv," all players reveal their hands.</li>
                                <li>
                                    If the player who call "Yaniv" has the lowest total points he/she wins the round and
                                    get zero points.
                                </li>
                                <li>
                                    If the player who call "Yaniv" does not have the lowest total points he/she loses
                                    and get 30 plus the points he has in hand added to his score.
                                </li>
                            </ul>
                            <li className={classes.subtitle}>Penalty Points</li>
                            <ul className={classes.subitem}>
                                <li>Each player scores points based on the remaining cards in their hand.</li>
                            </ul>
                        </ul>
                    </li>

                    <li>
                        <h4>Winning The Game</h4>
                        <ul>
                            <li>
                                The game is usually played over multiple rounds, and the player with the fewest points
                                at the end of a predetermined number of rounds is declared the overall winner.
                            </li>
                            <li>
                                For this score tracker there's no limit of rounds, so you can keep playing for as long
                                as you want. That's also why we track sessions.
                            </li>
                            <li>The tracker will highlight in yellow the players with lowest points.</li>
                            <li>The tracker will add a yellow corner sign for the last round winner.</li>
                        </ul>
                    </li>
                </ol>
                <h2>😄 Have Fun 😄</h2>
            </div>
        );
    };

    // ---------------------------------------------------------------- //
    // ----------------------- RULES COMPONENT ------------------------ //
    // ---------------------------------------------------------------- //

    // prettier-ignore
    return (
        <Fragment>
            {isRulesOn ? ReactDOM.createPortal(<RulesComponent/>, document.getElementById('rules')) : ''}
        </Fragment>
    );
}
