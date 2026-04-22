import { useEffect, useRef, useState } from "react"


const useAudioVideoPermission = (closeInstantly?: boolean) => {
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true);
    const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true);

    useEffect(() => {

        const init = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });
                streamRef.current = media;

                if (closeInstantly) {
                    streamRef.current.getTracks().forEach(track => track.stop())
                } else {
                    setIsCameraEnabled(media.getVideoTracks()[0]?.enabled ?? true);
                    setIsMicEnabled(media.getAudioTracks()[0]?.enabled ?? true);
                }
                setHasPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = media;
                }
            } catch {
                console.log("Can't get the Audio and Video Permissions")
            }


        }

        init();

        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        }
    }, [closeInstantly]);

    const toggleCamera = () => {
        const stream = streamRef.current;
        if (!stream) {
            return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
            return;
        }

        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraEnabled(videoTrack.enabled);
    };

    const toggleMic = () => {
        if (!streamRef.current) return;
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (!audioTrack) return;
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicEnabled(audioTrack.enabled);
    };

    return {
        streamRef,
        videoRef,
        hasPermission,
        isCameraEnabled,
        isMicEnabled,
        toggleCamera,
        toggleMic
    }
}

export default useAudioVideoPermission
