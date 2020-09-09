import dotenv from 'dotenv'

dotenv.config();

const config = {
    apiPort: process.env.PORT || 4000,
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/chatroom',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'diushdsa',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'fdshjfdis'
}

export default config;