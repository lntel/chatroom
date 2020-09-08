import React from 'react'
import { Route, Switch } from 'react-router';
import SettingsContextProvider from './context/SettingsContext';
import SocketContextProvider from './context/SocketContext';
import Main from './pages/Main';

const App = () => {
    return (
        <SocketContextProvider>
            <SettingsContextProvider>
                <Switch>
                    <Route to="/" component={Main} />
                </Switch>
            </SettingsContextProvider>
        </SocketContextProvider>
    );
}

export default App
