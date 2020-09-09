import React, { FC } from 'react'
import './index.scss'

interface TextAreaProps {
    value: string
    onChange: (v: string) => void
    props?: any
}

const TextArea: FC<TextAreaProps> = ({ value, onChange, props }) => {
    return (
        <textarea className="textarea" value={value} onChange={e => onChange(e.target.value)} {...props}></textarea>
    )
}

export default TextArea
