import React, { FC } from 'react'
import Textbox from '../Textbox'
import { SlideInRight } from '../Transitions'
import './index.scss'

interface ChatProps {
    visible: boolean
}

const Chat: FC<ChatProps> = ({ visible }) => {
    return (
        <SlideInRight state={visible}>
            <div className="chat">
                <div className="chat__container">

                </div>
                <Textbox bgColor="#4B5162" fgColor="#f3f3f3" className="chat__input" padding="1.7em" placeholder="Enter a message" />
            </div>
        </SlideInRight>
    )
}

export default Chat
