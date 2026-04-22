"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import icons from "@/constants/icons";
import useAudioVideoPermission from "@/hooks/useAudioVideoPermission";

type Role = "Caller" | "Receiver";

type SocketMessage =
    | {
        event: "Waiting";
        data: Record<string, never>;
    }
    | {
        event: "Match";
        data: {
            role: Role;
            target: string;
        };
    }
    | {
        event: "Offer";
        data: {
            offer: RTCSessionDescriptionInit;
            target: string;
        };
    }
    | {
        event: "Answer";
        data: {
            answer: RTCSessionDescriptionInit;
            target: string;
        };
    }
    | {
        event: "Ice";
        data: {
            candidate: RTCIceCandidateInit;
            target: string;
        };
    }
    | {
        event: "PeerDisconnected";
        data: {
            target: string;
        };
    };

const rtcConfig: RTCConfiguration = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"],
        },
    ],
};

const attachStreamToVideo = async (
    videoElement: HTMLVideoElement | null,
    stream: MediaStream,
    muted: boolean,
    allowMutedFallback = false,
) => {
    if (!videoElement) {
        return;
    }

    videoElement.srcObject = stream;
    videoElement.muted = muted;
    videoElement.volume = 1;

    try {
        await videoElement.play();
    } catch {
        if (allowMutedFallback && !muted) {
            videoElement.muted = true;
            try {
                await videoElement.play();
            } catch {
                console.log("Unable to autoplay attached stream");
            }
            return;
        }

        console.log("Unable to autoplay attached stream");
    }
};

const Page = () => {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const {
        streamRef,
        videoRef,
        hasPermission,
        toggleCamera,
        toggleMic,
        isCameraEnabled,
        isMicEnabled,
    } = useAudioVideoPermission();

    const peerVideoRef = useRef<HTMLVideoElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const targetPeerRef = useRef<string | null>(null);
    const queuedCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
    const [status, setStatus] = useState("Searching for a partner...");
    const [isMatched, setIsMatched] = useState(false);
    const [isRemoteConnected, setIsRemoteConnected] = useState(false);

    const sendMessage = useCallback((event: string, data: Record<string, unknown>) => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
            return;
        }

        socketRef.current.send(
            JSON.stringify({
                event,
                data,
            }),
        );
    }, []);

    const resetRemoteMedia = useCallback(() => {
        if (peerVideoRef.current) {
            peerVideoRef.current.srcObject = null;
        }

        remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = null;
    }, []);

    const closePeerConnection = useCallback(() => {
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        queuedCandidatesRef.current = [];
        targetPeerRef.current = null;
        setIsMatched(false);
        setIsRemoteConnected(false);
        resetRemoteMedia();
    }, [resetRemoteMedia]);

    const ensurePeerConnection = useCallback(() => {
        if (peerConnectionRef.current) {
            return peerConnectionRef.current;
        }

        const peerConnection = new RTCPeerConnection(rtcConfig);
        peerConnectionRef.current = peerConnection;

        remoteStreamRef.current = new MediaStream();
        void attachStreamToVideo(peerVideoRef.current, remoteStreamRef.current, false);

        streamRef.current?.getTracks().forEach((track) => {
            peerConnection.addTrack(track, streamRef.current as MediaStream);
        });

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate || !targetPeerRef.current) {
                return;
            }

            sendMessage("Ice", {
                target: targetPeerRef.current,
                candidate: event.candidate.toJSON(),
            });
        };

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (remoteStream) {
                remoteStreamRef.current = remoteStream;
                void attachStreamToVideo(peerVideoRef.current, remoteStream, false);
                setIsRemoteConnected(true);
                return;
            }

            if (event.track) {
                remoteStreamRef.current?.addTrack(event.track);
                void attachStreamToVideo(
                    peerVideoRef.current,
                    remoteStreamRef.current as MediaStream,
                    false,
                );
                setIsRemoteConnected(true);
            }
        };

        peerConnection.onconnectionstatechange = () => {
            const state = peerConnection.connectionState;

            if (state === "connected") {
                setStatus("Connected");
                setIsMatched(true);
                setIsRemoteConnected(true);
            }

            if (state === "disconnected" || state === "failed" || state === "closed") {
                closePeerConnection();
                setStatus("Partner disconnected. Searching again...");
            }
        };

        return peerConnection;
    }, [closePeerConnection, sendMessage, streamRef]);

    const flushQueuedIceCandidates = useCallback(async (peerConnection: RTCPeerConnection) => {
        for (const candidate of queuedCandidatesRef.current) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        queuedCandidatesRef.current = [];
    }, []);

    const createOffer = useCallback(async () => {
        if (!targetPeerRef.current) {
            return;
        }

        const peerConnection = ensurePeerConnection();
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        sendMessage("Offer", {
            target: targetPeerRef.current,
            offer,
        });
    }, [ensurePeerConnection, sendMessage]);

    useEffect(() => {
        if (!hasPermission || !streamRef.current) {
            return;
        }

        void attachStreamToVideo(videoRef.current, streamRef.current, true);
    }, [hasPermission, streamRef, videoRef]);

    useEffect(() => {
        if (!isMatched || !remoteStreamRef.current) {
            return;
        }

        void attachStreamToVideo(peerVideoRef.current, remoteStreamRef.current, false);
    }, [isMatched]);

    useEffect(() => {
        if (!isMatched || !remoteStreamRef.current) {
            return;
        }

        const resumeRemoteAudio = async () => {
            if (!peerVideoRef.current || !remoteStreamRef.current) {
                return;
            }

            peerVideoRef.current.muted = false;
            peerVideoRef.current.volume = 1;
            await attachStreamToVideo(peerVideoRef.current, remoteStreamRef.current, false);
        };

        window.addEventListener("pointerdown", resumeRemoteAudio);

        return () => {
            window.removeEventListener("pointerdown", resumeRemoteAudio);
        };
    }, [isMatched]);

    useEffect(() => {
        if (!slug || !hasPermission || !streamRef.current) {
            return;
        }

        const socket = new WebSocket(`ws://localhost:8000/v1/api/chats/${slug}`);
        socketRef.current = socket;

        socket.onopen = () => {
            setStatus("Searching for a partner...");
            sendMessage("find", {});
        };

        socket.onmessage = async (message) => {
            const payload: SocketMessage = JSON.parse(message.data);

            switch (payload.event) {
                case "Waiting":
                    setStatus("Searching for a partner...");
                    break;

                case "Match":
                    targetPeerRef.current = payload.data.target;
                    setStatus("Partner found. Connecting...");
                    setIsMatched(true);
                    ensurePeerConnection();

                    if (payload.data.role === "Caller") {
                        await createOffer();
                    }
                    break;

                case "Offer": {
                    targetPeerRef.current = payload.data.target;
                    const peerConnection = ensurePeerConnection();

                    if (peerConnection.signalingState !== "stable") {
                        return;
                    }

                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(payload.data.offer),
                    );
                    await flushQueuedIceCandidates(peerConnection);

                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);

                    sendMessage("Answer", {
                        target: payload.data.target,
                        answer,
                    });
                    break;
                }

                case "Answer": {
                    const peerConnection = ensurePeerConnection();

                    if (peerConnection.signalingState !== "have-local-offer") {
                        return;
                    }

                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(payload.data.answer),
                    );
                    await flushQueuedIceCandidates(peerConnection);
                    break;
                }

                case "Ice": {
                    const peerConnection = ensurePeerConnection();

                    if (peerConnection.remoteDescription) {
                        await peerConnection.addIceCandidate(
                            new RTCIceCandidate(payload.data.candidate),
                        );
                    } else {
                        queuedCandidatesRef.current.push(payload.data.candidate);
                    }
                    break;
                }

                case "PeerDisconnected":
                    closePeerConnection();
                    setStatus("Partner disconnected. Searching again...");
                    sendMessage("find", {});
                    break;
            }
        };

        socket.onerror = () => {
            toast.error("Unable to connect to the signaling server.");
            setStatus("Signaling server unavailable");
        };

        socket.onclose = () => {
            socketRef.current = null;
        };

        return () => {
            sendMessage("Leave", {});
            socket.close();
            closePeerConnection();
        };
    }, [closePeerConnection, createOffer, ensurePeerConnection, flushQueuedIceCandidates, hasPermission, sendMessage, slug, streamRef]);

    const handleHangUp = () => {
        sendMessage("Leave", {});
        closePeerConnection();
        socketRef.current?.close();
        router.push("/chats");
    };

    const handleSwap = () => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
            toast.error("Signaling server is not connected.");
            return;
        }

        sendMessage("Leave", {});
        closePeerConnection();
        setStatus("Searching for a new partner...");
        sendMessage("find", {});
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#080b11] text-white font-sans">
            <main className="flex-1 h-screen flex overflow-hidden relative">
                <section className="flex-1 relative bg-black flex items-center justify-center">
                    <Image
                        className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-[0.4]"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwWJd9cM1anvvzNz2dmEEf3yLlgywoiuiARU7l3Ea02gAMnjkVMdzABhz2UsxKk96IndX_oljENeQIO6vnKAPze9iYvf56P7cdWFGoa2HDXz4x39OHvuBKWpmCFXvYFkZCA3bhp_yw6a3SAWUJEbltOKPj06pzmSu5xP0NWrm9jer8dtP9ipzUpif4yKr52ZDn2VyluSHNZHiqYc_oqk3CyHPFOyytxvjsLPkZ7Yp1xYrP577AM9vthauVqHyEojBJBxYU1rcpst-r"
                        alt="background"
                        fill
                        unoptimized
                    />

                    {!isMatched && (
                        <div className="absolute inset-0 bg-black/30"></div>
                    )}

                    {!isMatched ? (
                        <div className="z-10 flex flex-col items-center gap-6 p-8 text-center max-w-md">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping"></div>
                                <div className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin flex items-center justify-center">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">{status}</h2>
                                <p className="text-gray-400 text-sm">
                                    Matching you with another learner in real time.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-8">
                            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                                <video
                                    ref={peerVideoRef}
                                    autoPlay
                                    playsInline
                                    controls={false}
                                    className="h-full w-full object-cover"
                                ></video>

                                <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2 text-sm backdrop-blur">
                                    {isRemoteConnected ? "Partner Connected" : "Waiting for peer video..."}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`absolute z-20 overflow-hidden border border-white/10 bg-black/40 shadow-2xl transition-all duration-300 ${isRemoteConnected ? "bottom-6 right-6 h-48 w-32 rounded-2xl md:h-64 md:w-44" : "bottom-10 right-6 h-56 w-40 rounded-xl"}`}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        ></video>

                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 text-[10px] rounded">
                            You
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
                        <div className="flex gap-3 bg-black/70 p-3 rounded-xl border border-white/10">
                            <Button
                                onClick={handleSwap}
                                className="w-14 h-14 bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
                                <Image
                                    alt="Swap-next"
                                    src={icons.swapIcon}
                                    priority
                                    width={150}
                                    height={150}
                                />
                            </Button>

                            <Button
                                onClick={toggleMic}
                                className={`w-14 h-14 hover:bg-white/30 cursor-pointer rounded-lg ${isMicEnabled ? "bg-white/10" : "bg-red-500/70"}`}>
                                <Image
                                    alt="Mic"
                                    src={icons.micIcon}
                                    priority
                                    width={150}
                                    height={150}
                                />
                            </Button>

                            <Button
                                onClick={toggleCamera}
                                className={`w-14 h-14 hover:bg-white/30 cursor-pointer rounded-lg ${isCameraEnabled ? "bg-white/10" : "bg-red-500/70"}`}>
                                <Image
                                    alt="Camera"
                                    src={icons.cameraIcon}
                                    priority
                                    width={150}
                                    height={150}
                                />
                            </Button>

                            <Button
                                onClick={handleHangUp}
                                className="w-14 h-14 bg-red-600 hover:bg-red-700 cursor-pointer rounded-lg">
                                <Image
                                    alt="Hang-Up"
                                    src={icons.callEndIcon}
                                    priority
                                    width={150}
                                    height={150}
                                />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Page;
