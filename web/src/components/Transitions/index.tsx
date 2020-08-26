import React, { FC } from 'react'
import './index.scss'

import { CSSTransition } from "react-transition-group";

interface FadeInProps {
    state: boolean
    children?: any
}

export const FadeIn: FC<FadeInProps> = ({ state, children }) => {
    return (
        <CSSTransition in={state} timeout={300} classNames="fade-transition" unmountOnExit>
            { children }
        </CSSTransition>
    );
}

export const SlideInRight: FC<FadeInProps> = ({ state, children }) => {
    return (
        <CSSTransition in={state} timeout={300} classNames="slide-transition" unmountOnExit>
            { children }
        </CSSTransition>
    );
}