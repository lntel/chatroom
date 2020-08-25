import React, { FC, useEffect, useRef } from 'react'
import { User } from '../../types';

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
        <video ref={videoRef} muted={user.self} className="videolist__video" onLoadedMetadata={() => videoRef.current?.play()}></video>
    )
}

export default Video
