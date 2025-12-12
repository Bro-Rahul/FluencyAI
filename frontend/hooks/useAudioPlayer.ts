import { useState } from 'react'


const useAudioPlayer = () => {
    const [audioFile, setAudioFile] = useState<FileList | null>(null);

    const handleFile = (fileList: FileList | null) => {
        if (!fileList) return;
        setAudioFile(fileList);
    }

    return {
        audioFile,
        handleFile,
    }
}

export default useAudioPlayer