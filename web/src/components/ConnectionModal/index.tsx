import React, { FC } from 'react'
import Modal from '../Modal'
import './index.scss'

interface ConnectionModalProps {
    visible: boolean
}

const ConnectionModal: FC<ConnectionModalProps> = ({ visible }) => {
    return (
        <Modal visible={visible} title="Connecting to chatroom...">
            <div className="connection-modal">
                <p className="connection-modal__description">
                    Please be patient while establishing a connection
                </p>
                <div className="connection-modal__spinner"></div>
            </div>
        </Modal>
    )
}

export default ConnectionModal
