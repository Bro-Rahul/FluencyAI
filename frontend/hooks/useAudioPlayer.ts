import { useState } from 'react'


const useAudioPlayer = () => {
    const [audioFile, setAudioFile] = useState<FileList | null>(null);

    const handleFile = (fileList: FileList | null) => {
        if (!fileList) return;
        const filename = fileList.item(0)?.name;
        if (!filename) return;
        const ext = filename.split(".")[1];
        if (validateFile(ext)) {
            setAudioFile(fileList);
            return
        }
        throw Error("File Should be an Audio File")
    }

    const validateFile = (fileExt: string) => {
        const audioFileFormates = ["mp3", "wav", "aac", "flac", "ogg"]
        return audioFileFormates.includes(fileExt.toLowerCase());
    }

    return {
        audioFile,
        handleFile,
    }
}

export default useAudioPlayer

