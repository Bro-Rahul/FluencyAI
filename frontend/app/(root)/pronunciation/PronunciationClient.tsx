"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

export default function PronunciationClient() {
    const [word, setWord] = useState("Entrepreneur");
    const [result, setResult] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [listening, setListening] = useState(false);
    const [spokenText, setSpokenText] = useState<string | null>(null);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
    const normalizedWord = word.trim();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const synth = window.speechSynthesis;

        const loadVoices = () => {
            const voices = synth.getVoices();
            if (voices.length > 0) {
                selectedVoiceRef.current =
                    voices.find((voice) => voice.lang.startsWith("en-US")) ||
                    voices.find((voice) => voice.lang.startsWith("en")) ||
                    voices[0];
                setVoicesLoaded(true);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            recognitionRef.current?.stop?.();
        };
    }, []);

    const speakWord = () => {
        if (typeof window === "undefined") return;
        if (!normalizedWord) {
            setSpeechError("Type a word first so I can pronounce it.");
            return;
        }

        const synth = window.speechSynthesis;

        if (!synth) {
            setSpeechError("Speech synthesis is not supported in this browser.");
            return;
        }

        setSpeechError(null);
        synth.cancel();
        synth.resume();

        const utterance = new SpeechSynthesisUtterance(normalizedWord);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        if (selectedVoiceRef.current) {
            utterance.voice = selectedVoiceRef.current;
        }

        utterance.onerror = (e) => {
            console.error("Speech error:", e);
            setSpeechError("Unable to play pronunciation audio on this browser.");
        };

        synth.speak(utterance);
    };

    const getRecognitionErrorMessage = (error: string) => {
        if (error === "not-allowed") {
            return "Microphone permission was blocked. Please allow mic access and try again.";
        }

        if (error === "no-speech") {
            return "No speech was detected. Try speaking a little closer to the mic.";
        }

        if (error === "audio-capture") {
            return "No microphone was found for speech recognition.";
        }

        if (error === "network") {
            return "Speech recognition hit a network issue. Try again in Chrome with internet access.";
        }

        return `Speech recognition failed: ${error}.`;
    };

    const startListening = () => {
        if (typeof window === "undefined") return;
        if (!normalizedWord) {
            setSpeechError("Enter a word before starting pronunciation practice.");
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechError("Speech recognition is not supported in this browser. Try Google Chrome.");
            return;
        }

        setSpeechError(null);
        setResult(null);
        setFeedback(null);

        recognitionRef.current?.abort?.();

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
            const spokenWord = event.results[0][0].transcript;
            setSpokenText(spokenWord);

            try {
                const res = await fetch("/api/pronunciation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        expected: normalizedWord,
                        spoken: spokenWord,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.detail || "Unable to evaluate pronunciation.");
                }
                setResult(data.message);
                setFeedback(data.feedback);
                setScore(Math.round(data.score * 100));
            } catch (error) {
                setResult(error instanceof Error ? error.message : "Something went wrong.");
                setFeedback(null);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setListening(false);
            setResult("Speech recognition failed.");
            setFeedback(null);
            setSpeechError(getRecognitionErrorMessage(event.error || "unknown"));
        };

        recognition.onend = () => {
            setListening(false);
        };

        try {
            setListening(true);
            recognition.start();
        } catch {
            setListening(false);
            setSpeechError("Unable to start speech recognition. Try refreshing the page and allowing mic access.");
        }
    };

    const handleWordChange = (value: string) => {
        setWord(value);
        setResult(null);
        setFeedback(null);
        setScore(null);
        setSpokenText(null);
        setSpeechError(null);
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 transition-all">
            <div className="mb-6 space-y-2">
                <label
                    htmlFor="pronunciation-word"
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                    Practice Word
                </label>
                <input
                    id="pronunciation-word"
                    type="text"
                    value={word}
                    onChange={(event) => handleWordChange(event.target.value)}
                    placeholder="Type a word to practice"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-blue-900"
                />
            </div>

            {/* Word Display */}
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                {normalizedWord || "Type a word"}
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6">
                Tap 🔊 to hear, then 🎙️ to pronounce
            </p>
            {speechError && (
                <p className="text-center text-sm text-red-500 mb-4">
                    {speechError}
                </p>
            )}

            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={speakWord}
                    disabled={!voicesLoaded || !normalizedWord}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium transition-all active:scale-95"
                >
                    {voicesLoaded ? "🔊 Hear" : "Loading voice..."}
                </button>

                <button
                    onClick={startListening}
                    disabled={listening || !normalizedWord}
                    className={`px-5 py-2 rounded-xl font-medium transition-all active:scale-95 ${listening
                        ? "bg-red-500 animate-pulse text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                    {listening ? "Listening..." : "🎙️ Speak"}
                </button>
            </div>

            {spokenText && (
                <p className="text-center text-sm text-gray-400 mb-3">
                    You said: &quot;{spokenText}&quot;
                </p>
            )}

            {result && (
                <div className="text-center space-y-3">
                    <p
                        className={`text-lg font-semibold ${score && score > 90
                            ? "text-green-600"
                            : score && score > 75
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                    >
                        {result}
                    </p>
                    {feedback && (
                        <p className="text-sm text-gray-500">
                            {feedback}
                        </p>
                    )}

                    {score !== null && (
                        <div>
                            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3">
                                <div
                                    className="h-3 rounded-full bg-linear-to-r from-green-400 to-blue-500 transition-all duration-500"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Pronunciation Score: {score}%
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
