import React, { FC, useEffect } from 'react'
import { FadeIn } from '../Transitions'
import './index.scss'

interface ModalProps {
    visible: boolean
    children?: any
    title?: string
    onUnfocus?: () => void
}

const Modal: FC<ModalProps> = ({ children, title, visible, onUnfocus }) => {

    useEffect(() => {

        if(onUnfocus) {
            document.addEventListener('click', handleUnfocus);

            return () => {
                document.removeEventListener('click', handleUnfocus);
            }
        }
        
    }, []);

    const handleUnfocus = (e: MouseEvent) => {

        const target = (e.target as HTMLElement);

        if(!target || !target.className || !target.className.length) return;

        if(target.className.substr(0, 15) === 'modal-container') onUnfocus!();
    }

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
