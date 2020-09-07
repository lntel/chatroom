import React, { FC, useEffect } from 'react'
import './index.scss'

import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { SvgIconComponent } from '@material-ui/icons'
import { FadeIn } from '../Transitions'

export interface SelectionModalCoords {
    x: number | string
    y: number | string
}

export interface SelectionModalItem {
    text: string
    serious?: boolean
    icon?: SvgIconComponent
    onClickCallback: () => void
}

interface SelectionModalProps {
    visible: boolean
    coords: SelectionModalCoords
    items?: SelectionModalItem[]
    onUnfocus: () => void
}

const SelectionModal: FC<SelectionModalProps> = ({ visible, coords, onUnfocus, items }) => {

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
                { items && items.length && items.map(item =>
                    <div className={item.serious ? "selection-modal__option selection-modal__option--serious" : "selection-modal__option"} onClick={item.onClickCallback}>
                        <div className="selection-modal__option__icon">
                            { item.icon ? <item.icon>Filled</item.icon> : null }
                        </div>
                        { item.text }
                    </div>
                ) }
            </div>
        </FadeIn>
    )
}

export default SelectionModal
