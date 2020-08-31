import React, { FC } from 'react'

interface UserProps {
    nickname: string
    peerId: string
    onSelected: (e: OnSelectCallback) => void
}

export interface OnSelectCallback {
    id: string
    x: number
    y: number
}

const User: FC<UserProps> = ({ nickname, peerId, onSelected }) => {
    return (
        <div className="userlist__user" onClick={e => onSelected({ id: peerId, x: e.clientX, y: e.clientY })}>
            { nickname }
        </div>
    )
}

export default User
