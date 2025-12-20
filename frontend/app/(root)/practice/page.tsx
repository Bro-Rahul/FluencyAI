"use client"
import AudioPlayer from "@/components/practice/AudioPlayer";
import UploadAudios from "@/components/practice/UploadAudios";
import useAudioPlayer from "@/hooks/useAudioPlayer";

const PracticePage = () => {
    const { audioFile, handleFile } = useAudioPlayer();

    return (
        <div className="min-h-screen text-white px-6 py-10">
            <AudioPlayer
                audioFile={audioFile}
            />
            <UploadAudios
                audioFile={audioFile}
                handleFileUpload={handleFile}
            />
        </div>
    );
};

export default PracticePage;
