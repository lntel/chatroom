import React, { FC, useEffect, useState } from 'react'
import { ChatMessage } from '../../types'
import { SlideInRight } from '../Transitions'
import FileInput from '../FileInput'
import Textbox from '../Textbox'
import './index.scss'

interface ChatProps {
    visible: boolean
    messages: ChatMessage[]
    onMessage: (content: string) => void
}

const Chat: FC<ChatProps> = ({ visible, messages, onMessage }) => {
    const [messageInput, setMessageInput] = useState<string>('');

    const handleMessageSend = () => {
        onMessage(messageInput);
    }
    
    const onFilesSelected = (files: FileList) => {
        console.log(files)
    }
    
    return (
        <SlideInRight state={visible}>
            <div className="chat">
                <div className="chat__container">
                    { messages && messages.length ? messages.map(message =>
                        <>
                        { message.image ? (
                            <div className={message.user.self ? "chat__message chat__message--self" : "chat__message"}>
                                <img src={message.image} alt=""/>
                            </div>
                        ) : (
                            <div className={message.user.self ? "chat__message chat__message--self" : "chat__message"}>
                                <span className="chat__message__nickname">
                                    { message.user.nickname }
                                </span>
                                <p>
                                    { message.content }
                                </p>
                            </div>
                        ) }
                        </>
                    ) : null }
                </div>
                <div className="chat__input">
                    <FileInput format="images" onSelection={e => onFilesSelected(e)} />
                    <Textbox 
                    className="chat__input" 
                    padding="1.7em" 
                    borderRadius="0"
                    placeholder="Enter a message" 
                    onChange={(v: string) => setMessageInput(v)} 
                    onEnter={() => handleMessageSend()}
                    value={messageInput} 
                    />
                </div>
            </div>
        </SlideInRight>
    )
}

export default Chat
