"use client";

import Avatar from "@/components/utils/Avarat";
import icons from "@/constants/icons";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type TranscriptRole = "assistant" | "user";

type TranscriptEntry = {
    role: TranscriptRole;
    content: string;
    timestamp: Date;
};

type VapiMessage = {
    type?: string;
    role?: TranscriptRole;
    transcriptType?: "partial" | "final";
    transcript?: string;
    content?: string;
    status?: string;
    message?: {
        role?: TranscriptRole;
        content?: string;
    };
};

const publicApiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY;
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const hasVapiConfig = Boolean(publicApiKey && assistantId);

const Page = () => {
    const vapiRef = useRef<Vapi | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptEntry[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);

    const statusMessage = useMemo(() => {
        if (!hasVapiConfig) {
            return "Add NEXT_PUBLIC_VAPI_PUBLIC_API_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID to enable the AI coach.";
        }

        if (isConnecting) {
            return "Connecting to Vapi AI agent...";
        }

        if (currentMessage) {
            return currentMessage;
        }

        return isRecording ? "Speak now..." : "Click the mic to start";
    }, [currentMessage, isConnecting, isRecording]);

    const appendTranscript = useCallback((role: TranscriptRole, content?: string) => {
        const trimmedContent = content?.trim();
        if (!trimmedContent) {
            return;
        }

        setTranscription((prev) => [
            ...prev,
            {
                role,
                content: trimmedContent,
                timestamp: new Date(),
            },
        ]);
    }, []);

    useEffect(() => {
        if (!hasVapiConfig) {
            return;
        }

        const vapi = new Vapi(publicApiKey as string);
        vapiRef.current = vapi;

        const handleCallStart = () => {
            setIsConnecting(false);
            setIsRecording(true);
        };

        const handleCallEnd = () => {
            setIsConnecting(false);
            setIsRecording(false);
            setCurrentMessage("");
        };

        const handleSpeechStart = () => {
            setIsRecording(true);
        };

        const handleSpeechEnd = () => {
            setIsRecording(false);
        };

        const handleMessage = (message: VapiMessage) => {
            if (message.type === "transcript") {
                if (message.transcriptType === "partial") {
                    setCurrentMessage(message.transcript ?? "");
                    return;
                }

                if (message.transcriptType === "final") {
                    setCurrentMessage("");
                    appendTranscript(message.role === "assistant" ? "assistant" : "user", message.transcript);
                    return;
                }
            }

            if (message.message?.content) {
                appendTranscript(
                    message.message.role === "assistant" ? "assistant" : "user",
                    message.message.content,
                );
                setCurrentMessage("");
                return;
            }

            if (typeof message.content === "string" && message.role) {
                appendTranscript(message.role, message.content);
                setCurrentMessage("");
                return;
            }

            if (message.type === "status-update" && message.status === "ended") {
                handleCallEnd();
            }
        };

        const handleError = (error: unknown) => {
            console.error("Vapi error", error);
            setIsConnecting(false);
            setIsRecording(false);
            setCurrentMessage("");
            toast.error("Unable to start the Vapi AI agent. Check your Vapi config and microphone permission.", {
                position: "bottom-right",
                duration: 5000,
            });
        };

        vapi.on("call-start", handleCallStart);
        vapi.on("call-end", handleCallEnd);
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("message", handleMessage);
        vapi.on("error", handleError);

        return () => {
            vapi.removeAllListeners();
            void vapi.stop();
            vapiRef.current = null;
        };
    }, [appendTranscript]);

    const startCall = useCallback(async () => {
        if (!hasVapiConfig) {
            toast.error("Missing Vapi configuration. Add NEXT_PUBLIC_VAPI_PUBLIC_API_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID.", {
                position: "bottom-right",
                duration: 5000,
            });
            return;
        }

        if (!vapiRef.current || isConnecting || isRecording) {
            return;
        }

        try {
            setIsConnecting(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            await vapiRef.current.start(assistantId as string);
        } catch (error) {
            console.error("Unable to start Vapi call", error);
            setIsConnecting(false);
            setIsRecording(false);
            toast.error("Microphone permission is required to talk with the AI coach.", {
                position: "bottom-right",
                duration: 5000,
            });
        }
    }, [isConnecting, isRecording]);

    const stopCall = useCallback(async () => {
        if (!vapiRef.current) {
            setIsRecording(false);
            return;
        }

        await vapiRef.current.stop();
        setIsRecording(false);
        setIsConnecting(false);
        setCurrentMessage("");
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            void stopCall();
            return;
        }

        void startCall();
    }, [isRecording, startCall, stopCall]);

    return (
        <div className="text-on-surface min-h-screen flex flex-col bg-[#101622] font-['Inter']">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-4xl mx-auto w-full">
                <section className="w-full flex flex-col items-center justify-center py-12 relative">
                    <div className="relative group">
                        <div className={`absolute inset-0 ${isRecording ? "bg-red-500/20" : "bg-blue-500/20"} rounded-full blur-3xl opacity-40 group-hover:opacity-60`}></div>

                        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#111318] border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-end gap-1.5 h-16">
                                    {[8, 12, 16, 10, 14, 12].map((h, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 ${isRecording ? "bg-red-500" : "bg-blue-500"} rounded-full ${isRecording ? "animate-pulse" : ""}`}
                                            style={{ height: `${h * 4}px` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <Image
                                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoMccpcSTRFvp0MTLuVnPgJNSRl7GYVswvYqDA_Kil2RmaV7t8tXVNTQcPBNfA6EV9BnWTGNSxf45O-fjyleatne__e6OEPIkYUSdSA1nrA_IUd0l7ooXW1SP6BerjMtD_JfGaWa8oJM-8vVgk_NFkRkpJp5Mvl7YO0jvJQHXd59JC12Kp5Aqz7Q8P8xY3uFXCs8jZmfqORD79x_jcDn-EBhAHXQWNNrM1cVRn36Yex8mzJnsLcqAH4qWjLJJSZdWQClvRsIeLRT1"
                                alt="AI visual"
                                width={256}
                                height={256}
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            {isConnecting ? "Connecting to AI Coach..." : isRecording ? "AI Coach is listening..." : "AI Coach"}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{statusMessage}</p>
                    </div>
                </section>

                <section className="w-full mt-auto mb-8">
                    <div className="bg-[#1c1f27] rounded-xl border border-white/5 p-6 shadow-2xl h-64 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] uppercase text-gray-400">
                                Live Transcription
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${isRecording ? "bg-red-500" : "bg-blue-500"} rounded-full`}></span>
                                <span className={`text-[10px] uppercase ${isRecording ? "text-red-500" : "text-blue-500"}`}>
                                    {isConnecting ? "Connecting" : isRecording ? "Recording" : "Ready"}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            {transcription.map((msg, index) => (
                                <div key={`${msg.timestamp.toISOString()}-${index}`} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                        {msg.role === "assistant" ? (
                                            <Image
                                                src={icons.robortIcon}
                                                alt="AI Icon"
                                                width={20}
                                                height={20}
                                                className="text-blue-500"
                                            />
                                        ) : (
                                            <Avatar />
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-xs uppercase ${msg.role === "assistant" ? "text-blue-500" : "text-gray-400"}`}>
                                            {msg.role === "assistant" ? "AI Coach" : "You"}
                                        </p>
                                        <p className={`text-sm ${msg.role === "assistant" ? "text-white" : "text-gray-200"}`}>
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {currentMessage && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                        <Avatar />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">You</p>
                                        <p className="text-sm text-gray-200 italic">
                                            {currentMessage}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="w-full flex items-center justify-between gap-6 pb-4">
                    <button
                        onClick={() => void stopCall()}
                        className="flex-1 py-4 bg-[#282e39] rounded-xl text-red-500 flex items-center justify-center gap-2 hover:bg-red-500/10"
                    >
                        <Image
                            src={icons.callEndRedIcons}
                            alt="Call End Icon"
                            width={24}
                            height={24}
                            className="text-red-500"
                        />
                        End Session
                    </button>

                    <button
                        onClick={toggleRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isRecording
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        <Image
                            src={isRecording ? icons.callEndRedIcons : icons.micIcon}
                            alt={isRecording ? "Stop Recording" : "Start Recording"}
                            width={24}
                            height={24}
                            priority
                        />
                    </button>

                    <button className="flex-1 py-4 bg-[#282e39] rounded-xl flex items-center justify-center gap-2 text-white hover:bg-[#3a4151]">
                        <Image
                            src={icons.volumnUpIcons}
                            alt="Volume Up Icon"
                            width={24}
                            height={24}
                        />
                        Audio Settings
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Page;
