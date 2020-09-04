import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'

ReactDOM.render(
    <StrictMode>
        <Router>
            <App />
        </Router>
    </StrictMode>
, document.getElementById('root'));

serviceWorker.register();