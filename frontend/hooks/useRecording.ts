import { useEffect, useRef, useState } from "react";

type RecordingState = "play" | "pause" | "stop";

export const useRecording = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>("stop");
    const [permission, setPermission] = useState<PermissionState>("prompt");
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const initPermission = async () => {
            try {
                const status = await navigator.permissions.query({
                    name: "microphone",
                });
                setPermission(status.state);
                status.onchange = () => setPermission(status.state);
            } catch {
                console.warn("Permission API not supported");
            }
        };

        initPermission();

        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
        if (recordingState !== "play") return;
        const timer = setInterval(() => {
            setRecordingTime(pre => pre + 1);
        }, 1000);

        return () => {
            clearTimeout(timer)
        }
    }, [recordingState, recordingTime]);

    const start = async () => {
        chunksRef.current = [];

        if (!streamRef.current) {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        mediaRecorderRef.current = new MediaRecorder(streamRef.current);

        mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorderRef.current.start();
    };

    const pause = () => mediaRecorderRef.current?.pause();
    const resume = () => mediaRecorderRef.current?.resume();

    const stop = (): Promise<Blob> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) return;

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: mediaRecorderRef.current?.mimeType || "audio/webm",
                });

                streamRef.current?.getTracks().forEach(track => track.stop());
                streamRef.current = null;

                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    };

    return {
        recordingState,
        permission,
        recordingTime,
        setRecordingState,
        start,
        pause,
        resume,
        stop,
    };
};

export default useRecording;
