import dayjs from "dayjs"

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
        days.push(current)
        current = current.add(1, "day")
    }

    return days
}

export default function TimeLineGrid() {
    const year = 2026
    const days = getDaysOfYear(year)

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
                            <ContributionCell key={i} date={day} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}


const ContributionCell = ({ date }: { date: dayjs.Dayjs }) => {
    const level = Math.floor(Math.random() * 5)

    const COLORS = [
        "bg-[#282e39]",
        "bg-[#0e3a96]",
        "bg-[#135bec]",
        "bg-[#4f85f6]",
        "bg-[#92bbfd]",
    ]

    return (
        <div
            title={date.format("DD MMM YYYY")}
            className={`
        w-3.75 h-3.75
        rounded-sm
        ${COLORS[level]}
      `}
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
                            <div className="size-3 rounded-sm bg-[#0e3a96]" />
                            <div className="size-3 rounded-sm bg-[#135bec]" />
                            <div className="size-3 rounded-sm bg-[#4f85f6]" />
                            <div className="size-3 rounded-sm bg-[#92bbfd]" />
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
