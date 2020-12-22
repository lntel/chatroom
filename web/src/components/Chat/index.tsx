import React, { FC, useEffect, useRef, useState } from 'react'
import './index.scss'

import { ChatMessage } from '../../types'
import { SlideInRight } from '../Transitions'
import FileInput from '../FileInput'
import Textbox from '../Textbox'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CodeIcon from '@material-ui/icons/Code';

import SelectionModal, { SelectionModalCoords } from '../SelectionModal'
import SyntaxModal from '../SyntaxModal'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatProps {
    visible: boolean
    messages: ChatMessage[]
    onMessage: (content: string) => void
    onMessageRead: (messages: ChatMessage[]) => void
}

const Chat: FC<ChatProps> = ({ visible, messages, onMessage, onMessageRead }) => {
    const [messageInput, setMessageInput] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [syntaxModal, setSyntaxModal] = useState<boolean>(false);
    const [modalCoords, setModalCoords] = useState<SelectionModalCoords>({
        x: 0,
        y: 0
    });
    
    const bottomChat = useRef<HTMLDivElement>(null);
    const chatContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToChat();
    }, [messages]);

    useEffect(() => {
        // Auto scroll when messages are recieved
        //chatContainer.current?.scrollTo(0, chatContainer.current?.scrollHeight!)

        // Filter unread messages
        const unreadMessages = messages.filter(message => !message.read);

        if(visible && unreadMessages.length) {
            onMessageRead([...unreadMessages.map(unreadMessage => {
                return {
                    ...unreadMessage,
                    read: true
                }
            })]);
        }

    }, [visible, messages]);

    
    const scrollToChat = () => {
        bottomChat.current?.scrollIntoView({
            behavior: "smooth"
        });
    }


    const handleMessageSend = () => {

        if(messageInput.length >= 250) return;

        onMessage(messageInput);
    }
    
    const onFilesSelected = (files: FileList) => {
        console.log(files)
    }

    const markdownSwitch = (message: ChatMessage) => {
        switch(message.markdown) {
            case 'italic':
                return (
                    <i>
                        { message.content }
                    </i>
                )
            case 'bold':
                return (
                    <b>
                        { message.content }
                    </b>
                )
            default:
                return message.content;
        }
    }

    const handleModalShow = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        setModalVisible(true);
        setModalCoords({
            y: e.clientY + 20,
            x: e.clientX - 270
        });
    }

    const handleTestClick = () => {
        console.log("ytest")
    }
    
    return (
        <>
            <SelectionModal 
            visible={modalVisible} 
            coords={modalCoords} 
            onUnfocus={() => setModalVisible(false)} 
            items={[
                {
                    text: 'Insert Code',
                    icon: CodeIcon,
                    onClickCallback: () => {
                        setModalVisible(false);
                        setSyntaxModal(true);
                    }
                }
            ]}
            />
            <SyntaxModal visible={syntaxModal} onUnfocus={() => setSyntaxModal(false)} />
            <SlideInRight state={visible}>
                <div className="chat">
                    <div className="chat__topbar">
                        <MoreHorizIcon onClick={(e) => handleModalShow(e)}>Filled</MoreHorizIcon>
                    </div>
                    <div className="chat__container" ref={chatContainer}>
                        { messages && messages.length ? messages.map(message =>
                            <>
                            { !message.codeLanguage ? (
                                <>
                                { message.image ? (
                                    <div className={message.user.self ? "chat__message chat__message--self" : "chat__message"}>
                                        { !message.user.self ? (
                                            <span className="chat__message__nickname">
                                                { message.user.nickname }
                                            </span>
                                        ) : null }
                                        <img src={message.image} alt=""/>
                                    </div>
                                ) : (
                                    <div className={message.user.self ? "chat__message chat__message--self" : "chat__message"}>
                                        { !message.user.self ? (
                                            <span className="chat__message__nickname">
                                                { message.user.nickname }
                                            </span>
                                        ) : null }
                                        <p>
                                            { markdownSwitch(message) }
                                        </p>
                                    </div>
                                ) }
                                </>
                            ) : (
                                <div className={message.user.self ? "chat__message chat__message--self" : "chat__message"}>
                                    { !message.user.self ? (
                                        <span className="chat__message__nickname">
                                            { message.user.nickname }
                                        </span>
                                    ) : null }
                                    <SyntaxHighlighter language={message.codeLanguage} style={atomDark}>
                                        { message.content }
                                    </SyntaxHighlighter>
                                </div>
                            ) }
                            </>
                        ) : null }
                        <div ref={bottomChat}></div>
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
        </>
    )
}

export default Chat
