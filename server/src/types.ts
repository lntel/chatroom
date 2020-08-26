export interface Client {
    id: string | undefined
    nickname: string | undefined
    peerId: string | undefined
}

export type ClientEvent = | 'set:username' | 'test'