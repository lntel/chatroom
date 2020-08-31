import React, { FC } from 'react'

interface SliderProps {
    min: number
    max: number
    step: number
    onChange: (e: string) => void
}

const Slider: FC<SliderProps> = ({ min, max, step, onChange }) => {

    return (
        <input type="range" min={min} max={max} step={step} onChange={e => onChange(e.currentTarget.value)} />
    )
}

export default Slider
