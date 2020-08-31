import { CSSProperties } from '@material-ui/core/styles/withStyles'
import React, { FC } from 'react'
import './index.scss'

interface DropdownOption {
    value: string
    text: string
}

interface DropdownProps {
    margin?: number | string
    options?: DropdownOption[]
    selected?: string
    onSelected: (v: string) => void
}

const Dropdown: FC<DropdownProps> = ({ options, margin, selected, onSelected }) => {

    const style: CSSProperties = {
        margin: margin
    }

    return (
        <select className="dropdown" style={style} onChange={e => onSelected(e.currentTarget.value)}>
            { options && options.length ? options.map(option => 
                <option value={option.value} key={option.value} selected={selected == option.value ? true : false}>{ option.text }</option>
            ) : null }
        </select>
    )
}

export default Dropdown
