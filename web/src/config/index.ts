import dotenv from 'dotenv'

dotenv.config()

const dev = {
    webSocketURL: 'http://localhost:4000/'
};

const production = {
    webSocketURL: 'https://lntelchat.herokuapp.com/'
};

const config = process.env.REACT_APP_STAGE === 'production' ? production : dev;

export default {
    ...config
};