import React, { useState } from 'react'
import './index.scss'

interface User {
    nickname: string
    peerId: string
}

const Userlist = () => {
    const [users, setUsers] = useState<User[]>([
        {
            nickname: 'Joe',
            peerId: 'fdkjfkdos'
        },
        {
            nickname: 'Steve',
            peerId: 'dhsjfkdsjf'
        }
    ]);

    return (
        <div className="userlist">
            <h1 className="userlist__title">
                Participants
            </h1>
            <div className="userlist__users">
                { users && users.length ? users.map(user =>
                    <div className="userlist__user">
                        { user.nickname }
                    </div>
                ) : null }
            </div>
        </div>
    )
}

export default Userlist
