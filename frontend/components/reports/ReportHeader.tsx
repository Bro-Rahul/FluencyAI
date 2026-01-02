import { formateDateTime } from "@/utils/helper"
import { Button } from "../ui/button"
import Link from "next/link"

interface ReportHeaderProps {
    sessionId: number
    datetimeString: string
}

const ReportHeader = ({ datetimeString, sessionId }: ReportHeaderProps) => {
    const { formattedDate, formattedTime } = formateDateTime(datetimeString)
    return (
        <div className="flex flex-wrap justify-between items-end gap-3 p-4">
            <div className="flex flex-col gap-1">
                <p className="text-white text-[32px] font-bold">Session Report</p>
                <p className="text-[#9da6b9] text-sm font-medium">
                    {formattedDate} {formattedTime} • Practice Session #{sessionId}
                </p>
            </div>

            <Link href={'/practice'}>
                <Button className="flex items-center gap-2 bg-[#135bec] hover:bg-[#1d64f2] text-white px-4 py-2 rounded-lg text-sm font-bold">
                    New Session →
                </Button>
            </Link>
        </div>
    )
}

export default ReportHeader;