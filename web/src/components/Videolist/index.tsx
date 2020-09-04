import React, { FC, useEffect, useState } from 'react'
import { UserStream } from '../../types'
import Video from '../Video'
import './index.scss'

interface VideolistProps {
    streams: UserStream[]
    onStreamEnded: (id: string) => void
}

const Videolist: FC<VideolistProps> = ({ streams, onStreamEnded }) => {
    const [className, setClassName] = useState<string>('videolist');

    useEffect(() => {

        console.log(streams.length)

        switch(streams.length) {

            case 0:
                setClassName('videolist');
            break;

            case 2:
                setClassName('videolist videolist--2')
            break;

            case 3:
                setClassName('videolist videolist--3')
            break;
        }
    }, [streams]);

    return (
        <div className={className}>
            { streams && streams.length ? streams.map(stream => 
                <Video 
                user={stream.user} 
                stream={stream.stream} 
                onStreamEnded={(id: string) => onStreamEnded(id)} 
                key={stream.user.peerId} 
                />
            ) : null }
        </div>
    )
}

export default Videolist
