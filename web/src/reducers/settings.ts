type Action = | {
    type: 'UPDATE_VIDEO_INPUT',
    deviceId: string
} | {
    type: 'UPDATE_AUDIO_OUTPUT',
    deviceId: string
} | {
    type: 'UPDATE_AUDIO_INPUT',
    deviceId: string
} | {
    type: 'CLEAR_SETTINGS'
}

interface State {
    audioInput: string
    audioOutput: string
    videoInput: string
}

export const settingsReducer = (state: State, action: Action) => {
    switch(action.type) {
        case 'UPDATE_VIDEO_INPUT':
            return {
                ...state,
                videoInput: action.deviceId
            }

        case 'UPDATE_AUDIO_OUTPUT':
            return {
                ...state,
                audioOutput: action.deviceId
            }

        case 'UPDATE_AUDIO_INPUT':
            return {
                ...state,
                audioInput: action.deviceId
            }

        default:
            return state
    }
}