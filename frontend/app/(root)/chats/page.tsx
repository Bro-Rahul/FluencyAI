"use client";

import { Button } from "@/components/ui/button";
import useAudioVideoPermission from "@/hooks/useAudioVideoPermission";
import {
    ArrowRight,
    Bot,
    Globe,
    Sparkles,
    Users,
    Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const Page = () => {
    const router = useRouter();
    const { hasPermission } = useAudioVideoPermission(true);

    const handleAiPractice = () => {
        router.push("/chats/ai");
    };

    const handleRandomChat = () => {
        if (hasPermission) {
            const id = crypto.randomUUID();
            router.push(`/chats/${id}`);
            return;
        }

        toast.error("Can't start the video chat because camera and mic permissions are not available.", {
            position: "bottom-right",
            duration: 5000,
        });
    };

    return (
        <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#0a0c10] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_32%),linear-gradient(180deg,#0f1622_0%,#0a0c10_45%,#08090c_100%)]" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[36px_36px]" />
            <div className="absolute inset-y-0 left-1/2 hidden w-px bg-white/6 lg:block" />

            <section className="relative mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col px-6 py-14 md:px-10 md:py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
                        Ready to <span className="text-[#2f6bff]">Speak?</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#9ba7be] md:text-2xl md:leading-10">
                        Choose your journey today. Master the foundations with AI or dive into real conversations with people around the world.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 lg:mt-18 lg:grid-cols-2">
                    <section className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#181b22]/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] hover:border-[#2f6bff] cursor-pointer transition-colors delay-100">
                        <div className="absolute right-8 bottom-6 opacity-8">
                            <Sparkles className="size-28 text-white" />
                        </div>

                        <div className="relative flex h-full flex-col">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#222938] text-[#2f6bff]">
                                <Bot className="size-7" />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h2 className="text-3xl font-semibold tracking-tight text-white">Practice with AI Tutor</h2>
                                <p className="max-w-xl text-lg leading-8 text-[#a2adc3]">
                                    Safe space to practice basics. Perfect for beginners or building confidence before real conversations.
                                </p>
                            </div>

                            <Button
                                onClick={handleAiPractice}
                                className="mt-10 h-auto w-fit bg-transparent p-0 text-base font-semibold uppercase tracking-[0.14em] text-[#2f6bff] shadow-none hover:bg-transparent hover:text-[#5d8cff]"
                            >
                                Start Session
                                <ArrowRight className="size-5" />
                            </Button>
                        </div>
                    </section>

                    <section className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[#181b22]/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] hover:border-[#2f6bff] cursor-pointer transition-colors delay-100">
                        <div className="absolute right-6 bottom-6 opacity-[0.07]">
                            <div className="flex size-28 items-center justify-center rounded-full border-10 border-white">
                                <Globe className="size-14 text-white" />
                            </div>
                        </div>

                        <div className="relative flex h-full flex-col">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#222938] text-[#2f6bff]">
                                <Users className="size-7" />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h2 className="text-3xl font-semibold tracking-tight text-white">Talk to a Random Person</h2>
                                <p className="max-w-xl text-lg leading-8 text-[#a2adc3]">
                                    Real-world conversation practice. Connect with learners or native speakers globally for authentic immersion.
                                </p>
                            </div>

                            <Button
                                onClick={handleRandomChat}
                                className="mt-10 h-auto w-fit bg-transparent p-0 text-base font-semibold uppercase tracking-[0.14em] text-[#2f6bff] shadow-none hover:bg-transparent hover:text-[#5d8cff]"
                            >
                                Find Match
                                <Video className="size-5" />
                            </Button>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
};

export default Page;
