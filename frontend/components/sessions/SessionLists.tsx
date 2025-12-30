import React from 'react'
import SessionCard from './SessionCard'
import { SessionRecordsType } from '@/types/session'
import { Skeleton } from '../ui/skeleton'

interface SessionListsProps {
    sessions: SessionRecordsType[]
}

const SessionLists = ({ sessions }: SessionListsProps) => {
    const tempList = [1, 2, 3, 4, 5];
    return (
        <div className="flex flex-col gap-4 px-4 pb-12">
            {sessions.length === 0
                ?
                tempList.map(item => <div key={item} className="flex flex-col space-y-3">
                    <Skeleton className="h-31 w-full rounded-xl bg-[#1c1f27]" />
                </div>)
                :
                sessions.map((item, i) => <SessionCard session={item} key={i} />)}
        </div>
    )
}

export default SessionLists