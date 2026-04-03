"use client";

import { useState, useEffect } from "react";

export default function PronunciationClient() {
    const [word] = useState("Entrepreneur");
    const [result, setResult] = useState<string | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [listening, setListening] = useState(false);
    const [spokenText, setSpokenText] = useState<string | null>(null);
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    // ✅ Load voices properly (IMPORTANT FIX)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const synth = window.speechSynthesis;

        const loadVoices = () => {
            const voices = synth.getVoices();
            if (voices.length > 0) {
                setVoicesLoaded(true);
            }
        };

        loadVoices();
        synth.onvoiceschanged = loadVoices;

        return () => {
            synth.onvoiceschanged = null;
        };
    }, []);

    // 🔊 Text-to-Speech (FIXED)
    const speakWord = () => {
        if (typeof window === "undefined") return;

        const synth = window.speechSynthesis;

        if (!synth) {
            alert("Speech synthesis not supported.");
            return;
        }

        // Cancel anything already speaking
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
            console.log("Speaking started");
        };

        utterance.onerror = (e) => {
            console.error("Speech error:", e);
        };

        synth.speak(utterance);
    };
    // 🎙 Speech Recognition
    const startListening = () => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setListening(true);
        recognition.start();

        recognition.onresult = async (event: any) => {
            const spokenWord = event.results[0][0].transcript;
            setSpokenText(spokenWord);
            setListening(false);

            try {
                const res = await fetch("/api/pronunciation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        expected: word,
                        spoken: spokenWord,
                    }),
                });

                const data = await res.json();
                setResult(data.message);
                setScore(Math.round(data.score * 100));
            } catch (error) {
                setResult("Something went wrong.");
            }
        };

        recognition.onerror = () => {
            setListening(false);
            setResult("Speech recognition failed.");
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-zinc-700 transition-all">

            {/* Word Display */}
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                {word}
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6">
                Tap 🔊 to hear, then 🎙️ to pronounce
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={speakWord}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all active:scale-95"
                >
                    🔊 Hear
                </button>

                <button
                    onClick={startListening}
                    className={`px-5 py-2 rounded-xl font-medium transition-all active:scale-95 ${listening
                        ? "bg-red-500 animate-pulse text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                    {listening ? "Listening..." : "🎙️ Speak"}
                </button>
            </div>

            {/* Spoken Text */}
            {spokenText && (
                <p className="text-center text-sm text-gray-400 mb-3">
                    You said: "{spokenText}"
                </p>
            )}

            {/* Result Section */}
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

                    {/* Score Bar */}
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