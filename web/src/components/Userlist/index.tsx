import React, { FC, useEffect, useState } from 'react'
import { SlideInLeft, SlideInRight } from '../Transitions';
import { Socket } from 'socket.io-client'
import './index.scss'

import ClearIcon from '@material-ui/icons/Clear';
import UserModal from '../UserModal';
import User, { OnSelectCallback } from '../User';
import { ClientEvents, User as IUser } from '../../types';

interface UserlistProps {
    users?: IUser[]
    socket: typeof Socket | null
    visible: boolean
}

interface ModalPosition {
    x: number
    y: number
}

const Userlist: FC<UserlistProps> = ({ users, visible, socket }) => {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [modalPosition, setModalPosition] = useState<ModalPosition>({
        x: 0,
        y: 0
    });

    const handleUserSelection = (id: string, coords: ModalPosition) => {
        setSelectedUser(id);
        setModalPosition(coords);
    }

    const handleDisconnect = () => {
        if(socket) {

            console.log(`Disconnecting user ${selectedUser}`)

            socket.emit(ClientEvents.disconnectUser, selectedUser);

            setSelectedUser('');
        }
    }

    const handleBan = () => {
        if(socket) {

            console.log(`Banning user ${selectedUser}`)

            socket.emit(ClientEvents.banUser, selectedUser);

            setSelectedUser('');
        }
    }

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
        <>
        <UserModal 
        visible={Boolean(selectedUser)} 
        positionX={modalPosition.x} 
        positionY={modalPosition.y} 
        onUnfocus={() => setSelectedUser('')} 
        onDisconnect={() => handleDisconnect()} 
        onBan={() => handleBan()}
        />
        <SlideInRight state={visible}>
            <div className="userlist">
                <h1 className="userlist__title">
                    Participants
                </h1>
                <div className="userlist__users">
                    { users && users.length ? users.map((user: IUser) =>
                        <User 
                        nickname={user.nickname} 
                        peerId={user.peerId} 
                        key={user.peerId} 
                        onSelected={(e: OnSelectCallback) => handleUserSelection(e.id, { x: e.x, y: e.y })} 
                        />
                    ) : null }
                </div>
            </div>
        </SlideInRight>
        </>
    )
}

export default Userlist
