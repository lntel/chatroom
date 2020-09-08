import React, { FC } from 'react'
import './index.scss'

import Dropdown from '../Dropdown'
import Modal from '../Modal'

interface SyntaxModalProps {
    visible: boolean
}

const SyntaxModal: FC<SyntaxModalProps> = ({ visible }) => {
    return (
        <Modal visible={visible}>
            <div className="syntax-modal">
                <Dropdown onSelected={console.log} options={[
                    {
                        text: 'test',
                        value: 'dshaua'
                    }
                ]} />
            </div>
        </Modal>
    )
}

export default SyntaxModal
