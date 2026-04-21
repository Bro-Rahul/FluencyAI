import { useEffect, useRef, useState } from "react"


const useAudioVideoPermission = (closeInstantly?: boolean) => {
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean>(false);

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
                }
                setHasPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = media;
                }
            } catch (err) {
                console.log("Can't get the Audio and Video Permissions")
            }


        }

        init();

        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        }
    }, []);

    const toggleCamera = async () => {
        const stream = streamRef.current;

        // If no stream → start camera
        if (!stream) {
            await startCamera();
            return;
        }

        const videoTrack = stream.getVideoTracks()[0];

        // If track exists and is live → stop it
        if (videoTrack && videoTrack.readyState === "live") {
            videoTrack.stop();

            // cleanup
            streamRef.current = null;

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        } else {
            // Track ended → start again
            await startCamera();
        }
    };
    const startCamera = async () => {
        const media = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        streamRef.current = media;

        if (videoRef.current) {
            videoRef.current.srcObject = media;
        }
    };

    const toggleMic = () => {
        if (!streamRef.current) return;
        const audioTrack = streamRef.current.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
    };

    return {
        streamRef,
        videoRef,
        hasPermission,
        toggleCamera,
        toggleMic
    }
}

export default useAudioVideoPermission