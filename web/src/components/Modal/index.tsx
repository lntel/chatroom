import React, { FC } from 'react'
import { FadeIn } from '../Transitions'
import './index.scss'

interface ModalProps {
    children?: any
    title?: string
    visible: boolean
}

const Modal: FC<ModalProps> = ({ children, title, visible }) => {
    return (
        <FadeIn state={visible}>
            <div className="modal-container">
                <div className="modal-container__modal">
                    { title ? (
                        <h1 className="modal-container__modal__title">
                            { title }
                        </h1>
                    ) : null }
                    { children }
                </div>
            </div>
        </FadeIn>
    )
}

export default Modal
