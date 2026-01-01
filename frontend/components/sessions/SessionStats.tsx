import svg from '@/constants/svgs'
import { getUserStatistics } from '@/https/sessions/sessionRecord'
import Image from 'next/image'

interface SessionStatsProps {
    accessToken: string
}

const SessionStats = async ({ accessToken }: SessionStatsProps) => {

    const userStatistics = await getUserStatistics(accessToken);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-8 mt-2">
            <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                <div
                    className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#135bec]">
                    <Image priority src={svg.alarmSVG} alt="streak icon " />
                </div>
                <div>
                    <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Total Sessions</p>
                    <p className="text-2xl font-bold text-white">{userStatistics.total}</p>
                </div>
            </div>
            <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                <div
                    className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-[#22c55e]">
                    <Image priority src={svg.trendingUpSVG} alt="trending Up icons" />
                </div>
                <div>
                    <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Average Score</p>
                    <p className="text-2xl font-bold text-white">{userStatistics.avg.toFixed(2)}</p>
                </div>
            </div>
            <div className="bg-[#1c1f27] p-5 rounded-xl border border-[#282e39] flex items-center gap-4">
                <div
                    className="size-12 rounded-full bg-[#282e39] flex items-center justify-center text-orange-500">
                    <Image priority src={svg.streakSVG} alt="streak icon " />
                </div>
                <div>
                    <p className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Max Streak</p>
                    <p className="text-2xl font-bold text-white">{userStatistics.streak} Days</p>
                </div>
            </div>
        </div>
    )
}

export default SessionStats