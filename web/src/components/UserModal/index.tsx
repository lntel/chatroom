
import React, { CSSProperties, FC, useEffect, useRef } from 'react'
import './index.scss'

import { FadeIn } from '../Transitions'

interface UserModalProps {
    visible: boolean
    positionX: number
    positionY: number
    onUnfocus: () => void
    onDisconnect: () => void
    onBan: () => void
}

const UserModal: FC<UserModalProps> = ({ visible, positionX, positionY, onUnfocus, onDisconnect, onBan }) => {

    const ref = useRef<HTMLDivElement>(null);

    const style: CSSProperties = {
        position: 'fixed',
        left: `${positionX}px`,
        top: `${positionY}px`,
        zIndex: 2
    }

    useEffect(() => {
        document.body.addEventListener('click', (e) => {

            const element = (e.target as HTMLDivElement);

            if(!element || !element.className || !element.className.length) return;
            
            if(element.className.substr(0, 10) !== 'user-modal') {
                onUnfocus();
            }
        }); 
    }, []);

    return (
        <FadeIn state={visible}>
            <div style={style} className="user-modal" ref={ref}>
                <div className="user-modal__option user-modal__option--serious" onClick={() => onDisconnect()}>
                    Disconnect
                </div>
                <div className="user-modal__option user-modal__option--serious" onClick={() => onBan()}>
                    Ban
                </div>
                <div className="user-modal__option">
                    test
                </div>
            </div>
        </FadeIn>
    )
}

export default UserModal
