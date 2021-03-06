import React, { FC, useContext, useEffect, useReducer, useState } from 'react'
import './index.scss'

import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import MicOffIcon from '@material-ui/icons/MicOff';
import PeopleIcon from '@material-ui/icons/People';
import ClearIcon from '@material-ui/icons/Clear';
import ChatIcon from '@material-ui/icons/Chat';
import MicIcon from '@material-ui/icons/Mic';
import { FadeIn } from '../Transitions';
import { settingsReducer } from '../../reducers/settings';
import { SettingsContext } from '../../context/SettingsContext';
import { ChatMessage } from '../../types';

interface ControlsProps {
    onMicEvent: (e: boolean) => void
    onStreamEvent: (e: MediaStream) => void
    onStreamClose: () => void
    onChat: () => void
    onUserlist: () => void
    onSettings: () => void
    messages: ChatMessage[]
    userlistVisible: boolean
    chatVisible: boolean
    streaming: boolean
    muted: boolean
}

const Controls: FC<ControlsProps> = ({ onMicEvent, onStreamEvent, onChat, onUserlist, userlistVisible, chatVisible, onSettings, streaming, onStreamClose, muted, messages }) => {
    //const [muted, setMuted] = useState<boolean>(false);
    const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);

    const {state, dispatch} = useContext(SettingsContext);

    const handleMicChange = () => {

        onMicEvent(!muted);
    }

    useEffect(() => {
        setUnreadMessageCount(messages.filter(message => !message.read).length);
    }, [messages]);

    const handleScreenshare = async () => {

        const mediaDevices = navigator.mediaDevices as any;

        const stream: MediaStream = await mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        const microphone = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: {
                    exact: state.audioInput!
                }
            }
        });

        stream.addTrack(microphone.getAudioTracks()[0]);

        onStreamEvent(stream);
    }

    const handleWebcam = async () => {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: {
                    exact: state.videoInput
                }
            },
            audio: {
                deviceId: {
                    exact: state.audioInput
                }
            }
        });

        onStreamEvent(stream);

    }

    const handleStreamClose = () => {
        onStreamClose();
    }

    return (
        <div className="controls">
            <button className="controls__chat" onClick={() => onUserlist()}>
                { !userlistVisible ? (
                    <PeopleIcon>Filled</PeopleIcon>
                ) : (
                    <ClearIcon>Filled</ClearIcon>
                ) }
            </button>
            <button className="controls__chat" onClick={() => onChat()}>
                { !chatVisible ? (
                    <>
                        <FadeIn state={Boolean(unreadMessageCount > 0)}>
                            <span className="controls__chat__unread">
                                { unreadMessageCount }
                            </span>
                        </FadeIn>
                        <ChatIcon>Filled</ChatIcon>
                    </>
                ) : (
                    <ClearIcon>Filled</ClearIcon>
                ) }
            </button>
            { streaming ? (
                <button className="controls__stream-stop" onClick={() => handleStreamClose()}>
                    <VideocamOffIcon>Filled</VideocamOffIcon>
                </button>
            ) : (
                <>
                <button className="controls__camera" onClick={() => handleWebcam()}>
                    <CameraAltIcon>Filled</CameraAltIcon>
                </button>
                <button className="controls__screenshare" onClick={() => handleScreenshare()}>
                    <ScreenShareIcon>Filled</ScreenShareIcon>
                </button>
                </>
            ) }
            <button className="controls__settings" onClick={() => onSettings()}>
                <SettingsIcon>Filled</SettingsIcon>
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
