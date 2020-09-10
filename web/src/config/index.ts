import dotenv from 'dotenv'

dotenv.config()

const dev = {
    webSocketURL: 'http://localhost:4000/'
};

const production = {
    webSocketURL: 'https://lntelchat.herokuapp.com/'
};

const config = process.env.NODE_ENV === 'production' ? production : dev;

export default {
    ...config
};