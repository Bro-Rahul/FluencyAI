import svg from '@/constants/svgs'
import Image from 'next/image'
import images from '@/constants/images'
import { UserType } from '@/types/users'
import { UserProfileSummaryType } from '@/types/session'
import { formatMonthYear } from '@/utils/helper'

interface ProfileCardProps {
    user: UserType
    avgScore: number,
    summary: UserProfileSummaryType
}

const getProfileLevel = (score: number) => {
    if (score >= 80) return "Advanced"
    if (score >= 50) return "Intermediate"
    if (score >= 20) return "Developing"
    return "Beginner"
}

const ProfileCard = ({ user, summary, avgScore }: ProfileCardProps) => {
    const avatar = user.avatar?.trim()
    const joinedOn = formatMonthYear(user.created_at)
    const lastPracticedOn = summary.last_session_at
        ? new Date(summary.last_session_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "No sessions yet"

    return (
        <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#1c1f27] p-8 rounded-2xl border border-[#282e39]">
            <div className="flex items-center gap-6">
                <div className="relative">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={user.username}
                            width={100}
                            height={100}
                            className='rounded-full border border-white p-0.5 object-cover'
                        />
                    ) : (
                        <Image
                            src={images.pandaImage}
                            alt='profile'
                            width={100}
                            height={100}
                            priority
                            className='rounded-full border border-white p-0.5'
                        />
                    )}
                    <div
                        className="absolute bottom-0 right-0 bg-[#135bec] p-1 rounded-full border-2 border-[#1c1f27]">
                        <Image src={svg.cameraSVG} alt='Profile Icon' />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-[#9da6b9] text-sm">
                        <span className="flex items-center gap-1">
                            {user.email} </span>
                        <span className="size-1 bg-[#3b4354] rounded-full"></span>
                        <span>Joined {joinedOn}</span>
                        <span className="size-1 bg-[#3b4354] rounded-full"></span>
                        <span>Last practice {lastPracticedOn}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span
                            className="px-2 py-0.5 rounded bg-[#282e39] border border-[#3b4354] text-xs font-bold text-white uppercase tracking-wide">
                            {getProfileLevel(avgScore * 10)} Level
                        </span>
                        <span
                            className="px-2 py-0.5 rounded bg-[#282e39] border border-[#3b4354] text-xs font-bold text-[#135bec] uppercase tracking-wide">
                            Score {avgScore.toFixed(1)}
                        </span>
                        <span
                            className="px-2 py-0.5 rounded bg-[#282e39] border border-[#3b4354] text-xs font-bold text-[#22c55e] uppercase tracking-wide">
                            {summary.practice_days} Practice Days
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-auto min-w-40 rounded-xl border border-[#282e39] px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-orange-500/10">
                        <Image src={svg.streakSVG} alt='streak icon' />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#9da6b9]">Max Streak</span>
                        <span className="text-2xl font-bold text-white">{summary.streak} Days</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard
