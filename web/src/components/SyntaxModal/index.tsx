import React, { FC, useContext, useEffect, useState } from 'react'
import './index.scss'

import Dropdown from '../Dropdown'
import Modal from '../Modal'

import Languages from './langs'
import TextArea from '../TextArea'
import Form from '../Form'

import { Socket } from 'socket.io-client'
import { SocketContext } from '../../context/SocketContext'
import { ClientEvents } from '../../types'

interface SyntaxModalProps {
    visible: boolean
    onUnfocus: () => void
}

interface Languages {
    text: string
    value: string
}

const SyntaxModal: FC<SyntaxModalProps> = ({ visible, onUnfocus }) => {
    const [code, setCode] = useState<string>('');
    const [selectedLang, setSelectedLang] = useState<string>('');
    const [langs, setLangs] = useState<Languages[]>([]);

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        setLangs(Languages);
    }, []);

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket?.emit(ClientEvents.sendCode, selectedLang, code);

        onUnfocus();
    }

    return (
        <Modal visible={visible}>
            <Form className="syntax-modal" onSubmit={(e) => handleSend(e)}>
                <Dropdown onSelected={lang => setSelectedLang(lang)} options={langs} />
                <TextArea value={code} onChange={e => setCode(e)} />
                <button className="syntax-modal__button">
                    Send
                </button>
            </Form>
        </Modal>
    )
}

export default SyntaxModal
