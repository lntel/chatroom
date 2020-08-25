import { Server } from 'http';
import io, { Server as IOServer, Socket } from 'socket.io'

import { Client } from './types'

enum ClientEvents {
    setNickname = 'set:nickname',
    sendMessage = 'send:message',
    disconnect = 'disconnect'
}

class Chat {

    server: IOServer;
    clients: Client[];

    /**
     * Constructor
     * @param {Server} serverInstance HTTP Server instance
     */
    constructor(serverInstance: Server) {
        this.server = io(serverInstance);

        this.clients = [];

        this.initListeners();

        console.log(`Socket server is operational`);
    }

    /**
     * Static singleton
     * @param {Server} serverInstance HTTP Server instance
     * 
     * @returns {Chat}
     */
    static init(serverInstance: Server) {
        return new this(serverInstance);
    }

    /**
     * Initalises event listeners
     */
    initListeners() {
        this.server.on('connection', this.handleConnection.bind(this));
    }

    /**
     * Checks if a nickname is already in use
     * @param {string} nickname Client nickname
     * 
     * @return {Boolean}
     */
    nicknameInUse(nickname: string) {
        const result = this.clients.find(client => client.nickname?.toLowerCase() === nickname.toLowerCase());

        return (result);
    }

    sendMessage(content: string, nickname: string) {
        this.server.emit(ClientEvents.sendMessage, {
            content: content,
            nickname: nickname
        });
    }

    /**
     * Handles client connections
     * @param {Socket} client Client socket
     */
    handleConnection(client: Client) {
        setTimeout(() => {
            if(!client.nickname && !client.peerId) {
                client.disconnect();
            }
        }, 20 * 1000);

        client.on(ClientEvents.setNickname, (nickname: string, peerId: string) => {
            client.nickname = nickname;
            client.peerId = peerId;

            if(this.nicknameInUse(client.nickname)) {
                return client.disconnect();
            }

            this.clients.push(client);
        });

        client.on(ClientEvents.sendMessage, (message: string) => {
            this.sendMessage(message, client.nickname!);
        });

        client.on(ClientEvents.disconnect, () => {
            const clientIndex = this.clients.findIndex(c => c.id === client.id);

            this.clients.splice(clientIndex);
        });
    }

}

export default Chat;