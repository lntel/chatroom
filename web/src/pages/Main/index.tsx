import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Controls from '../../components/Controls'
import Userlist from '../../components/Userlist'
import Videolist from '../../components/Videolist'
import { UserStream } from '../../types'
import './index.scss'

const Main = () => {
    const [streams, setStreams] = useState<UserStream[]>([]);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.on('disconnect', () => {
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

    return (
        <div className="main-page">
            <Userlist />
            <Videolist streams={streams} onStreamEnded={(id: string) => handleStreamEnded(id)} />
            <Controls onMicEvent={(e: boolean) => handleMicEvent(e)} onStreamEvent={(e) => handleStreamEvent(e)} />
        </div>
    )
}

export default Main
