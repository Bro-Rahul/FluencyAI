import SessionHistories from "@/components/sessions/SessionHistories"
import SessionStats from "@/components/sessions/SessionStats"
import svg from "@/constants/svgs"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"

const SessionsPage = async () => {
    const session = await getServerSession(options)

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
                <SessionStats />
                <SessionHistories accessToken={session?.user.access_token!} />
            </div>
        </div>
    )
}

export default SessionsPage