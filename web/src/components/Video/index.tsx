import React, { FC, useEffect, useRef } from 'react'
import { User } from '../../types';

import CloseIcon from '@material-ui/icons/Close';

interface VideoProps {
    stream: MediaStream
    user: User
    onStreamEnded: (peerId: string) => void
}

const Video: FC<VideoProps> = ({ stream, onStreamEnded, user }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        videoRef.current!.srcObject = stream;

        stream.getTracks()[0].onended = function(e) {
            onStreamEnded(user.peerId)
        }

        
    }, []);

    return (
        <div className="videolist__video">
            <div className="videolist__video__data">
                <CloseIcon>Filled</CloseIcon>
            </div>
            <video 
            ref={videoRef} 
            muted={user.self} 
            className="videolist__video" 
            onLoadedMetadata={() => videoRef.current?.play()}></video>
        </div>
    )
}

export default Video
