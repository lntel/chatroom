import React from 'react'
import Controls from '../../components/Controls'
import Userlist from '../../components/Userlist'
import Videolist from '../../components/Videolist'
import './index.scss'

const Main = () => {

    const handleMicEvent = (e: boolean) => {
        console.log(e)
    }

    const handleStreamEvent = () => {
        console.log("streaming")
    }

    return (
        <div className="main-page">
            <Userlist />
            <Videolist />
            <Controls onMicEvent={(e: boolean) => handleMicEvent(e)} onStreamEvent={() => handleStreamEvent()} />
        </div>
    )
}

export default Main
