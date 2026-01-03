import { useEffect, useRef, useState } from 'react'
import { baseURL } from '@/https';
import { SessionRecordsType } from '@/types/session';

const useServerSideEvent = (accessToken: string) => {
    const [sessionsData, setSessions] = useState<SessionRecordsType[]>([]);
    const eventSource = useRef<boolean>(false);
    useEffect(() => {
        if (eventSource.current) return;
        eventSource.current = true
        const event = new EventSource(`${baseURL}/sessions/?token=${accessToken}`)
        event.onmessage = (e) => {
            syncSessionData(JSON.parse(e.data))
        }

        event.addEventListener("close", () => {
            event.close();
        });

        return () => {
            event.close()
            eventSource.current = false
        }
    }, []);

    const syncSessionData = (sessions: SessionRecordsType[]) => {
        setSessions(prev => {
            const map = new Map(prev.map(s => [s.id, s]));

            for (const s of sessions) {
                map.set(s.id, s);
            }

            return [...map.values()];
        });
    };


    return {
        sessionsData
    }
}

export default useServerSideEvent