export type Action = | {
    type: 'UPDATE_VIDEO_INPUT',
    deviceId: string
} | {
    type: 'UPDATE_AUDIO_OUTPUT',
    deviceId: string
} | {
    type: 'UPDATE_AUDIO_INPUT',
    deviceId: string
} | {
    type: 'UPDATE_IMG_RESOLVER',
    value: boolean
} | {
    type: 'CLEAR_SETTINGS'
}

export interface State {
    audioInput: string | undefined
    audioOutput: string | undefined
    videoInput: string | undefined
    imageResolver: boolean
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
        
        case 'UPDATE_IMG_RESOLVER':
            return {
                ...state,
                imageResolver: action.value
            }

        default:
            return state
    }
}