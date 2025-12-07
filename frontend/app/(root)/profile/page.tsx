import Image from "next/image";

const ProfileRightPanel = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white px-6 md:px-12 py-10">
            <div className="max-w-4xl mx-auto">

                {/* Title */}
                <h1 className="text-3xl font-bold mb-8">Profile</h1>

                {/* User Info */}
                <div className="flex items-center gap-6 mb-12">
                    {/* <Image
                        src=""
                        alt="user"
                        width={90}
                        height={90}
                        className="rounded-full"
                    /> */}
                    <div>
                        <h2 className="text-xl font-semibold">Olivia Bennett</h2>
                        <p className="text-gray-400 text-sm">Joined in 2022</p>
                    </div>
                </div>

                {/* PERSONAL INFORMATION */}
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

                <div className="space-y-5 mb-8">
                    <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-[#161B22] mt-1 p-3 rounded-md border border-gray-700 text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            className="w-full bg-[#161B22] mt-1 p-3 rounded-md border border-gray-700 text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[#161B22] mt-1 p-3 rounded-md border border-gray-700 text-gray-300"
                        />
                    </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md mb-12">
                    Update Profile
                </button>

                {/* LEARNING GOALS */}
                <h3 className="text-lg font-semibold mb-4">Learning Goals</h3>

                <div className="space-y-4 mb-6">
                    <label className="text-sm text-gray-400">Daily Practice Goal</label>
                    <select className="w-full bg-[#161B22] p-3 rounded-md border border-gray-700 text-gray-300">
                        <option>10 minutes</option>
                        <option>20 minutes</option>
                        <option>30 minutes</option>
                    </select>
                </div>

                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md mb-14">
                    Update Goals
                </button>

                {/* PROGRESS */}
                <h3 className="text-lg font-semibold mb-4">Progress</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                    <div className="bg-[#161B22] p-5 rounded-lg border border-gray-800">
                        <p className="text-gray-400 text-sm">Practice Streak</p>
                        <h2 className="text-3xl font-bold mt-1">7 days</h2>
                    </div>

                    <div className="bg-[#161B22] p-5 rounded-lg border border-gray-800">
                        <p className="text-gray-400 text-sm">Total Practice Time</p>
                        <h2 className="text-3xl font-bold mt-1">2 hours 30 minutes</h2>
                    </div>
                </div>

                {/* FEEDBACK HISTORY */}
                <h3 className="text-lg font-semibold mb-4">Feedback History</h3>

                <div className="overflow-x-auto">
                    <table className="w-full bg-[#161B22] rounded-lg border border-gray-800 text-left">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 text-sm">
                                <th className="p-4">Date</th>
                                <th className="p-4">Topic</th>
                                <th className="p-4">Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {[
                                { date: "2024-07-20", topic: "Describing a vacation", score: 85 },
                                { date: "2024-07-15", topic: "Ordering food at a restaurant", score: 78 },
                                { date: "2024-07-10", topic: "Introducing yourself", score: 92 },
                                { date: "2024-07-05", topic: "Asking for directions", score: 88 },
                                { date: "2024-07-01", topic: "Talking about hobbies", score: 80 },
                            ].map((item, i) => (
                                <tr key={i} className="border-b border-gray-700">
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">{item.topic}</td>
                                    <td className="p-4">{item.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default ProfileRightPanel;
