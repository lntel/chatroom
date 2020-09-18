import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'

import Peer, { MediaConnection } from 'peerjs'
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
import config from '../../config';
import { UserStream, ClientEvents, User, ChatMessage } from '../../types'
import { SettingsContext } from '../../context/SettingsContext'
import ConnectionModal from '../../components/ConnectionModal'
import { SocketContext } from '../../context/SocketContext'

const Main = () => {
    const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
    const [userlistVisible, setUserlistVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [connectionModal, setConnectionModal] = useState<boolean>(true);
    const [reconnectVisible, setReconnectVisible] = useState<boolean>(false);
    const [chatVisible, setChatVisible] = useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(false);
    const [streams, setStreams] = useState<UserStream[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [nickname, setNickname] = useState<string>('');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const { socket, setSocket } = useContext(SocketContext);

    const peer = useRef<Peer>(new Peer());

    const { state, dispatch } = useContext(SettingsContext);

    const allowedDomains = [

    ];

    const handlePeerCall = (call: MediaConnection) => {
        try {
            console.log(call)

            let streamRecieved: boolean = false;

            const userIndex = users.findIndex(user => user.peerId == call.peer)

            const dupeResult = streams.find(strm => strm.user.nickname === users[userIndex].nickname);

            if(userIndex === -1 || dupeResult) return;

            call.answer();

            call.on('stream', (stream) => {

                if(streamRecieved) return;

                streamRecieved = true;

                console.log({
                    users: users,
                    streams: streams
                })

                const newUserObject = users.find(user => user.nickname === users[userIndex].nickname)!;

                setUsers(oldUsers => [
                    ...oldUsers.filter(user => user.nickname !== users[userIndex].nickname),
                    {
                        ...newUserObject,
                        streaming: true
                    }
                ]);

                //if(streams.find(strm => strm.user.peerId === userObject.peerId)) return;

                setStreams(oldStreams => [
                    ...oldStreams,
                    {
                        stream: stream,
                        user: users[userIndex]
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

            peer.current.call(client.peerId, localStream, {
                metadata: {
                    nickname: nickname
                }
            });
        }

        setUsers(oldUsers=> [
            ...oldUsers,
            {
                ...client,
                streaming: false
            }
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

    const onStreamStopped = (id: string) => {

        if(peer.current.id === id) {
            setLocalStream(null);
        }

        setUsers(oldUsers => [
            ...oldUsers.filter(user => user.peerId !== id),
            {
                ...oldUsers.find(user => user.peerId === id)!,
                streaming: false
            }
        ]);

        setStreams(oldStreams => [
            ...oldStreams.filter(stream => stream.user.peerId !== id)
        ]);
    }

    const onMessageRecieved = (message: ChatMessage) => {
        const imageUrlEx = /(?:http(?:s)?\:\/\/)(?:www\.)?[\w\.\-\/\d\%]+\.(?:jp(?:e)?g|png|gif)(?:\?.+)?/g;
        const domainEx = /(?:http(?:s)?\:\/\/(?:www\.)?)([a-zA-Z0-9\.\-]{2,253})(?:\.[a-zA-Z]{2,4})/g;

        if(message.user.nickname === nickname) message.user.self = true;

        const imageUrl = message.content.match(imageUrlEx);
        //const domain = message.content.match(domainEx);

        if(imageUrl && state.imageResolver) {
            return setMessages(oldMessages => [
                ...oldMessages,
                {
                    ...message,
                    content: '',
                    image: message.content
                }
            ]);
        }

        setMessages(oldMessages => [
            ...oldMessages,
            message
        ]);
    }

    useEffect(() => {

        if(peer.current) {
            peer.current.on('call', handlePeerCall);
        }
        
        if(socket) {
            socket.on(ClientEvents.userJoined, onUserJoined);
            socket.on(ClientEvents.userLeft, onUserLeft);
            socket.on(ClientEvents.userStreamStop, onStreamStopped);
            socket.on(ClientEvents.sendMessage, onMessageRecieved);
        }


        return () => {
            peer.current.off('call', handlePeerCall);
            socket?.off(ClientEvents.userJoined, onUserJoined);
            socket?.off(ClientEvents.userLeft, onUserLeft);
            socket?.off(ClientEvents.userStreamStop, onStreamStopped);
            socket?.off(ClientEvents.sendMessage, onMessageRecieved);
        }
    }, [users, localStream, socket, streams, state]);

    useEffect(() => {
        const client = io(config.webSocketURL);
    
        setSocket(client);

        client.on('connect', () => {
            setConnectionModal(false);
            setModalVisible(true);
        });

        client.on(ClientEvents.banUser, () => {
            console.log('banned')
        });

        client.on(ClientEvents.userList, (clients: User[]) => {
            setUsers(oldUsers => [
                ...oldUsers,
                ...clients
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

        if(localStream) {

            const audioTracks = localStream.getAudioTracks();

            if(audioTracks.length > 1) {
                audioTracks.map((track) => {
                    track.enabled = !e;
                })
            } else if(audioTracks.length === 1) {
                audioTracks[0].enabled = !e;
            }

            setMuted(!muted);
        }

    }

    const handleChatToggle = () => {

        if(chatVisible) return setChatVisible(false);

        if(userlistVisible) {
            setUserlistVisible(false);

            let delay = setTimeout(() => {
                setChatVisible(true);

                clearTimeout(delay);
            }, 300);
        } else {
            setChatVisible(true);
        }
    }

    const handleUserlistToggle = () => {

        if(userlistVisible) return setUserlistVisible(false);

        if(chatVisible) {
            setChatVisible(false);

            let delay = setTimeout(() => {
                setUserlistVisible(true);

                clearTimeout(delay);
            }, 300);
        } else {
            setUserlistVisible(true);
        }
    }

    const handleStreamEvent = (e: MediaStream) => {

        setLocalStream(e);

        if(users.length) {
            users.filter(user => user.peerId !== peer.current.id).map(user => {
                peer.current.call(user.peerId, e, {
                    metadata: {
                        nickname: nickname
                    }
                });
            });
        }

        setUsers(oldUsers => [
            ...oldUsers.filter(user => user.nickname !== nickname),
            {
                ...oldUsers.find(user => user.nickname === nickname)!,
                streaming: true
            }
        ]);

        setStreams(old => [
            ...old,
            {
                stream: e,
                user: {
                    nickname: nickname,
                    peerId: peer.current.id,
                    self: true,
                    streaming: true
                }
            }
        ]);
    }

    const handleStreamEnded = (id: string) => {

        socket?.emit(ClientEvents.userStreamStop, id);

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

    const handleLocalStreamEnd = () => {
        setLocalStream(null);
        setMuted(false);

        setStreams(oldStreams => [
            ...oldStreams.filter(stream => stream.user.peerId !== peer.current.id)
        ]);

        socket?.emit(ClientEvents.userStreamStop, peer.current.id);
    }

    const handleMessageRead = (unreadMessages: ChatMessage[]) => {

        setMessages(oldMessages => [
            ...oldMessages.filter(message => message.read),
            ...unreadMessages
        ]);
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
            onMessageRead={(messages: ChatMessage[]) => handleMessageRead(messages)}
            onMessage={(content: string) => handleMessageSend(content)} 
            />
            <ReconnectModal
            visible={reconnectVisible}
            onReconnect={() => handleReconnect()}
            />
            <Controls 
            onMicEvent={(e: boolean) => handleMicEvent(e)} 
            onStreamEvent={(e) => handleStreamEvent(e)} 
            onChat={() => handleChatToggle()} 
            onUserlist={() => handleUserlistToggle()} 
            onSettings={() => setSettingsVisible(!settingsVisible)}
            onStreamClose={() => handleLocalStreamEnd()}
            userlistVisible={userlistVisible}
            chatVisible={chatVisible}
            streaming={Boolean(localStream)}
            muted={muted}
            messages={messages}
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
            <ConnectionModal visible={connectionModal} />
        </div>
    )
}

export default Main
