import dotenv from 'dotenv'

dotenv.config();

const config = {
    apiPort: process.env.API_PORT || 4000,
    mongoUrl: process.env.MONGO_URL || ''
}

export default config;