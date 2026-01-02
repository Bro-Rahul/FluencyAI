import { useState } from 'react'


const useAudioPlayer = () => {

    const [fileDetails, setFileDetails] = useState<{
        audioURL: string | null,
        fileName: string | null,
        duration: number
        fileData: File | Blob | null
    }>({
        audioURL: null,
        fileData: null,
        duration: 0,
        fileName: null
    })

    const handleFile = (fileList: FileList | null) => {
        if (!fileList) return;
        const file = fileList.item(0);
        if (!file?.name) return;
        const ext = file.name.split(".")[1];
        if (validateFile(ext)) {
            const url = URL.createObjectURL(file)
            setFileDetails(pre => ({
                audioURL: url,
                fileData: file,
                fileName: file.name,
                duration: 0,
            }))
            return
        }
        throw Error("File Should be an Audio File")
    }

    const handleFileUpload = (fileData: Blob | FileList | null) => {
        if (fileData instanceof Blob) {
            const url = URL.createObjectURL(fileData);
            setFileDetails(pre => ({
                fileData: fileData,
                audioURL: url,
                fileName: "audio.wav",
                duration: 0,
            }))
            return
        }
        handleFile(fileData);
    }

    const validateFile = (fileExt: string) => {
        const audioFileFormates = ["mp3", "wav", "aac", "flac", "ogg"]
        return audioFileFormates.includes(fileExt.toLowerCase());
    }

    const handleDuration = (duration: number) => {
        setFileDetails(pre => ({
            ...pre,
            duration
        }))
    }

    return {
        fileDetails,
        handleDuration,
        handleFileUpload,
    }
}

export default useAudioPlayer

