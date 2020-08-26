import React, { FC, useState } from 'react'
import { User } from '../../types';
import { SlideInLeft, SlideInRight } from '../Transitions';
import './index.scss'

interface UserlistProps {
    users?: User[]
    visible: boolean
}

const Userlist: FC<UserlistProps> = ({ users, visible }) => {
    // const [users, setUsers] = useState<User[]>([
    //     {
    //         nickname: 'Joe',
    //         peerId: 'fdkjfkdos'
    //     },
    //     {
    //         nickname: 'Steve',
    //         peerId: 'dhsjfkdsjf'
    //     }
    // ]);

    return (
        <SlideInLeft state={visible}>
            <div className="userlist">
                <h1 className="userlist__title">
                    Participants
                </h1>
                <div className="userlist__users">
                    { users && users.length ? users.map(user =>
                        <div className="userlist__user" key={user.peerId}>
                            { user.nickname }
                        </div>
                    ) : null }
                </div>
            </div>
        </SlideInLeft>
    )
}

export default Userlist
