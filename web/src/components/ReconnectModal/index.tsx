import React, { FC } from 'react'
import Modal from '../Modal'

interface ReconnectModalProps {
    visible: boolean

}


const ReconnectModal: FC<ReconnectModalProps> = ({ visible }) => {
    return (

        <Modal visible={visible} title="You have been disconnected">
            
        </Modal>
        
    )
}

export default ReconnectModal
