import svg from '@/constants/svgs'
import Image from 'next/image'
import Link from 'next/link'
import { formateDateTime, formateDuration } from '@/utils/helper'
import { SessionRecordsType } from '@/types/session'
import { Skeleton } from '../ui/skeleton'

interface SessionCardProps {
    session: SessionRecordsType
}

const SessionCard = ({ session }: SessionCardProps) => {
    const { formattedDate, formattedTime } = formateDateTime(session.created_at);
    if (session.status === "pending") {
        // loading
    } else {
        // data
    }
    return (
        <Link className="group block relative" href={session.status !== "pending" ? `/sessions/${session.id}` : "#"}>
            <div
                className="bg-[#1c1f27] hover:bg-[#222731] rounded-xl p-5 border border-[#282e39] group-hover:border-[#3b82f6] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4 flex-1">
                    <div
                        className="size-12 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 mt-1 md:mt-0">
                        <Image priority src={svg.micSVG} alt="microphone icons" />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3
                                className="text-white font-bold text-lg group-hover:text-[#3b82f6] transition-colors">
                                {session.title ? session.title : `Practice Session #${session.id}`}</h3>
                            <span
                                className="bg-[#282e39] text-[#9da6b9] text-xs px-2 py-0.5 rounded border border-[#3b4354]">Photography
                            </span>
                        </div>
                        {session.status === "pending" ?
                            <Skeleton className='w-full h-5 bg-[#2f3544]' /> :
                            <p className="text-[#9da6b9] text-sm line-clamp-1">
                                {session.description ? session.description : "Talk about my favorite hobby,photography, and why I started..."}
                            </p>
                        }
                        <div className="flex items-center gap-3 text-xs text-[#6b7280] font-medium mt-1">
                            <span className="flex items-center gap-1">
                                <Image src={svg.calendarTodaySVG} alt="time and date icons" priority />
                                {formattedDate}</span>
                            <span className="flex items-center gap-1">
                                <Image src={svg.alarmSVG} alt='time' width={15} height={15} />{formattedTime}</span>
                            <span className="w-1 h-1 rounded-full bg-[#6b7280]"></span>
                            <span>{formateDuration(session.duration)}s</span>
                        </div>
                    </div>
                </div>
                <div
                    className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#282e39] pt-4 md:pt-0 pl-0 md:pl-6 md:border-l md:border-[#282e39]">
                    {session.status === "pending" ?
                        <div className="flex flex-col md:items-end">
                            <span
                                className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                            <span
                                className="text-lg font-bold text-[#9da6b9] tracking-wider mb-0.5 animate-pulse">Pending</span>

                        </div> :
                        <>
                            <div className="flex flex-col items-start md:items-end">
                                <span
                                    className="text-xs font-bold text-[#9da6b9] uppercase tracking-wider mb-0.5">Score</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-black text-white">{session.score ?? 1}</span>
                                    <span
                                        className="text-xs font-bold text-[#135bec] bg-[#135bec]/10 px-2 py-1 rounded">Excellent</span>
                                </div>
                            </div>
                            <div
                                className="size-8 rounded-full bg-[#282e39] group-hover:bg-[#135bec] flex items-center justify-center text-[#9da6b9] group-hover:text-white transition-colors">
                                <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
                            </div>

                        </>
                    }
                </div>
            </div>
        </Link>
    )
}

export default SessionCard