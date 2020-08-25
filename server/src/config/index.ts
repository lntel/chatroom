import dotenv from 'dotenv'

dotenv.config();

export default {
    apiPort: process.env.API_PORT || 4000
}