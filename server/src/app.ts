import express from 'express'
import { createServer } from 'http'
import Chat from './chat';
import config from './config';

(async () => {
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

    


})();
