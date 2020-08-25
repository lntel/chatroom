import React, { FC } from 'react'
import { UserStream } from '../../types'
import Video from '../Video'
import './index.scss'

interface VideolistProps {
    streams: UserStream[]
    onStreamEnded: (id: string) => void
}

const Videolist: FC<VideolistProps> = ({ streams, onStreamEnded }) => {
    return (
        <div className="videolist">
            { streams && streams.length ? streams.map(stream => 
                <Video user={stream.user} stream={stream.stream} onStreamEnded={(id: string) => onStreamEnded(id)} key={stream.user.peerId} />
            ) : null }
        </div>
    )
}

export default Videolist
