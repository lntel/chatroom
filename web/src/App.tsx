import React from 'react'
import { Route, Switch } from 'react-router';
import Main from './pages/Main';

const App = () => {
    return (
        <Switch>
            <Route to="/" component={Main} />
        </Switch>
    );
}

export default App
