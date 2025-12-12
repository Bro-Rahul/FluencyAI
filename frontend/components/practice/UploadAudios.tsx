import React, { useRef } from 'react'
import { Button } from '../ui/button'

interface UploadAudiosProps {
    handleFileUpload: (files: FileList | null) => void
}

const UploadAudios = ({ handleFileUpload }: UploadAudiosProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <input type='file' className='hidden' ref={inputRef} onChange={e => handleFileUpload(e.target.files)} />
            <Button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md">
                Record
            </Button>
            <Button onClick={handleClick} className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md cursor-pointer">
                Upload File
            </Button>
        </div>
    )
}

export default UploadAudios