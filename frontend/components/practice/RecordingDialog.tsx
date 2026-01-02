import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import svg from "@/constants/svgs"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import clsx from "clsx"
import { formateDuration } from "@/utils/helper"
import useRecording from "@/hooks/useRecording"

interface RecordingDialogProps {
    handleFile: (file: Blob | FileList | null) => void

}

const RecordingDialog = ({ handleFile }: RecordingDialogProps) => {
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [startedRecording, setStartedRecording] = useState<boolean>(false);
    const {
        recordingState,
        recordingTime,
        start,
        pause,
        resume,
        stop,
        setRecordingState
    } = useRecording()

    const handleStop = async () => {
        setRecordingState("stop");
        setStartedRecording(false);

        const audioBlob = await stop();

        if (audioBlob.size === 0) {
            console.error("Empty recording");
            return;
        }

        handleFile(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
    };


    const togglePlayAndPause = () => {
        if (!startedRecording) {
            setStartedRecording(true);
            setRecordingState("play")
            start();
            return;
        }
        if (recordingState === "pause") {
            resume();
            setRecordingState("play")
        } else {
            pause();
            setRecordingState("pause")

        }
    }

    return (
        <Dialog>
            <DialogTrigger
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md outline-none">
                Record
            </DialogTrigger>
            <DialogContent className="bg-[#1c1f27] flex-col w-full justify-center" showCloseButton={false}>
                <DialogHeader className="flex flex-col items-center gap-2 w-full">
                    <DialogTitle
                        className="text-white text-xl font-bold leading-tight">
                        Recording in Progress
                    </DialogTitle>
                    <DialogDescription className="text-[#9da6b9] text-sm font-normal">
                        Speak clearly into your microphone
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col w-full py-6">
                    <AudioAnimation recording={recordingState === "play"} />
                    <div className="flex flex-col items-center gap-1 mb-5">
                        <span className="text-white text-4xl font-mono font-bold tracking-wider">{formateDuration(recordingTime)}</span>
                        <span className="text-[#9da6b9] text-xs uppercase tracking-widest font-medium">Recording Time</span>
                    </div>
                    <div className="flex items-center gap-6 w-full justify-center pt-4">
                        <DialogClose asChild>
                            <Button
                                className="flex items-center justify-center rounded-full size-14 bg-[#282e39] text-white hover:bg-[#3b4354] transition-colors group cursor-pointer">
                                <Image src={svg.closeSVG} alt="Cancel svg" />
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={togglePlayAndPause}
                            className="flex items-center justify-center rounded-full size-20 bg-[#135bec] text-white shadow-lg shadow-blue-900/20 hover:bg-[#1d64f2] transition-colors relative group cursor-pointer">
                            <span
                                className={clsx("absolute inset-0 rounded-full border border-white/20", recordingState === "play" && "animate-[ping_2s_ease-out_infinite]")}></span>
                            <Image src={recordingState === "play" ? svg.pauseSVG : svg.playSVG} alt="close svg" width={45} height={45} />
                        </Button>
                        <Button
                            onClick={handleStop}
                            className="flex items-center justify-center rounded-full size-14 bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors group cursor-pointer">
                            <Image src={svg.squareSVG} alt="Save svg" />
                        </Button>
                    </div>
                </div>
                {audioURL &&
                    <audio src={audioURL} controls />
                }
            </DialogContent>
        </Dialog>
    )
}

export default RecordingDialog

interface AudioAnimationProps {
    recording: boolean
}

const AudioAnimation = ({ recording }: AudioAnimationProps) => {
    const barBase = "w-1 bg-[#135bec] rounded-full transition-all duration-300"

    const animate = recording ? "animate-pulse" : ""

    return (
        <div className="flex items-center justify-center gap-1 h-32 w-full">
            <div className={`${barBase} h-4 ${animate}`}></div>
            <div className={`${barBase} h-8 ${animate} delay-75`}></div>
            <div className={`${barBase} h-6 ${animate} delay-100`}></div>
            <div className={`${barBase} h-10 ${animate} delay-150`}></div>
            <div className={`${barBase} h-5 ${animate} delay-200`}></div>
            <div className={`${barBase} h-8 ${animate} delay-300`}></div>
            <div className={`${barBase} h-3 ${animate} delay-100`}></div>
            <div className={`${barBase} h-7 ${animate} delay-200`}></div>
            <div className={`${barBase} h-4 ${animate}`}></div>
            <div className={`${barBase} h-9 ${animate} delay-150`}></div>
            <div className={`${barBase} h-5 ${animate} delay-75`}></div>
            <div className={`${barBase} h-8 ${animate} delay-300`}></div>
            <div className={`${barBase} h-6 ${animate} delay-100`}></div>
            <div className={`${barBase} h-10 ${animate} delay-200`}></div>
            <div className={`${barBase} h-5 ${animate} delay-75`}></div>
        </div>
    )
}
