import { Socket } from "socket.io";

export interface Client extends Socket {
    nickname: string | undefined
    peerId: string | undefined
}

export type ClientEvent = | 'set:username' | 'test'