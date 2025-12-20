import { useRef } from 'react'
import Image from 'next/image'
import svg from '@/constants/svgs'
import { Button } from '../ui/button'
import { testAudioUpload } from '@/https/sessions/sessionHttp'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface UploadAudiosProps {
    handleFileUpload: (files: FileList | null) => void
    audioFile: FileList | null
}

const UploadAudios = ({ audioFile, handleFileUpload }: UploadAudiosProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const handleClick = () => {
        if (!inputRef.current) return;
        inputRef.current.click();
    }

    const handleUpload = async () => {
        const request = testAudioUpload()
        toast.promise(request, {
            loading: 'Loading',
            success: (data) => `Successfully saved ${data}`,
            error: (err) => `This just happened: ${err.toString()}`,
        }, {
            position: "bottom-right",
            duration: 2000
        })
        try {
            const response = await request;
            router.push(`/report/${response}`)
        } catch (err: any) {
            console.log(err);
        }
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