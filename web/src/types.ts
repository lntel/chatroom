export interface User {
    nickname: string
    peerId: string
    self?: boolean
}

export interface UserStream {
    stream: MediaStream
    user: User
}