import React, { FC } from 'react'
import './index.scss'

interface TextAreaProps {
    props?: any
}

const TextArea: FC<TextAreaProps> = ({ props }) => {
    return (
        <textarea className="textarea" {...props}></textarea>
    )
}

export default TextArea
