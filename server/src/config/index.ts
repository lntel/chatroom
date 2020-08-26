import dotenv from 'dotenv'

dotenv.config();

const config = {
    apiPort: process.env.API_PORT || 4000,
    mongoUrl: process.env.MONGO_URL || 'mongodb+srv://api:9pxDrZaADnafS2c3@chatroom.j7iv3.mongodb.net/chatroom?retryWrites=true&w=majority'
}

export default config;