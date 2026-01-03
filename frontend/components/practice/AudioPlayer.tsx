import { useState } from "react";
import TimeLine from "./TimeLine";
import Player from "./Player";

interface AudioPlayerProps {
    audioURL: string | null,
    fileName: string | null,
    duration: number,
    handleDuration: (duration: number) => void
}

const AudioPlayer = ({ audioURL, fileName, duration, handleDuration }: AudioPlayerProps) => {
    const loadDuration = (time: number) => {
        handleDuration(time)
    }
    return (
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Practice Session</h1>
            <p
                className="text-gray-400 max-w-2xl mx-auto mb-10"
            >
                Start practicing your spoken English by clicking the record button.
                Your speech will be transcribed in real-time. Review your recording
                and receive AI feedback after you finish. Alternatively, upload a
                pre-recorded audio file for analysis.
            </p>

            <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden shadow-xl bg-white p-3 mb-6">
                    <img
                        src="https://images.unsplash.com/photo-1616627986691-4d193584af52?q=80&w=500"
                        alt="practice session"
                        className="rounded-lg w-48 h-48 object-cover"
                    />
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Practice Session</h2>

            {fileName && <p className="text-gray-400 mb-8">{fileName}</p>}

            <Player
                audioURL={audioURL}
                loadDuration={loadDuration}
            />
            <TimeLine
                Hours={duration ? Math.floor(duration / 3600) : 0}
                Minutes={duration ? Math.floor((duration % 3600) / 60) : 0}
                Seconds={duration ? Math.floor(duration % 60) : 0}
            />
        </div>
    )
}

export default AudioPlayer