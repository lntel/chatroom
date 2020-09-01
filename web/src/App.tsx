import React from 'react'
import { Route, Switch } from 'react-router';
import SettingsContextProvider from './context/SettingsContext';
import Main from './pages/Main';

const App = () => {
    return (
        <SettingsContextProvider>
            <Switch>
                <Route to="/" component={Main} />
            </Switch>
        </SettingsContextProvider>
    );
}

export default App
