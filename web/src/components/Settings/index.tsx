import React, { FC, useEffect, useState } from 'react'
import './index.scss'

import Modal from '../Modal'
import Dropdown from '../Dropdown';

interface SettingsModalProps {
    visible: boolean
    onClose: () => void
}

const SettingsModal: FC<SettingsModalProps> = ({ visible, onClose }) => {
    const [videoSources, setVideoSources] = useState<MediaDeviceInfo[]>([]);
    const [audioSources, setAudioSources] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        requestDevicePermission();

        init();
    }, []);

    const init = async () => {
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
        <Modal visible={visible} title="Video/Audio Settings">
            <div className="settings-modal">
                <p className="settings-modal__description">
                    Here you can change which device is used by default when broadcasting. We offer customisation for both audio and video.
                </p>
                <h2 className="settings-modal__header">
                    Voice Settings
                </h2>
                <Dropdown margin="0 0 1em 0" options={[...audioSources.map((source) => {
                    return {
                        text: source.label,
                        value: source.deviceId
                    }
                })]} 
                />
                <h2 className="settings-modal__header">
                    Video Settings
                </h2>
                <Dropdown margin="0 0 2em 0" options={[...videoSources.map((source) => {
                    return {
                        text: source.label,
                        value: source.deviceId
                    }
                })]} 
                />
                <button className="settings-modal__close" onClick={() => onClose()}>
                    Close
                </button>
            </div>
        </Modal>
    )
}

export default SettingsModal
