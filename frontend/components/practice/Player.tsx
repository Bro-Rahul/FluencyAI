import { useRef, useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import svg from '@/constants/svgs'

interface PlayerProps {
    audioURL: string | null,
    loadDuration: (time: number) => void
}

const Player = ({ audioURL, loadDuration }: PlayerProps) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const togglePlayAndPause = () => {
        if (!audioURL) return;
        setPlaying(pre => {
            if (pre) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play()
            }
            return !pre
        })
    }

    const moveForwardAndBackward = (delta: number) => {
        const audio = audioRef.current
        if (!audio) return

        const newTime = audio.currentTime + delta

        audio.currentTime = Math.min(
            Math.max(newTime, 0),
            audio.duration || 0
        )
    }
    return (
        <div className="flex items-center justify-center gap-3 mb-5">
            <Button
                onClick={() => moveForwardAndBackward(-5)}
                className='bg-transparent hover:bg-zinc-800 rounded-full cursor-pointer'>
                <Image
                    src={svg.arrowLeftSVG}
                    alt='play audio'
                />
            </Button>
            <Button
                onClick={togglePlayAndPause}
                className="w-12 h-12 rounded-full bg-[#135bec] hover:bg-[#1d64f2] transition-colors cursor-pointer">
                <Image
                    src={playing ? svg.pauseSVG : svg.playSVG}
                    alt='play audio'
                    style={{
                        scale: 2
                    }}
                />
            </Button>
            <Button
                onClick={() => moveForwardAndBackward(5)}
                className='rotate-180 bg-transparent hover:bg-zinc-800 rounded-full cursor-pointer'>
                <Image
                    src={svg.arrowLeftSVG}
                    alt='play audio'
                />
            </Button>
            {audioURL && (
                <audio
                    ref={audioRef}
                    src={audioURL}
                    onLoadedMetadata={e => loadDuration(e.currentTarget.duration)}
                />
            )}
        </div>
    )
}

export default Player