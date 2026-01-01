import { FilterType, SessionRecordsType } from "@/types/session"

export interface BaseFilter {
    filterSessions: (sessions: SessionRecordsType[]) => SessionRecordsType[]
}

class FilterByNewSession implements BaseFilter {
    filterSessions(sessions: SessionRecordsType[]) {
        return [...sessions].sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
}

class FilterByOldSession implements BaseFilter {
    filterSessions(sessions: SessionRecordsType[]) {
        return [...sessions].sort((a, b) => a.created_at.localeCompare(b.created_at))
    }
}


class FilterByHighestScoreSession implements BaseFilter {
    filterSessions(sessions: SessionRecordsType[]) {
        return [...sessions].sort((a, b) => +a.score! - +b.score!)
    }
}

class FilterByLowestScoreSession implements BaseFilter {
    filterSessions(sessions: SessionRecordsType[]) {
        return [...sessions].sort((a, b) => +b.score! - +a.score!)
    }
}


export class FilterStrategy {
    filter: BaseFilter;
    sessionRecords: SessionRecordsType[];

    constructor(sesstionRecords: SessionRecordsType[]) {
        this.filter = new FilterByNewSession()
        this.sessionRecords = sesstionRecords
    }

    setFilter(filterBy: FilterType) {
        switch (filterBy) {
            case 'Oldest':
                this.filter = new FilterByOldSession()
                break;
            case 'Newest':
                this.filter = new FilterByNewSession()
                break;
            case 'lowest_score':
                this.filter = new FilterByLowestScoreSession()
                break;
            case 'highest_score':
                this.filter = new FilterByHighestScoreSession()
                break;
        }
    }

    applyFilter() {
        return this.filter.filterSessions(this.sessionRecords)
    }
}