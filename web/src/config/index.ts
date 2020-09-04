import dotenv from 'dotenv'

dotenv.config();

const config = {
    webSocketURL: process.env.WEBSOCKETURL || 'http://localhost:4000',
}

export default config;