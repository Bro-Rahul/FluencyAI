"use client"
import AudioContextProvider from '@/context/AudioContext'
import React from 'react'

const PracticeLayoutPage: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    return (
        <AudioContextProvider>
            {children}
        </AudioContextProvider>
    )
}

export default PracticeLayoutPage