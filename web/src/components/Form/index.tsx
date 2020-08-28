import React, { FC } from 'react'

interface FormProps {
    children?: any
    className?: string
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form: FC<FormProps> = ({ children, onSubmit, className }) => {
    return (
        <form onSubmit={e => onSubmit(e)} className={className}>
            { children }
        </form>
    )
}

export default Form
