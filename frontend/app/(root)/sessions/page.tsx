import { options } from "@/app/api/auth/[...nextauth]/options"
import SessionCard from "@/components/sessions/SessionCard"
import svg from "@/constants/svgs"
import { getSessionRecords } from "@/https/sessions/sessionRecord"
import { getServerSession } from "next-auth/next"
import Image from "next/image"

const SessionsPage = async () => {
    const session = await getServerSession(options)

    const sessionRecords = await getSessionRecords(session?.user.access_token!)

    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-240 flex-1">
                <div className="flex flex-wrap justify-between items-end gap-3 p-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-white tracking-light text-[32px] font-bold leading-tight">Session History
                        </p>
                        <p className="text-[#9da6b9] text-sm font-medium">Review your past sessions and track your
                            improvement over time.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-[#135bec] hover:bg-[#1d64f2] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        <span>New Session</span>
                        <Image priority src={svg.addSVG} alt="add session icon" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-8 mt-2">
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#135bec]">
                            <Image priority src={svg.alarmSVG} alt="streak icon " />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Total Sessions</p>
                            <p className="text-2xl font-bold text-white">42</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#22c55e]">
                            <Image priority src={svg.trendingUpSVG} alt="trending Up icons" />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Average Score</p>
                            <p className="text-2xl font-bold text-white">78</p>
                        </div>
                    </div>
                    <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                        <div
                            className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-orange-500">
                            <Image priority src={svg.streakSVG} alt="streak icon " />
                        </div>
                        <div>
                            <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Current Streak</p>
                            <p className="text-2xl font-bold text-white">5 Days</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 px-4 mb-6">
                    <div
                        className="flex items-center gap-2 bg-[#1c1f27] border border-[#282e39] rounded-lg px-3 py-2 w-full md:w-auto md:min-w-[320px] focus-within:border-[#3b82f6] transition-colors">
                        <span className="material-symbols-outlined text-[#9da6b9]">search</span>
                        <input
                            className="bg-transparent border-none text-white placeholder-[#6b7280] text-sm focus:ring-0 w-full p-0"
                            placeholder="Search sessions by topic..." type="text" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[#9da6b9] text-sm font-medium">Sort by:</span>
                        <select
                            className="bg-[#1c1f27] border border-[#282e39] text-white text-sm rounded-lg focus:ring-[#135bec] focus:border-[#135bec] py-2 px-3">
                            <option>Newest First</option>
                            <option>Oldest First</option>
                            <option>Highest Score</option>
                            <option>Lowest Score</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-4 pb-12">
                    {sessionRecords.map((item, i) => <SessionCard session={item} key={i} />)}
                </div>
                <div className="flex justify-center items-center gap-4 border-t border-[#282e39] pt-6 mb-8">
                    <button
                        className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                        <Image priority src={svg.arrowForwardSVG} alt="arrow backword" className="rotate-180" />
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            className="size-8 flex items-center justify-center rounded-lg bg-[#135bec] text-white text-sm font-bold">1</button>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">2</button>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">3</button>
                        <span className="text-[#9da6b9]">...</span>
                        <button
                            className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">8</button>
                    </div>
                    <button
                        className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                        Next
                        <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SessionsPage