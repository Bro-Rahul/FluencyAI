import { options } from '@/app/api/auth/[...nextauth]/options'
import ProfileCard from '@/components/profile/ProfileCard'
import TimeLineGrid from '@/components/profile/TimeLineGrid'
import { getUserProfileSummary } from '@/https/sessions/sessionRecord'
import { formatDurationCompact } from '@/utils/helper'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const getWeeklyInsight = (weeklyDuration: number) => {
    if (weeklyDuration >= 3600) return "Strong consistency this week. You have already crossed one hour of speaking practice."
    if (weeklyDuration >= 900) return "Good momentum this week. A couple more sessions will turn this into a strong streak."
    return "This week is still light. One short speaking session today would help build momentum again."
}

const getSessionInsight = (monthlySessions: number) => {
    if (monthlySessions >= 12) return "You are practicing frequently this month, which is great for long-term fluency gains."
    if (monthlySessions >= 5) return "Your monthly session count is moving in the right direction. Keep the gap between sessions small."
    return "Practice volume is still low this month. Try aiming for shorter, more regular sessions."
}

const getScoreInsight = (avg: number, best: number) => {
    if (avg >= 85) return `Your average performance is strong, and your best score of ${best.toFixed(1)}% shows high upside.`
    if (avg >= 70) return `You are building steady results. Your best score of ${best.toFixed(1)}% suggests you can push your average even higher.`
    return `Your best score has reached ${best.toFixed(1)}%, so the foundation is there. More repetition should help stabilize results.`
}

const ProfilePage = async () => {
    const session = await getServerSession(options);
    if (!session) return redirect("/auth/login");

    const profileSummary = await getUserProfileSummary(session.user.access_token)
    const weeklyInsight = getWeeklyInsight(profileSummary.weekly_duration)
    const sessionInsight = getSessionInsight(profileSummary.monthly_sessions)
    const scoreInsight = getScoreInsight(profileSummary.avg, profileSummary.best_score)

    return (
        <div className="flex flex-col gap-8 w-full container mx-auto max-w-300 mt-5">
            <ProfileCard user={session.user} summary={profileSummary} avgScore={profileSummary.avg} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Total Time</span>
                    <p className="text-2xl font-bold text-white">{formatDurationCompact(profileSummary.total_duration)}</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Sessions</span>
                    <p className="text-2xl font-bold text-white">{profileSummary.total}</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Avg. Score</span>
                    <p className="text-2xl font-bold text-white">{profileSummary.avg.toFixed(1)}%</p>
                </div>
                <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39] flex flex-col gap-1">
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wider">Best Score</span>
                    <p className="text-2xl font-bold text-white">{profileSummary.best_score.toFixed(1)}%</p>
                </div>
            </div>

            <TimeLineGrid
                profileCreated={session.user.created_at}
            />
            <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-base">Practice Insights</h3>
                    <span className="text-[#9da6b9] text-xs font-bold uppercase tracking-wide">
                        Synced with your sessions
                    </span>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">This Week Speaking Time </span>
                            <span className="text-white font-bold">
                                {formatDurationCompact(profileSummary.weekly_duration)}
                                {" / "}
                                {formatDurationCompact(profileSummary.total_duration || 1)}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${profileSummary.weekly_duration_share}%` }}></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">Sessions This Month</span>
                            <span className="text-white font-bold">{profileSummary.monthly_sessions} / {profileSummary.total}</span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#eab308] rounded-full" style={{ width: `${profileSummary.monthly_sessions_share}%` }}></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#d1d5db]">Active Days This Month</span>
                            <span className="text-white font-bold">{profileSummary.monthly_active_days} / {profileSummary.monthly_elapsed_days}</span>
                        </div>
                        <div className="h-2 w-full bg-[#282e39] rounded-full overflow-hidden">
                            <div className="h-full bg-[#135bec] rounded-full" style={{ width: `${profileSummary.monthly_active_days_share}%` }}></div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-[#282e39] bg-[#151922] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Weekly Insight</p>
                            <p className="mt-2 text-sm leading-6 text-[#d1d5db]">{weeklyInsight}</p>
                        </div>
                        <div className="rounded-xl border border-[#282e39] bg-[#151922] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#eab308]">Session Insight</p>
                            <p className="mt-2 text-sm leading-6 text-[#d1d5db]">{sessionInsight}</p>
                        </div>
                        <div className="rounded-xl border border-[#282e39] bg-[#151922] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6]">Score Insight</p>
                            <p className="mt-2 text-sm leading-6 text-[#d1d5db]">{scoreInsight}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
