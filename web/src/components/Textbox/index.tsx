import React, { FC, useState } from 'react'

import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Colors } from '../../types';

type TextboxPropsType = | 'text' | 'password' | 'email';

interface TextboxProps {
    type?: TextboxPropsType
    value?: string
    placeholder?: string
    className?: string
    fgColor?: Colors
    bgColor?: Colors
    padding?: string | number
    margin?: string | number
    onChange?: (v: string) => void
}

const Textbox: FC<TextboxProps> = ({ type = 'text', onChange, value, fgColor, bgColor, padding, margin, placeholder, className }) => {
    const [internalValue, setInternalValue] = useState<string>('');

    const style: CSSProperties = {
        background: bgColor,
        color: fgColor,
        padding: padding,
        margin: margin,
        border: '0',
        borderRadius: '.2em'
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tmpValue = e.target.value;

        if(onChange) {
            onChange(tmpValue);
        } else {
            setInternalValue(tmpValue);
        }
    }

    return (
        <input type={type} onChange={e => handleChange(e)} value={onChange ? value : internalValue} style={style} className={className} placeholder={placeholder} />
    )
}

export default Textbox