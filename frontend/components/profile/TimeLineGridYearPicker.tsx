import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import dayjs from "dayjs"

interface TimeLineGridYearPickerProps {
    year: number,
    selectYear: (selectedYear: number) => void
    createdYear: number,
    totalSessions: number
}

const TimeLineGridYearPicker = ({ year, createdYear, totalSessions, selectYear }: TimeLineGridYearPickerProps) => {
    const years = Array.from({ length: dayjs().year() - createdYear + 1 }, (_, idx) => createdYear + idx);
    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h3 className="text-white font-bold text-lg">
                        Practice Activity
                    </h3>
                    <p className="text-[#9da6b9] text-sm">
                        {totalSessions} contributions in the last year
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-[#9da6b9]">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="size-3 rounded-sm color-0" />
                            <div className="size-3 rounded-sm color-1" />
                            <div className="size-3 rounded-sm color-2" />
                            <div className="size-3 rounded-sm color-3" />
                            <div className="size-3 rounded-sm color-4" />
                        </div>
                        <span>More</span>
                    </div>

                    <Select value={year.toString()} onValueChange={e => selectYear(+e)}>
                        <SelectTrigger className="w-45">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Year</SelectLabel>
                                {years.map((item) => (
                                    <SelectItem
                                        key={item}
                                        value={item.toString()}
                                    >
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
            </div>
        </div>
    )
}

export default TimeLineGridYearPicker