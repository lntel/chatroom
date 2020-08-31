import React, { FC, useEffect, useState } from 'react'
import { ChatMessage } from '../../types'
import Textbox from '../Textbox'
import { SlideInRight } from '../Transitions'
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
    
    return (
        <SlideInRight state={visible}>
            <div className="chat">
                <div className="chat__container">
                    { messages && messages.length ? messages.map(message =>
                        <>
                        { message.system ? (
                            <div className="chat__system-message">
                                <p>testing</p>
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
                <Textbox 
                className="chat__input" 
                padding="1.7em" 
                placeholder="Enter a message" 
                onChange={(v: string) => setMessageInput(v)} 
                onEnter={() => handleMessageSend()}
                value={messageInput} />
            </div>
        </SlideInRight>
    )
}

export default Chat
