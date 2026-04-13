import SessionCard from './SessionCard'
import { SessionRecordsType } from '@/types/session'
import { Skeleton } from '../ui/skeleton'
import { useState } from 'react'

interface SessionListsProps {
    sessions: SessionRecordsType[]
    isLoading: boolean
}

const ITEMS_PER_PAGE = 6;

const SessionLists = ({ sessions, isLoading }: SessionListsProps) => {
    const [page, setPage] = useState(1);
    const tempList = [1, 2, 3, 4, 5, 6];

    const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentSessions = sessions.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    return (
        <div className="px-4 pb-12 flex flex-col gap-4">

            {isLoading ? (
                tempList.map(item => (
                    <div key={item} className="flex flex-col space-y-3">
                        <Skeleton className="h-31 w-full rounded-xl bg-[#1c1f27]" />
                    </div>
                ))
            ) : sessions.length === 0 ? (
                <div className="rounded-xl border border-[#282e39] bg-[#1c1f27] px-6 py-12 text-center">
                    <p className="text-lg font-semibold text-white">No sessions yet</p>
                    <p className="mt-2 text-sm text-[#9da6b9]">
                        Start a new practice session and your history will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {currentSessions.map((session, index) => (
                        <SessionCard key={index} session={session} />
                    ))}

                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-white">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default SessionLists
