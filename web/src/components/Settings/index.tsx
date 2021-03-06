import React, { FC, useContext, useEffect, useReducer, useState } from 'react'
import './index.scss'

import Modal from '../Modal'
import Dropdown from '../Dropdown';

import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import VideocamIcon from '@material-ui/icons/Videocam';
import WarningIcon from '@material-ui/icons/Warning';

import { settingsReducer } from '../../reducers/settings';
import { SettingsContext } from '../../context/SettingsContext';
import Toggle from '../Toggle';

interface SettingsModalProps {
    visible: boolean
    onClose: () => void
}

const SettingsModal: FC<SettingsModalProps> = ({ visible, onClose }) => {
    const [videoSources, setVideoSources] = useState<MediaDeviceInfo[]>([]);
    const [audioSources, setAudioSources] = useState<MediaDeviceInfo[]>([]);
    const [audioOutputSources, setAudioOutputSources] = useState<MediaDeviceInfo[]>([]);

    const { state, dispatch } = useContext(SettingsContext);

    useEffect(() => {
        if(!state.videoInput && videoSources.length) {

            console.log(videoSources[0].deviceId)

            dispatch({
                type: 'UPDATE_VIDEO_INPUT',
                deviceId: videoSources[0].deviceId
            });
        }

        if(!state.audioInput && audioSources.length) {
            dispatch({
                type: 'UPDATE_AUDIO_INPUT',
                deviceId: audioSources[0].deviceId
            });
        }

        if(!state.audioOutput && audioOutputSources.length) {
            dispatch({
                type: 'UPDATE_AUDIO_OUTPUT',
                deviceId: audioOutputSources[0].deviceId
            });
        }

        if(!state.imageResolver) {
            dispatch({
                type: 'UPDATE_IMG_RESOLVER',
                value: false
            });
        }
    }, [videoSources, audioSources, audioOutputSources]);

    useEffect(() => {
        requestDevicePermission();

        init();
    }, []);

    useEffect(() => {
        if(visible) {
            init();
        }
    }, [visible]);

    const handleVideoSelection = (deviceId: string) => {

        console.log(deviceId)

        dispatch({
            type: 'UPDATE_VIDEO_INPUT',
            deviceId: deviceId
        });
    }

    const handleAudioOutputSelection = (deviceId: string) => {

        console.log(deviceId)

        dispatch({
            type: 'UPDATE_AUDIO_OUTPUT',
            deviceId: deviceId
        });
    }

    const handleAudioInputSelection = (deviceId: string) => {

        console.log(deviceId)

        dispatch({
            type: 'UPDATE_AUDIO_INPUT',
            deviceId: deviceId
        });
    }

    const init = async () => {
        setAudioOutputSources(await getDevices('audiooutput'));
        setAudioSources(await getDevices('audioinput'));
        setVideoSources(await getDevices('videoinput'));
    }

    const getDevices = async (type: MediaDeviceKind) => {
        let deviceList: any = [];

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            deviceList = [...devices.filter(device => device.kind === type)];
        }
        catch(err) {
            console.error(err);
        }

        return deviceList;
    }

    const requestDevicePermission = async () => {
        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
    }

    return (
        <Modal visible={visible} title="Video/Audio Settings" onUnfocus={() => onClose()}>
            <div className="settings-modal">
                <p className="settings-modal__description">
                    Here you can change which device is used by default when broadcasting. We offer customisation for both audio and video.
                </p>
                <h2 className="settings-modal__header">
                    Audio Settings
                </h2>
                <p className="settings-modal__audio-description">
                    You can configure your audio settings here which includes both your input and output device devices.
                </p>
                <div className="settings-modal__audio">
                    <div className="settings-modal__audio__type">
                        <p className="settings-modal__audio__title">
                            <MicIcon>Filled</MicIcon>
                            Input device
                        </p>
                        <Dropdown onSelected={v => handleAudioInputSelection(v)} selected={state.audioInput} options={[...audioSources.map((source) => {
                            return {
                                text: source.label,
                                value: source.deviceId
                            }
                        })]} 
                        />
                    </div>
                    <div className="settings-modal__audio__type">
                        <p className="settings-modal__audio__title">
                            <HeadsetIcon>Filled</HeadsetIcon>
                            Output device
                        </p>
                        <Dropdown onSelected={v => handleAudioOutputSelection(v)} selected={state.audioOutput} options={[...audioOutputSources.map((source) => {
                            return {
                                text: source.label,
                                value: source.deviceId
                            }
                        })]} 
                        />
                    </div>
                </div>
                <h2 className="settings-modal__header">
                    Video Settings
                </h2>
                <p className="settings-modal__video-description">
                    Here you can customise your default video input device.
                </p>
                <p className="settings-modal__video__title">
                    <VideocamIcon>Filled</VideocamIcon>
                    Input device
                </p>
                <Dropdown margin="0 0 2em 0" onSelected={v => handleVideoSelection(v)} selected={state.videoInput} options={[...videoSources.map((source) => {
                    return {
                        text: source.label,
                        value: source.deviceId
                    }
                })]} 
                />
                <h2 className="settings-modal__header">
                    <WarningIcon style={{margin: '0 7px 0 0'}}>Filled</WarningIcon>
                    Image Resolver
                </h2>
                <p className="settings-modal__video-description">
                    Our image resolver when enabled preloads images from URL's that are posted in chat, this feature is currently insecure.
                </p>
                <Toggle 
                style={{
                    margin: '0 0 1em 0'
                }}
                onToggle={e => dispatch({
                    type: 'UPDATE_IMG_RESOLVER', 
                    value: e 
                })} 
                toggled={state.imageResolver} 
                />
                <button className="settings-modal__close" onClick={() => onClose()}>
                    Close
                </button>
            </div>
        </Modal>
    )
}

export default SettingsModal
