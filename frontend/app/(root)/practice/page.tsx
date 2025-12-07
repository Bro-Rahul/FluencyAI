import { Play, SkipBack, SkipForward } from "lucide-react";

const PracticePage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
            <div className="max-w-4xl mx-auto text-center">

                {/* Title Section */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Practice Session</h1>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                    Start practicing your spoken English by clicking the record button.
                    Your speech will be transcribed in real-time. Review your recording
                    and receive AI feedback after you finish. Alternatively, upload a
                    pre-recorded audio file for analysis.
                </p>

                {/* Image */}
                <div className="flex justify-center">
                    <div className="rounded-xl overflow-hidden shadow-xl bg-white p-3 mb-6">
                        <img
                            src="https://images.unsplash.com/photo-1616627986691-4d193584af52?q=80&w=500"
                            alt="practice session"
                            className="rounded-lg w-48 h-48 object-cover"
                        />
                    </div>
                </div>

                {/* Title under image */}
                <h2 className="text-xl font-semibold">Practice Session</h2>
                <p className="text-gray-400 mb-8">LinguaSpeak</p>

                {/* Audio Controls */}
                <div className="flex items-center justify-center gap-6 mb-10">
                    <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
                        <SkipBack size={22} />
                    </button>

                    <button className="p-4 bg-blue-600 hover:bg-blue-500 rounded-full shadow-md">
                        <Play size={24} fill="white" stroke="white" />
                    </button>

                    <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
                        <SkipForward size={22} />
                    </button>
                </div>

                {/* Transcription Box */}
                <textarea
                    placeholder="Your speech will appear here..."
                    className="w-full h-32 bg-[#161B22] border border-gray-700 rounded-lg p-4 mb-8 text-gray-300 resize-none"
                ></textarea>

                {/* Timer */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {["Hours", "Minutes", "Seconds"].map((label) => (
                        <div
                            key={label}
                            className="bg-[#161B22] rounded-lg py-4 flex flex-col items-center border border-gray-700"
                        >
                            <p className="text-2xl font-bold">00</p>
                            <span className="text-gray-400 text-sm">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md">
                        Record
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md">
                        Upload File
                    </button>
                </div>

                {/* Footer */}
                <footer className="text-gray-500 text-sm flex flex-col items-center gap-2 mt-16">
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Contact Us</a>
                    </div>

                    <p className="text-gray-600 mt-6">
                        © 2024 LinguaSpeak. All rights reserved.
                    </p>
                </footer>

            </div>
        </div>
    );
};

export default PracticePage;
