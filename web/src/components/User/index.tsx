import React, { FC, useEffect } from 'react'

import VideocamIcon from '@material-ui/icons/Videocam';

interface UserProps {
    nickname: string
    peerId: string
    streaming: boolean
    onSelected: (e: OnSelectCallback) => void
}

export interface OnSelectCallback {
    id: string
    x: number
    y: number
}

const User: FC<UserProps> = ({ nickname, peerId, onSelected, streaming }) => {

    return (
        <div className="userlist__user" onClick={e => onSelected({ id: peerId, x: e.clientX, y: e.clientY })}>
            <p>
                { nickname }
            </p>
            <div className="userlist__user__icons">
                { streaming ? (
                    <div className="userlist__user__icon userlist__user__icon--camera">
                        <VideocamIcon>Filled</VideocamIcon>
                    </div>
                ) : null }
            </div>
        </div>
    )
}

export default User
