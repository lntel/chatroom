import React, { createContext, Dispatch, FC, useEffect, useReducer } from 'react'
import { Action, settingsReducer } from '../reducers/settings';
import { State } from '../reducers/settings'

interface SettingsContextProps {
    state: State
    dispatch: Dispatch<Action>
}

export const SettingsContext = createContext<SettingsContextProps>({
    state: {
        audioInput: undefined,
        audioOutput: undefined,
        videoInput: undefined
    },
    dispatch: () => {}
});

interface SettingsContextProviderProps {
    children?: any
}

const SettingsContextProvider: FC<SettingsContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(settingsReducer, {}, () => {
        const result = localStorage.getItem('mediaSettings');

        return result ? JSON.parse(result) : {};
    });

    useEffect(() => {
        localStorage.setItem('mediaSettings', JSON.stringify(state));
    }, [state]);
    

    return (
        <SettingsContext.Provider value={{ state, dispatch }}>
            { children }
        </SettingsContext.Provider>
    )
}

export default SettingsContextProvider
