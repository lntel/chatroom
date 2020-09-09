import dotenv from 'dotenv'

dotenv.config();

export default {
    webSocketURL: process.env.URL || 'https://lntelchat.herokuapp.com/',
};