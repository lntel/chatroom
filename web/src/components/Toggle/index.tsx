import React, { FC } from 'react'
import './index.scss'

import CheckIcon from '@material-ui/icons/Check';

interface ToggleProps {
    onToggle: (e: boolean) => void
    toggled: boolean
}

const Toggle: FC<ToggleProps> = ({ onToggle, toggled }) => {
    return (
        <div className={toggled ? "toggle toggle--enabled" : "toggle"} onClick={() => onToggle(!toggled)}>
            <div className={toggled? "toggle__box toggle__box--enabled" : "toggle__box"}>
                { toggled ? (
                    <CheckIcon>Filled</CheckIcon>
                ) : null }
            </div>
        </div>
    )
}

export default Toggle
