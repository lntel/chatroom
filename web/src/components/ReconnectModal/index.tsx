import React, { FC } from 'react'
import './index.scss'

import Modal from '../Modal'

interface ReconnectModalProps {
    visible: boolean
    onReconnect: () => void
}


const ReconnectModal: FC<ReconnectModalProps> = ({ visible, onReconnect }) => {
    return (

        <Modal visible={visible} title="You have been disconnected">
            <p className="reconnect-message">
                You have been disconnected for 20 seconds of inactivity. Please reconnect and assign yourself a nickname.
            </p>
            <button className="reconnect-button" onClick={() => onReconnect()}>
                Reconnect
            </button>
        </Modal>
        
    )
}

export default ReconnectModal
