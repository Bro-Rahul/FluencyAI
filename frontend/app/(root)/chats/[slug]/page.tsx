"use client"

import { Button } from "@/components/ui/button";
import icons from "@/constants/icons";
import Image from "next/image";
import { useEffect, useRef } from "react";


const page = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    useEffect(() => {
        const init = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });

                streamRef.current = media;

                if (videoRef.current) {
                    videoRef.current.srcObject = media;
                }
            } catch (err) {
                console.log("can't get the access");
            }
        };

        init();
    }, []);

    const toggleCamera = () => {
        if (!streamRef.current) return;

        const videoTrack = streamRef.current.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
    };

    const toggleMic = () => {
        if (!streamRef.current) return;

        const audioTrack = streamRef.current.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#080b11] text-white font-sans">

            <main className="flex-1 h-screen flex overflow-hidden relative">

                {/* Main Video Section */}
                <section className="flex-1 relative bg-black flex items-center justify-center">

                    {/* Background Blur */}
                    <img
                        className="absolute inset-0 w-full h-full object-cover blur-2xl brightness-[0.4]"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwWJd9cM1anvvzNz2dmEEf3yLlgywoiuiARU7l3Ea02gAMnjkVMdzABhz2UsxKk96IndX_oljENeQIO6vnKAPze9iYvf56P7cdWFGoa2HDXz4x39OHvuBKWpmCFXvYFkZCA3bhp_yw6a3SAWUJEbltOKPj06pzmSu5xP0NWrm9jer8dtP9ipzUpif4yKr52ZDn2VyluSHNZHiqYc_oqk3CyHPFOyytxvjsLPkZ7Yp1xYrP577AM9vthauVqHyEojBJBxYU1rcpst-r"
                        alt="background"
                    />

                    {/* Center Content */}
                    <div className="z-10 flex flex-col items-center gap-6 p-8 text-center max-w-md">

                        {/* Animated Circle */}
                        <div className="relative flex items-center justify-center">

                            {/* Outer pulse */}
                            <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping"></div>

                            {/* Inner spinning ring */}
                            <div className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin flex items-center justify-center">

                                {/* Center dot */}
                                <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>

                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold animate-pulse">
                                Searching for a partner...
                            </h2>

                            <p className="text-gray-400 text-sm animate-fade-in">
                                Matching you with a learner
                            </p>
                        </div>

                    </div>

                    {/* User Preview */}
                    <div className="absolute bottom-10 right-6 w-40 h-56 rounded-xl overflow-hidden border border-white/10">
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

                    {/* Controls */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <div className="flex gap-3 bg-black/70 p-3 rounded-xl border border-white/10">

                            <Button className="w-14 h-14 bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
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
                                className="w-14 h-14 bg-white/10 hover:bg-white/30 cursor-pointer rounded-lg">
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
                                className="w-14 h-14 bg-white/10 hover:bg-white/30 cursor-pointer rounded-lg">
                                <Image
                                    alt="Camera"
                                    src={icons.cameraIcon}
                                    priority
                                    width={150}
                                    height={150}
                                />
                            </Button>

                            <Button className="w-14 h-14 bg-red-600 hover:bg-red-700 cursor-pointer rounded-lg">
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

                {/* Chat Sidebar */}
                {/* <aside className="hidden lg:flex w-[320px] bg-black/40 backdrop-blur flex-col border-l border-white/10">

                    <div className="p-4 border-b border-white/10 text-xs text-gray-400">
                        Live Chat
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">

                        <div className="text-sm bg-white/5 p-3 rounded">
                            Welcome! Start chatting 👋
                        </div>

                        <div className="text-sm bg-blue-500/20 p-3 rounded text-right">
                            Hello!
                        </div>

                    </div>

                    <div className="p-4">
                        <input
                            className="w-full bg-white/10 rounded-lg p-2 text-sm"
                            placeholder="Type a message..."
                        />
                    </div>

                </aside> */}
            </main>
        </div>
    );
};

export default page;