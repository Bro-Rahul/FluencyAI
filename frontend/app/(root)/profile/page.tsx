import ProfileCard from '@/components/profile/ProfileCard'
import TimeLineGrid from '@/components/profile/TimeLineGrid'

const ProfilePage = () => {
    return (
        <div className="flex flex-col gap-8 w-full container mx-auto max-w-300 mt-5">
            <ProfileCard />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Total Time</span>
                    <p className="text-2xl font-bold text-white">14h 20m</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Sessions</span>
                    <p className="text-2xl font-bold text-white">42</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Avg. Score</span>
                    <p className="text-2xl font-bold text-white">82%</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Vocabulary</span>
                    <p className="text-2xl font-bold text-white">450+</p>
                </div>
            </div>

            <TimeLineGrid />
            <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-base">Current Focus</h3>
                    <button className="text-[#135bec] text-xs font-bold hover:text-[#3b82f6]">Edit Goals</button>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">Weekly Speaking Time</span>
                            <span className="text-white font-bold">45 / 60 min</span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#22c55e] w-[75%] rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">Sessions Completed</span>
                            <span className="text-white font-bold">3 / 5</span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#eab308] w-[60%] rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">New Words Learned</span>
                            <span className="text-white font-bold">12 / 20</span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#135bec] w-[60%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage