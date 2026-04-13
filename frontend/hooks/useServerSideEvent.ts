import { useEffect, useRef, useState } from 'react'
import { baseURL } from '@/https';
import { SessionRecordsType } from '@/types/session';

const useServerSideEvent = (accessToken: string) => {
    const [sessionsData, setSessions] = useState<SessionRecordsType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const eventSource = useRef<boolean>(false);

    useEffect(() => {
        if (eventSource.current) return;
        eventSource.current = true
        setSessions([])
        setIsLoading(true)
        const event = new EventSource(`${baseURL}/sessions/?token=${accessToken}`)
        event.onmessage = (e) => {
            setSessions(JSON.parse(e.data))
            setIsLoading(false)
        }

        event.addEventListener("close", () => {
            setIsLoading(false)
            event.close();
        });

        event.onerror = () => {
            setIsLoading(false)
            event.close()
        }

        return () => {
            event.close()
            eventSource.current = false
        }
    }, [accessToken]);

    return {
        sessionsData,
        isLoading
    }
}

export default useServerSideEvent
