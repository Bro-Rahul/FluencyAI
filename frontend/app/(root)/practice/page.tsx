"use client"
import AudioPlayer from "@/components/practice/AudioPlayer";
import UploadAudios from "@/components/practice/UploadAudios";
import useAudioPlayer from "@/hooks/useAudioPlayer";

const PracticePage = () => {
    const { fileDetails, handleFileUpload, handleDuration } = useAudioPlayer();

    return (
        <div className="min-h-screen text-white px-6 py-10">
            <AudioPlayer
                handleDuration={handleDuration}
                duration={fileDetails.duration}
                audioURL={fileDetails.audioURL}
                fileName={fileDetails.fileName}
            />
            <UploadAudios
                duration={fileDetails.duration}
                file={fileDetails.fileData}
                handleFile={handleFileUpload}
            />
        </div>
    );
};

export default PracticePage;
