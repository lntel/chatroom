import React, { FC, useEffect, useState } from 'react'
import './index.scss'

import Modal from '../Modal'

interface SettingsModalProps {
    visible: boolean
}

const SettingsModal: FC<SettingsModalProps> = ({ visible }) => {
    const [videoSources, setVideoSources] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        requestDevicePermission();

        init();
    }, []);

    const init = async () => {
        console.log(await getDevices('videoinput'))
    }

    const getDevices = async (type: MediaDeviceKind) => {
        let deviceList = [];

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();

            deviceList = [...devices.filter(device => device.kind === type)];

            return deviceList;
        }
        catch(err) {
            console.error(err);
        }
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
                test
            </div>
        </Modal>
    )
}

export default SettingsModal
