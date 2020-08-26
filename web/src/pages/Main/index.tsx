import Peer from 'peerjs'
import React, { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import Chat from '../../components/Chat'
import Controls from '../../components/Controls'
import Modal from '../../components/Modal'
import Textbox from '../../components/Textbox'
import Userlist from '../../components/Userlist'
import Videolist from '../../components/Videolist'
import { UserStream, ClientEvents, User, ChatMessage } from '../../types'
import './index.scss'

const Main = () => {
    const [streams, setStreams] = useState<UserStream[]>([]);
    const [nickname, setNickname] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(true);
    const [socket, setSocket] = useState<typeof Socket | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [chatVisible, setChatVisible] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        console.log(users);
    }, [users]);

    useEffect(() => {
        const client = io('http://localhost:4000');
        const peer = new Peer();

        setPeer(peer);
        setSocket(client);

        client.on(ClientEvents.userJoined, (client: User) => {

            setUsers(oldUsers=> [
                ...oldUsers,
                client
            ]);
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
            setMessages(oldMessages => [
                ...oldMessages,
                message
            ]);
        });

        client.on('disconnect', () => {
            console.log('dis');
        })
    }, []);

    const handleMicEvent = (e: boolean) => {
        console.log(e)
    }

    const handleStreamEvent = (e: MediaStream) => {
        console.log("streaming")

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

    const handleNickname = () => {
        if(nickname.length === 0 || nickname.length > 25) return;

        socket?.emit(ClientEvents.setNickname, nickname, peer?.id);

        setModalVisible(false);
    }

    const handleMessageSend = (content: string) => {
        socket?.emit(ClientEvents.sendMessage, content);
    }

    return (
        <div className="main-page">
            <Userlist users={users} />
            <Videolist streams={streams} onStreamEnded={(id: string) => handleStreamEnded(id)} />
            <Chat visible={chatVisible} messages={messages} onMessage={(content: string) => handleMessageSend(content)} />
            <Controls onMicEvent={(e: boolean) => handleMicEvent(e)} onStreamEvent={(e) => handleStreamEvent(e)} onChat={() => setChatVisible(!chatVisible)} />
            <Modal title="Please enter a nickname" visible={modalVisible}>
                <Textbox 
                onChange={(e: string) => setNickname(e)} 
                value={nickname} 
                padding="1.8em" 
                margin="0 0 1em 0"
                bgColor="#4B5162" 
                fgColor="#f3f3f3" 
                placeholder="Nickname" 
                className="main-page__nickname-input"
                />
                <button className="main-page__set-nickname" onClick={() => handleNickname()}>
                    Set Nickname
                </button>
            </Modal>
        </div>
    )
}

export default Main
