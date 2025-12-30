import { useEffect, useRef, useState } from 'react'
import { baseURL } from '@/https';
import { SessionRecordsType } from '@/types/session';

const useServerSideEvent = (accessToken: string) => {
    const [sessionsData, setSessions] = useState<SessionRecordsType[]>([]);
    const eventSource = useRef<boolean>(false);
    useEffect(() => {
        if (eventSource.current) return;
        eventSource.current = true
        const event = new EventSource(`${baseURL}/sessions/?token=${accessToken}`, {
            withCredentials: true
        })
        event.onmessage = (e) => {
            setSessions(pre => JSON.parse(e.data))
        }

        event.addEventListener("close", () => {
            event.close();
        });

        return () => {
            event.close()
            eventSource.current = false
        }
    }, []);

    return {
        sessionsData
    }
}

export default useServerSideEvent