"use client"
import AudioPlayer from "@/components/practice/AudioPlayer";
import UploadAudios from "@/components/practice/UploadAudios";
import { Button } from "@/components/ui/button";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { fetchData } from "@/https/sessions/sessionHttp";
import { useState } from "react";

const PracticePage = () => {
    const { audioFile, handleFile } = useAudioPlayer();
    const [streamData, setStreamData] = useState<string>('');

    const handleClick = () => {
        fetchData(audioFile?.item(0)!, (streamText) => setStreamData(pre => pre + " \n" + streamText));
    }
    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
            <AudioPlayer
                audioTranscriptString={streamData}
                audioFile={audioFile}
            />
            <UploadAudios
                handleFileUpload={handleFile}
            />
            <Button onClick={handleClick}>Submit</Button>
        </div>
    );
};

export default PracticePage;
