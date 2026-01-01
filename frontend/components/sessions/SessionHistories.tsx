"use client"
import useServerSideEvent from "@/hooks/useServerSideEvent"
import SessionFilters from "./SessionFilters"
import SessionLists from "./SessionLists"
import SessionPagination from "./SessionPagination"
import useSessionFilter from "@/hooks/useSessionFilter"
import { useState } from "react"
import { FilterType } from "@/types/session"



interface SessionHistoriesProps {
    accessToken: string
}
const SessionHistories = ({ accessToken }: SessionHistoriesProps) => {
    const { sessionsData } = useServerSideEvent(accessToken);
    const [filterBy, setFilterBy] = useState<FilterType>("Newest");
    const { filterSessions } = useSessionFilter(sessionsData, filterBy);
    return (
        <div className="flex flex-col w-full">
            <SessionFilters
                filter={filterBy}
                handleSetFilter={(filter) => setFilterBy(filter)}
            />
            <SessionLists
                sessions={filterSessions}
            />
            <SessionPagination />
        </div>
    )
}

export default SessionHistories