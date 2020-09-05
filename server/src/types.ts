import { Socket } from "socket.io";

export interface Client {
    id: string | undefined
    nickname: string | undefined
    peerId: string | undefined
    socket?: Socket
}

export interface markdownExpressions {
    [index: string]: RegExp
    bold: RegExp
    italic: RegExp
}

export type ClientEvent = | 'set:username' | 'test'