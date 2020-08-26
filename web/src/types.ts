export interface User {
    nickname: string
    peerId: string
    self?: boolean
}

export interface UserStream {
    stream: MediaStream
    user: User
}

export interface ChatMessage {
    id: string
    content: string
    user: User
    postedDate: number | string | Date
}

export type Colors = | '#383C4A' | '#404552' | '#4B5162' | '#7C818C' | '#f3f3f3' | '#5294E2';

export enum ClientEvents {
    setNickname = 'set:nickname',
    sendMessage = 'send:message',
    userJoined = 'user:joined',
    userLeft = 'user:left',
    userList = 'user:list',
    disconnect = 'disconnect'
}