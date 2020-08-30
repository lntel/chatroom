import Peer, { MediaConnection } from 'peerjs'
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
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const peer = useRef<Peer>(new Peer());

    const handlePeerCall = (call: MediaConnection) => {
        try {
            console.log(call)
            
            call.answer();

            const userObject = users.find(user => user.peerId == call.peer)

            const dupeResult = streams.find(strm => strm.user.nickname === userObject?.nickname);

            if(!userObject || dupeResult) {
                console.log("not found")

                return call.close();
            }

            call.on('stream', (stream) => {


                setStreams(oldStreams => [
                    ...oldStreams,
                    {
                        stream: stream,
                        user: userObject
                    }
                ]);
            })
        }
        catch(err) {
            console.error(err)
        }
    }

    const onUserJoined = (client: User) => {
        console.log({
            ls: localStream,
            peer: peer.current
        })

        if(localStream && peer.current) {

            console.log(`Attempting to call ${client.peerId}`)

            peer.current.call(client.peerId, localStream);
        }

        setUsers(oldUsers=> [
            ...oldUsers,
            client
        ]);
    }

    const onUserLeft = (nickname: string) => {

        console.log(nickname)

        setStreams(oldStreams => [
            ...oldStreams.filter(stream => stream.user.nickname !== nickname)
        ]);

        setUsers(oldUsers => [
            ...oldUsers.filter(user => user.nickname !== nickname)
        ]);
    }

    useEffect(() => {

        if(peer.current) {
            peer.current.on('call', handlePeerCall);
        }
        
        if(socket) {
            socket.on(ClientEvents.userJoined, onUserJoined);
            socket.on(ClientEvents.userLeft, onUserLeft);
        }


        return () => {
            peer.current.off('call', handlePeerCall);
            socket?.off(ClientEvents.userJoined, onUserJoined);
            socket?.off(ClientEvents.userLeft, onUserLeft);
        }
    }, [users, localStream, socket]);

    useEffect(() => {
        const client = io('http://localhost:4000');
    
        setSocket(client);

        client.on('connect', () => {
            setModalVisible(true);
        });

        // client.on(ClientEvents.userJoined, (client: User) => {

        //     console.log({
        //         ls: localStream,
        //         peer: peer.current
        //     })

        //     if(localStream && peer.current) {

        //         console.log(`Attempting to call ${client.peerId}`)

        //         peer.current.call(client.peerId, localStream);
        //     }

        //     setUsers(oldUsers=> [
        //         ...oldUsers,
        //         client
        //     ]);
        // });

        client.on(ClientEvents.banUser, () => {
            console.log('banned')
        });

        // client.on(ClientEvents.userLeft, (nickname: string) => {

        //     console.log(nickname)

        //     setUsers(oldUsers => [
        //         ...oldUsers.filter(user => user.nickname !== nickname)
        //     ]);
        // });

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

        setLocalStream(e);

        if(users.length) {
            users.filter(user => user.peerId !== peer.current.id).map(user => {
                peer.current.call(user.peerId, e);
            });
        }

        setStreams(old => [
            ...old,
            {
                stream: e,
                user: {
                    nickname: nickname,
                    peerId: peer.current.id,
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
