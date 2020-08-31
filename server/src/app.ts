import express from 'express'
import { createServer } from 'http'
import Chat from './chat';
import config from './config';
import { createConnection, ConnectionOptions } from 'typeorm';
import { error } from 'console';

const startServer = async () => {
    const app = express();

    const http = createServer(app);

    // Listen on api port
    http.listen({
        port: config.apiPort
    }, () => {

        // Initalise the chat
        Chat.init(http);

        console.log(`Listening on port ${config.apiPort}`);     
    });
};


//Connecting to the mongodb database
createConnection({
    type: 'mongodb',
    url: config.mongoUrl,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [
        `${__dirname}/entity/*`
    ]
} as ConnectionOptions)
.then(() => {
    startServer();
})
