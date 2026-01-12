import { options } from "@/app/api/auth/[...nextauth]/options"
import { getUserHeatMap } from "@/https/users/users"
import dayjs from "dayjs"
import { getServerSession } from "next-auth"
import clsx from "clsx"

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

function getDaysOfYear(year: number) {
    const start = dayjs(`${year}-01-01`)
    const end = dayjs(`${year}-12-31`)
    const days = []

    let current = start
    while (current.isBefore(end) || current.isSame(end)) {
        days.push(current.format("YYYY-MM-DD").toString())
        current = current.add(1, "day")
    }
    return days
}

const TimeLineGrid = async () => {
    const year = 2025
    const days = getDaysOfYear(year)
    const session = await getServerSession(options);
    const response = await getUserHeatMap(session!.user.access_token);
    const map = new Map(
        response.map(item => [item.date, item.total])
    );

    return (
        <div className="bg-[#1c1f27] w-full rounded-xl">
            <MetaDetails />
            <div className="overflow-x-auto p-4">
                <div className="ml-10 mb-2 grid grid-flow-col auto-cols-[91px] text-xs text-[#9da6b9]">
                    {MONTHS.map(m => (
                        <span key={m} className="text-lg">{m}</span>
                    ))}
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 text-xs text-[#9da6b9]">
                        {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                            <span key={i} className="h-3.5 text-md">{d}</span>
                        ))}
                    </div>
                    <div
                        className="grid grid-rows-7 grid-flow-col auto-cols-max gap-1.5 pb-2"
                    >
                        {days.map((day, i) => (
                            <ContributionCell
                                key={i}
                                date={day}
                                total={map.get(day) !== undefined ? map.get(day)! : 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeLineGrid;

const ContributionCell = ({ date, total }: { date: string, total: number }) => {
    const index = Math.min(total, 4);
    return (
        <div
            title={`Total ${total} sessions on ${date}`}
            className={clsx(
                'w-3.75 h-3.75 rounded-sm',
                `color-${index}`
            )}
        />
    )
}

const MetaDetails = () => {
    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h3 className="text-white font-bold text-lg">
                        Practice Activity
                    </h3>
                    <p className="text-[#9da6b9] text-sm">
                        342 contributions in the last year
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#9da6b9]">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="size-3 rounded-sm bg-[#282e39]" />
                            <div className="size-3 rounded-sm bg-[#3b82f6]" />
                            <div className="size-3 rounded-sm bg-[#2563eb]" />
                            <div className="size-3 rounded-sm bg-[#2563eb]" />
                            <div className="size-3 rounded-sm bg-[#1e40af]" />
                        </div>
                        <span>More</span>
                    </div>

                    <select className="bg-[#282e39] text-white text-sm rounded-lg py-1.5 px-3 outline-none">
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                </div>
            </div>
        </div>
    )
}