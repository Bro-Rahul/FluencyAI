import { SessionRecordsType, FilterType } from '@/types/session';
import { FilterStrategy } from '@/utils/sessionFilter';
import { useEffect, useState } from 'react'



const useSessionFilter = (sessionData: SessionRecordsType[], filter: FilterType) => {
    const [filterSessions, setFilterSessions] = useState<SessionRecordsType[]>([]);
    const filterBy = new FilterStrategy(sessionData);

    useEffect(() => {
        filterBy.setFilter(filter)
        const data = filterBy.applyFilter()
        setFilterSessions(pre => data)
    }, [filter, sessionData])

    return {
        filterSessions
    }
}


export default useSessionFilter