"use client";

import Avatar from "@/components/utils/Avarat";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import {
    Bot,
    LoaderCircle,
    Mic,
    PhoneOff,
    Radio,
    Sparkles,
} from "lucide-react";
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

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${mins}:${secs}`;
};

const Page = () => {
    const vapiRef = useRef<Vapi | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState<TranscriptEntry[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const statusMessage = useMemo(() => {
        if (!hasVapiConfig) {
            return "Add NEXT_PUBLIC_VAPI_PUBLIC_API_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID to enable the AI coach.";
        }

        if (isConnecting) {
            return "Connecting to the AI speaking coach...";
        }

        if (isRecording) {
            return "Listening for your response...";
        }

        return "Start the session to begin live conversation practice.";
    }, [isConnecting, isRecording]);

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
        if (!isRecording) {
            return;
        }

        const timer = window.setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isRecording]);

    useEffect(() => {
        if (!hasVapiConfig) {
            return;
        }

        const vapi = new Vapi(publicApiKey as string);
        vapiRef.current = vapi;

        const handleCallStart = () => {
            setIsConnecting(false);
            setIsRecording(true);
            setElapsedSeconds(0);
        };

        const handleCallEnd = () => {
            setIsConnecting(false);
            setIsRecording(false);
            setCurrentMessage("");
            setElapsedSeconds(0);
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
            setElapsedSeconds(0);
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
            setElapsedSeconds(0);
            toast.error("Microphone permission is required to talk with the AI coach.", {
                position: "bottom-right",
                duration: 5000,
            });
        }
    }, [isConnecting, isRecording]);

    const stopCall = useCallback(async () => {
        if (!vapiRef.current) {
            setIsRecording(false);
            setElapsedSeconds(0);
            return;
        }

        await vapiRef.current.stop();
        setIsRecording(false);
        setIsConnecting(false);
        setCurrentMessage("");
        setElapsedSeconds(0);
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            void stopCall();
            return;
        }

        void startCall();
    }, [isRecording, startCall, stopCall]);

    return (
        <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#070a10] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_30%),linear-gradient(180deg,#0b1019_0%,#070a10_52%,#06080d_100%)]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[34px_34px]" />

            <section className="relative mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-6 py-10 md:px-10 lg:px-12">
                <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
                    <div className="rounded-[30px] border border-white/8 bg-[#151922]/92 px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-[#2563eb]/18 blur-2xl" />
                                <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-[#2563eb] bg-[#0d121b] shadow-[0_0_0_10px_rgba(37,99,235,0.12)]">
                                    <Bot className="size-12 text-white" />
                                </div>
                                <span className={`absolute right-0 bottom-1 size-5 rounded-full border-4 border-[#151922] ${isRecording ? "bg-[#22c55e]" : "bg-[#64748b]"}`} />
                            </div>

                            <h2 className="mt-7 text-3xl font-semibold tracking-tight">AI Coach</h2>
                            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#7f8ca3]">
                                {isConnecting ? "Connecting..." : isRecording ? "Listening..." : "Ready"}
                            </p>
                            <p className="mt-4 max-w-md text-sm leading-7 text-[#98a4bb]">
                                {statusMessage}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/8 bg-[#151922]/92 px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-full blur-2xl ${currentMessage ? "bg-[#2563eb]/18" : "bg-white/6"}`} />
                                <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-[#1d4ed8] bg-[#0d121b] shadow-[0_0_0_10px_rgba(29,78,216,0.12)]">
                                    <div className="rounded-full bg-[#0f1724] p-2">
                                        <Avatar />
                                    </div>
                                </div>
                                <span className={`absolute right-0 bottom-1 flex size-5 items-center justify-center rounded-full border-4 border-[#151922] ${currentMessage ? "bg-[#2563eb]" : "bg-[#64748b]"}`}>
                                    <Mic className="size-2.5 text-white" />
                                </span>
                            </div>

                            <h2 className="mt-7 text-3xl font-semibold tracking-tight">You</h2>
                            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#2f6bff]">
                                {currentMessage ? "Speaking" : "Waiting"}
                            </p>
                            <p className="mt-4 max-w-md text-sm leading-7 text-[#98a4bb]">
                                {currentMessage ? "Your live speech is being transcribed in real time." : "Your replies will appear here while the coach listens."}
                            </p>
                        </div>
                    </div>
                </div>

                <section className="mt-16 w-full max-w-5xl self-center">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#7c8aa4]">Live Transcript</p>
                            <p className="mt-3 text-base text-[#8f9ab0]">Follow the conversation as the session unfolds.</p>
                        </div>

                        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] ${isRecording ? "border-red-500/25 bg-red-500/10 text-[#ff6b6b]" : "border-[#1f3b7c] bg-[#0c1527] text-[#7aa2ff]"}`}>
                            <Radio className="size-4" />
                            {isRecording ? `Rec ${formatDuration(elapsedSeconds)}` : isConnecting ? "Connecting" : "Ready"}
                        </div>
                    </div>

                    <div className="space-y-7">
                        {transcription.map((msg, index) => {
                            const isAssistant = msg.role === "assistant";

                            return (
                                <div
                                    key={`${msg.timestamp.toISOString()}-${index}`}
                                    className={`flex items-start gap-4 ${isAssistant ? "" : "justify-end"}`}
                                >
                                    {isAssistant && (
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#1d4ed8]/40 bg-[#0d1a33] text-[#2f6bff]">
                                            <Bot className="size-5" />
                                        </div>
                                    )}

                                    <div className={`${isAssistant ? "max-w-3xl" : "max-w-4xl text-right"}`}>
                                        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.28em] ${isAssistant ? "text-[#7c8aa4]" : "text-[#8fa3cc]"}`}>
                                            {isAssistant ? "AI Coach" : "You"}
                                        </p>
                                        <div
                                            className={`rounded-3xl border px-7 py-6 text-lg leading-9 shadow-[0_16px_40px_rgba(0,0,0,0.28)] ${isAssistant ? "border-white/6 bg-[#11161f] text-[#eef2fa]" : "border-[#12387c] bg-[#09142d] text-[#eef4ff]"}`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>

                                    {!isAssistant && (
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#11161f]">
                                            <Avatar />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {currentMessage && (
                            <div className="flex items-start justify-end gap-4">
                                <div className="max-w-4xl text-right">
                                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8fa3cc]">You</p>
                                    <div className="rounded-3xl border border-[#12387c] bg-[#09142d] px-7 py-6 text-lg leading-9 text-[#dfe9ff] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                                        {currentMessage}
                                    </div>
                                </div>
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#11161f]">
                                    <Avatar />
                                </div>
                            </div>
                        )}

                        {!transcription.length && !currentMessage && (
                            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/3 px-8 py-10 text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#0d1a33] text-[#2f6bff]">
                                    <Sparkles className="size-6" />
                                </div>
                                <p className="mt-5 text-lg text-[#dbe5f8]">No transcript yet.</p>
                                <p className="mt-2 text-sm text-[#8693ab]">Start the session and the conversation will appear here live.</p>
                            </div>
                        )}

                        {isConnecting && (
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#1d4ed8]/40 bg-[#0d1a33] text-[#2f6bff]">
                                    <Bot className="size-5" />
                                </div>
                                <div className="max-w-xs rounded-[22px] border border-white/6 bg-[#11161f] px-6 py-5 text-[#b9c5dd] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                                    <div className="flex items-center gap-3">
                                        <LoaderCircle className="size-5 animate-spin text-[#2f6bff]" />
                                        <span>Warming up your AI coach...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-14 flex justify-center pb-4">
                    <Button
                        onClick={() => {
                            if (isRecording) {
                                void stopCall();
                                return;
                            }

                            void startCall();
                        }}
                        className={`h-18 min-w-70 rounded-full px-10 text-lg font-semibold uppercase tracking-[0.18em] shadow-[0_22px_60px_rgba(0,0,0,0.35)] ${
                            isRecording
                                ? "border border-red-500/20 bg-[#2a1016] text-[#ff5a5a] hover:bg-[#391118]"
                                : "border border-[#1d4ed8]/30 bg-[#0f2250] text-[#dce8ff] hover:bg-[#16306e]"
                        }`}
                    >
                        {isRecording ? <PhoneOff className="size-5" /> : <Mic className="size-5" />}
                        {isConnecting ? "Connecting..." : isRecording ? "End Session" : "Start Session"}
                    </Button>
                </div>

                <div className="fixed right-6 bottom-6 z-30 md:right-10 md:bottom-10">
                    <button
                        onClick={toggleRecording}
                        className={`flex size-18 items-center justify-center rounded-full border shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all ${isRecording ? "border-red-500/20 bg-red-500 hover:bg-red-600" : "border-[#1d4ed8]/30 bg-[#2563eb] hover:bg-[#1d4ed8]"}`}
                    >
                        {isConnecting ? (
                            <LoaderCircle className="size-7 animate-spin text-white" />
                        ) : isRecording ? (
                            <PhoneOff className="size-7 text-white" />
                        ) : (
                            <Mic className="size-7 text-white" />
                        )}
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Page;
