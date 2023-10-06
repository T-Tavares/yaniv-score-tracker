import React, {createContext, useContext, useState} from 'react';

const RulesContext = createContext({
    state: false,
    toggleRulesHandler: () => {},
});

export const useRules = () => useContext(RulesContext);

export const RulesProvider = props => {
    const [isRulesOn, setIsRulesOn] = useState(props.state);
    const toggleRulesHandler = () => setIsRulesOn(!isRulesOn);

    return (
        <RulesContext.Provider value={{isRulesOn, setIsRulesOn, toggleRulesHandler}}>
            {props.children}
        </RulesContext.Provider>
    );
};
