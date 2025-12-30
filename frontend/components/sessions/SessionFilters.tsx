import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


type FilterType = "Oldest" | "Newest" | "lowest_score" | "highest_score"


interface SessionFiltersProps {
    handleSetFilter: (filterBy: FilterType) => void
    filter: FilterType
}


const SessionFilters = ({ handleSetFilter, filter }: SessionFiltersProps) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 mb-6">
            <h1 className="text-shadow-neutral-300 text-xl">Sessions List</h1>
            <div className="flex items-center gap-3">
                <span className="text-[#9da6b9] text-sm font-medium">Sort by:</span>
                <Select value={filter} onValueChange={e => handleSetFilter(e as FilterType)}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder={filter} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Newest">Newest First</SelectItem>
                        <SelectItem value="Oldest">Oldest First</SelectItem>
                        <SelectItem value="lowest_score">Highest Score</SelectItem>
                        <SelectItem value="highest_score">Lowest Score</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default SessionFilters