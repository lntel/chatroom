import React, { CSSProperties, FC } from 'react'
import './index.scss'

import CheckIcon from '@material-ui/icons/Check';

interface ToggleProps {
    onToggle: (e: boolean) => void
    toggled: boolean
    style?: CSSProperties
}

const Toggle: FC<ToggleProps> = ({ onToggle, toggled, style }) => {
    return (
        <div className={toggled ? "toggle toggle--enabled" : "toggle"} onClick={() => onToggle(!toggled)} style={style}>
            <div className={toggled? "toggle__box toggle__box--enabled" : "toggle__box"}>
                { toggled ? (
                    <CheckIcon>Filled</CheckIcon>
                ) : null }
            </div>
        </div>
    )
}

export default Toggle
