import React, { useState } from 'react'
import { createContext } from 'react'

type AudioContextType = {
    url: string | null,
    audio: HTMLAudioElement | null,
    inputFile: FileList | null
    setAudioContext: React.Dispatch<React.SetStateAction<AudioContextType>>
}

const initailState: AudioContextType = {
    audio: null,
    url: null,
    inputFile: null,
    setAudioContext: () => { }
}

export const AudioContext = createContext<AudioContextType>(initailState)

const AudioContextProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const [audioDetails, setAudioDetails] = useState<AudioContextType>(initailState);
    return (
        <AudioContext.Provider value={{ ...audioDetails, setAudioContext: setAudioDetails }}>
            {children}
        </AudioContext.Provider>
    )
}

export default AudioContextProvider