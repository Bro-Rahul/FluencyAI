import { useContext } from 'react'
import { AudioContext } from '@/context/AudioContext'

const useAudioContext = () => {
    const { audio, inputFile, url, setAudioContext } = useContext(AudioContext)

    const handleFileUpload = (file: FileList | null) => {
        setAudioContext(pre => ({
            ...pre,
            inputFile: file
        }))
    }

    return {
        audio,
        url,
        inputFile,
        handleFileUpload,
        setAudioContext,
    }
}

export default useAudioContext