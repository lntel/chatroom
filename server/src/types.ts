import { Socket } from "socket.io";

export interface Client {
    id: string | undefined
    nickname: string | undefined
    peerId: string | undefined
    socket?: Socket
}

export type ClientEvent = | 'set:username' | 'test'