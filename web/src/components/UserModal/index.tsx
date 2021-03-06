
import React, { CSSProperties, FC, useEffect, useRef } from 'react'
import './index.scss'

import { FadeIn } from '../Transitions'
import Slider from '../Slider';

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
        zIndex: 6
    }

    const detectUnfocus = (e: any) => {
        const element = (e.target as HTMLDivElement);

        if(!element || !element.className || !element.className.length) return;
        
        if(element.className.substr(0, 10) !== 'user-modal') {
            onUnfocus();
        }
    }

    useEffect(() => {
        document.body.addEventListener('click', detectUnfocus); 

        return () => {
            document.body.removeEventListener('click', detectUnfocus);
        }
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
                <div className="user-modal__option">
                    <p>Volume</p>
                    <Slider min={0} max={1} step={0.01} onChange={console.log} />
                </div>
            </div>
        </FadeIn>
    )
}

export default UserModal
