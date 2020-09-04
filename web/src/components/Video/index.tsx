import React, { FC, useEffect, useRef, useState } from 'react'

import { User } from '../../types';

import SoundMeter from '../../soundMeter'

import CloseIcon from '@material-ui/icons/Close';

interface VideoProps {
    stream: MediaStream
    user: User
    onStreamEnded: (peerId: string) => void
}

const Video: FC<VideoProps> = ({ stream, onStreamEnded, user }) => {
    const [speaking, setSpeaking] = useState<string>('0');

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        videoRef.current!.srcObject = stream;
        
        const audioContext = new AudioContext();

        const soundMeter = new SoundMeter(audioContext);

        soundMeter.connectToSource(stream, (e) => {
            if(e) return console.error(e);

            interval = setInterval(() => {
                setSpeaking(soundMeter.instant.toFixed(2));
            }, 100);

            stream.getVideoTracks()[0].onended = function(e) {

                soundMeter.stop();

                clearInterval(interval);

                onStreamEnded(user.peerId)
            }
        })

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div className={speaking !== '0.00' ? "videolist__video videolist__video--speaking" : "videolist__video"}>
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
