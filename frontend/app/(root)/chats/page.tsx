"use client";

import { Button } from "@/components/ui/button";
import useAudioVideoPermission from "@/hooks/useAudioVideoPermission";
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
        <div className="min-h-screen bg-[#1c1f27] font-sans text-white">
            <main className="mx-auto max-w-6xl px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold">Choose Your Journey</h1>
                    <p className="text-gray-400 mt-2">
                        Practice solo or connect with learners worldwide.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#101622] p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h2 className="text-2xl font-bold mb-3">AI Practice</h2>
                        <p className="text-gray-400 mb-6">
                            Practice without pressure. Get real-time corrections and feedback.
                        </p>

                        <Button
                            onClick={handleAiPractice}
                            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                        >
                            Begin AI Session
                        </Button>
                    </div>

                    <div className="bg-[#101622] p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h2 className="text-2xl font-bold mb-3">Global Match</h2>
                        <p className="text-gray-400 mb-6">
                            Talk with real people and improve through conversations.
                        </p>

                        <Button
                            onClick={handleRandomChat}
                            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                        >
                            Find Partner Match
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Page;
