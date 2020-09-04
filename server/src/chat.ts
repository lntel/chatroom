import { Server } from 'http';
import io, { Server as IOServer, Socket } from 'socket.io'

import { Client } from './types'

enum ClientEvents {
    setNickname = 'set:nickname',
    sendMessage = 'send:message',
    userJoined = 'user:joined',
    userLeft = 'user:left',
    userList = 'user:list',
    userStreamStart = 'user:streamStart',
    userStreamStop = 'user:streamStop',
    disconnect = 'disconnect',
    disconnectUser = 'disconnect:user',
    banUser = 'ban:user'
}

class Chat {

    server: IOServer;
    clients: Client[];
    bans: string[];

    /**
     * Constructor
     * @param {Server} serverInstance HTTP Server instance
     */
    constructor(serverInstance: Server) {
        this.server = io(serverInstance);

        this.clients = [];
        this.bans = [];

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
            id: '',
            socket: client
        }

        if(this.bans.indexOf(client.handshake.address) !== -1) {
            return client.emit(ClientEvents.banUser);
        }

        console.log(`${client.id} connected`);

        const filteredUserlist: Client[] = [];

        this.clients.map(c => {
            filteredUserlist.push({
                id: c.id,
                nickname: c.nickname,
                peerId: c.peerId
            });
        });

        client.emit(ClientEvents.userList, filteredUserlist);

        setTimeout(() => {
            if(!user.nickname && !user.peerId) {
                client.disconnect();
            }
        }, 20 * 1000);

        client.on(ClientEvents.setNickname, (nickname: string, peerId: string) => {

            const nicknameEx = /[a-zA-Z0-9]/g;

            user.nickname = nickname;
            user.peerId = peerId;
            user.id = client.id;

            if(this.nicknameInUse(user.nickname) || !user.nickname.match(nicknameEx)) {
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


            if(message.match(/([ -ÿ][\p{Mn}\p{Me}]+)/u) || !message.length) return;


            this.server.emit(ClientEvents.sendMessage, {
                content: message,
                user: {
                    nickname: user.nickname,
                    peerId: user.peerId,
                    id: user.id
                },
                postedDate: new Date(),
                system: false
            })
        });

        client.on(ClientEvents.disconnectUser, (peerId: string) => {
            const result = this.clients.find(client => client.peerId === peerId);

            if(!result) return;

            result.socket?.disconnect();
        });

        client.on(ClientEvents.userStreamStop, (peerId: string) => {
            console.log(`Stream halting ${peerId}`)

            this.server.emit(ClientEvents.userStreamStop, peerId);
        });

        client.on(ClientEvents.banUser, (nickname: string) => {
            const result = this.clients.find(client => client.nickname === nickname);

            if(!result) return;

            this.bans.push(result.socket!.handshake.address);

            result.socket?.emit(ClientEvents.banUser);

            result.socket?.disconnect();
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
