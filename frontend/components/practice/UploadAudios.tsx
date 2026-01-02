import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import svg from '@/constants/svgs'
import { Button } from '../ui/button'
import RecordingDialog from './RecordingDialog'

interface UploadAudiosProps {
    handleFileUpload: (files: FileList | null) => void
    audioFile: FileList | null
}

const UploadAudios = ({ audioFile, handleFileUpload }: UploadAudiosProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hasRecordPermission, setRecordPermission] = useState<"granted" | "denied" | "prompt">("denied");
    useEffect(() => {
        const checkPermission = async () => {
            if (!navigator.permissions) return;
            try {
                const status = await navigator.permissions.query({ name: "microphone" });
                setRecordPermission(status.state);
                status.onchange = () => {
                    setRecordPermission(status.state);
                };
            } catch (err) {
                setRecordPermission("denied")
            }
        };

        checkPermission();
    }, []);

    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    }
    const handleUpload = async () => {
        const state = await navigator.mediaDevices.getUserMedia({ audio: true })
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <span onClick={handleUpload}>dsd</span>
            <input type='file' className='hidden' ref={inputRef} onChange={e => handleFileUpload(e.target.files)} />
            <RecordingDialog
                onClick={handleUpload}
                hasRecordingPermission={hasRecordPermission !== "denied"}
            />
            <Button onClick={handleClick} className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md cursor-pointer">
                Upload File {hasRecordPermission}
            </Button>
            {audioFile &&
                <Button
                    onClick={handleUpload}
                    className="bg-gray-800 hover:bg-gray-700 text-white group cursor-pointer"
                >
                    <Image src={svg.uploadSVG} alt='upload file ' />
                    Submit Audio File
                </Button>
            }
        </div>
    )
}

export default UploadAudios