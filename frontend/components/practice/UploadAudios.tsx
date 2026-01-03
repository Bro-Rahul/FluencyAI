import Image from 'next/image'
import svg from '@/constants/svgs'
import { Button } from '../ui/button'
import RecordingDialog from './RecordingDialog'
import { ChangeEvent, useRef } from 'react'
import toast from 'react-hot-toast'
import { postCreateNewSession } from '@/https/sessions/sessionRecord'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface UploadAudiosProps {
    file: File | Blob | null,
    duration: number,
    handleFile: (file: Blob | FileList | null) => void
}

const UploadAudios = ({ handleFile, file, duration }: UploadAudiosProps) => {
    const { data } = useSession();
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleClick = () => {
        inputRef.current?.click();
    }
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            handleFile(e.target.files)
        } catch (err) {
            toast.error("Please Upload an Audio File Formate!", {
                position: "bottom-right",
                duration: 5000
            })
        }
    }

    const handleFileUpload = async () => {
        if (!file) return;
        const request = postCreateNewSession(data?.user.access_token!, file, duration);
        toast.promise(request, {
            loading: "Creating new Session !",
            success: "Session has been succssfully Queued ",
            error: (e) => e.toString()
        }, {
            position: "bottom-right",
            duration: 5000
        })
        try {
            await request;
            router.push("/sessions")
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <input type='file' className='hidden' ref={inputRef} onChange={handleOnChange} />
            <RecordingDialog
                handleFile={handleFile}
            />
            <Button onClick={handleClick} className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md cursor-pointer">
                Upload File
            </Button>
            {file &&
                <Button
                    onClick={handleFileUpload}
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