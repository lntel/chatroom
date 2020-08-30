import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Chat from '../../components/Chat'
import Controls from '../../components/Controls'
import Form from '../../components/Form'
import Modal from '../../components/Modal'
import SettingsModal from '../../components/Settings'
import Textbox from '../../components/Textbox'
import Userlist from '../../components/Userlist'
import Videolist from '../../components/Videolist'
import ReconnectModal from '../../components/ReconnectModal'
import './index.scss'

import { UserStream, ClientEvents, User, ChatMessage } from '../../types'

const Main = () => {
    const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
    const [userlistVisible, setUserlistVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [reconnectVisible, setReconnectVisible] = useState<boolean>(false);
    const [chatVisible, setChatVisible] = useState<boolean>(false);
    const [socket, setSocket] = useState<typeof Socket | null>(null);
    const [streams, setStreams] = useState<UserStream[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [nickname, setNickname] = useState<string>('');
    const [peerListening, setPeerListening] = useState<boolean>(false);

    const peer = useRef<Peer>(new Peer());

    useEffect(() => {

        if(!peer || !users.length) return;
        
        setPeerListening(true);

    }, [peer, users]);

    useEffect(() => {

        if(peerListening) return;


        // peer.current.on('call', (request) => {
        //     try {
        //         console.log({
        //             peer: peer,
        //             users: users
        //         })
                
        //         request.answer();

        //         const userObject = users.find(user => user.peerId == request.peer)
    
        //         if(!userObject) {
        //             console.log("not found")
    
        //             return request.close();
        //         }
    
        //         request.on('stream', (stream) => {
        //             setStreams(oldStreams => [
        //                 ...oldStreams,
        //                 {
        //                     stream: stream,
        //                     user: userObject
        //                 }
        //             ]);
        //         })
        //     }
        //     catch(err) {
        //         console.error(err)
        //     }

        // });
    }, [peerListening]);

    useEffect(() => {
        const client = io('http://localhost:4000');
    
        setSocket(client);

        peer.current.on('call', (call) => {
            console.log(users)
        })

        client.on('connect', () => {
            setModalVisible(true);
        });

        client.on(ClientEvents.userJoined, (client: User) => {

            setUsers(oldUsers=> [
                ...oldUsers,
                client
            ]);
        });

        client.on(ClientEvents.banUser, () => {
            console.log('banned')
        });

        client.on(ClientEvents.userLeft, (nickname: string) => {

            console.log(nickname)

            setUsers(oldUsers => [
                ...oldUsers.filter(user => user.nickname !== nickname)
            ]);
        });

        client.on(ClientEvents.userList, (clients: User[]) => {
            setUsers(oldUsers => [
                ...oldUsers,
                ...clients
            ]);
        });

        client.on(ClientEvents.sendMessage, (message: ChatMessage) => {

            if(message.user.nickname === nickname) message.user.self = true;

            setMessages(oldMessages => [
                ...oldMessages,
                message
            ]);
        });

        client.on('disconnect', () => {
            setUsers([]);
            setModalVisible(false);
            setReconnectVisible(true);
        })
    }, []);

    const handleMicEvent = (e: boolean) => {
        console.log(e)
    }

    const handleStreamEvent = (e: MediaStream) => {
        console.log("streaming")

        if(users.length) {
            users.map(user => {
                peer.current.call(user.peerId, e);
            });
        }

        setStreams(old => [
            ...old,
            {
                stream: e,
                user: {
                    nickname: 'test',
                    peerId: 'tedfcsmf',
                    self: true
                }
            }
        ]);
    }

    const handleStreamEnded = (id: string) => {
        setStreams([
            ...streams.filter(stream => stream.user.peerId !== id)
        ]);
    }

    const handleNickname = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(nickname.length === 0 || nickname.length > 25) return;

        socket?.emit(ClientEvents.setNickname, nickname, peer.current.id);

        setModalVisible(false);
    }

    const handleMessageSend = (content: string) => {
        socket?.emit(ClientEvents.sendMessage, content);
    }

    const handleReconnect = () => {
        socket?.connect();

        setReconnectVisible(false);
    }

    return (
        <div className="main-page">
            <Userlist 
            users={users} 
            socket={socket}
            visible={userlistVisible} 
            />
            <Videolist 
            streams={streams} 
            onStreamEnded={(id: string) => handleStreamEnded(id)} 
            />
            <Chat 
            visible={chatVisible} 
            messages={messages} 
            onMessage={(content: string) => handleMessageSend(content)} 
            />
            <ReconnectModal
            visible={reconnectVisible}
            onReconnect={() => handleReconnect()}
            />
            <Controls 
            onMicEvent={(e: boolean) => handleMicEvent(e)} 
            onStreamEvent={(e) => handleStreamEvent(e)} 
            onChat={() => setChatVisible(!chatVisible)} 
            onUserlist={() => setUserlistVisible(!userlistVisible)} 
            onSettings={() => setSettingsVisible(!settingsVisible)}
            userlistVisible={userlistVisible}
            chatVisible={chatVisible}
            />
            <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
            <Modal title="Please enter a nickname" visible={modalVisible}>
                <Form onSubmit={e => handleNickname(e)}>
                    <Textbox 
                    onChange={(e: string) => setNickname(e)} 
                    value={nickname} 
                    padding="1.8em" 
                    margin="0 0 1em 0"
                    placeholder="Nickname" 
                    className="main-page__nickname-input"
                    />
                    <button className="main-page__set-nickname">
                        Set Nickname
                    </button>
                </Form>
            </Modal>
        </div>
    )
}

export default Main
