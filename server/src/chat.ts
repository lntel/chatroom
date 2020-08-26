import { Server } from 'http';
import io, { Server as IOServer, Socket } from 'socket.io'

import { Client } from './types'

enum ClientEvents {
    setNickname = 'set:nickname',
    sendMessage = 'send:message',
    userJoined = 'user:joined',
    userLeft = 'user:left',
    userList = 'user:list',
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
    handleConnection(client: Socket) {

        const user: Client = {
            nickname: '',
            peerId: '',
            id: ''
        }

        console.log(`${client.id} connected`);

        client.emit(ClientEvents.userList, this.clients)

        setTimeout(() => {
            if(!user.nickname && !user.peerId) {
                client.disconnect();
            }
        }, 20 * 1000);

        client.on(ClientEvents.setNickname, (nickname: string, peerId: string) => {
            user.nickname = nickname;
            user.peerId = peerId;
            user.id = client.id;

            if(this.nicknameInUse(user.nickname)) {
                return client.disconnect();
            }

            console.log(`${client.id} changed nickname to ${nickname}`)

            this.clients.push(user);

            this.server.emit(ClientEvents.userJoined, {
                nickname: nickname,
                peerId: peerId
            });

            console.log(`${this.clients.length} clients connected`)
        });

        client.on(ClientEvents.sendMessage, (message: string) => {

            if(!message.match(/^[ -~]+$/g)) return;

            this.server.emit(ClientEvents.sendMessage, {
                content: message,
                user: user,
                postedDate: new Date(),
                system: false
            })
        });

        client.on(ClientEvents.disconnect, () => {
            const clientIndex = this.clients.findIndex(c => c.id === client.id);

            if(clientIndex === -1) return;

            this.server.emit(ClientEvents.userLeft, this.clients[clientIndex].nickname);

            this.clients.splice(clientIndex);
        });
    }

}

export default Chat;