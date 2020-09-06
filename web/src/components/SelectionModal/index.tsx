import React, { FC, useEffect } from 'react'
import './index.scss'

import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { FadeIn } from '../Transitions'

export interface SelectionModalCoords {
    x: number | string
    y: number | string
}

export interface SelectionModalItem {

}

interface SelectionModalProps {
    visible: boolean
    coords: SelectionModalCoords
    items?: SelectionModalItem[]
    onUnfocus: () => void
}

const SelectionModal: FC<SelectionModalProps> = ({ visible, coords, onUnfocus }) => {

    const style: CSSProperties = {
        position: 'absolute',
        zIndex: 3,
        left: `${coords.x}px`,
        top: `${coords.y}px`
    }

    const handleUnfocus = (e: MouseEvent) => {

        const target = e.target && (e.target as HTMLDivElement);

        if(!target) return;

        if(visible && String(target.className).substr(0, 15) !== 'selection-modal') {
            onUnfocus();
        }

        // if(target.className.substr(0, 15) !== 'selection-modal') {
        //     onUnfocus();
        // }
    }

    useEffect(() => {

        document.addEventListener('click', handleUnfocus);

        return () => {
            document.removeEventListener('click', handleUnfocus);
        }

    }, [visible]);

    return (
        <FadeIn state={visible}>
            <div className="selection-modal" style={style}>
                test
            </div>
        </FadeIn>
    )
}

export default SelectionModal
