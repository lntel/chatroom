import React, { FC, useState } from 'react'
import './index.scss'

import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import MicOffIcon from '@material-ui/icons/MicOff';
import ChatIcon from '@material-ui/icons/Chat';
import MicIcon from '@material-ui/icons/Mic';

interface ControlsProps {
    onMicEvent: (e: boolean) => void
    onStreamEvent: (e: MediaStream) => void
    onChat: () => void
}

const Controls: FC<ControlsProps> = ({ onMicEvent, onStreamEvent, onChat }) => {
    const [muted, setMuted] = useState<boolean>(true);

    const handleMicChange = () => {

        onMicEvent(!muted);

        setMuted(!muted);
    }

    const handleScreenshare = async () => {

        const mediaDevices = navigator.mediaDevices as any;

        const stream = await mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });

        onStreamEvent(stream);
    }

    const handleWebcam = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        onStreamEvent(stream);

    }

    return (
        <div className="controls">
            <button className="controls__chat" onClick={() => onChat()}>
                <ChatIcon>Filled</ChatIcon>
            </button>
            <button className="controls__camera" onClick={() => handleWebcam()}>
                <CameraAltIcon>Filled</CameraAltIcon>
            </button>
            <button className="controls__screenshare" onClick={() => handleScreenshare()}>
                <ScreenShareIcon>Filled</ScreenShareIcon>
            </button>
            <button className={muted ? "controls__microphone controls__microphone--muted" : "controls__microphone controls__microphone--unmuted"} onClick={() => handleMicChange()}>
                { muted ? (
                    <MicOffIcon>Filled</MicOffIcon>
                ) : (
                    <MicIcon>Filled</MicIcon>
                ) }
            </button>
        </div>
    )
}

export default Controls
