import { useEffect, useRef, useState } from 'react'
import { getUserHeatMap } from '@/https/users/users'
import { UserHeatMapType } from '@/types/users'

const useFetchHeatMap = (
    yearToFetch: number,
    accessToken: string | undefined
) => {
    const [heatMapData, setHeatMapData] = useState<UserHeatMapType[] | null>(null)
    const mapperRef = useRef<Map<string, number>>(new Map())
    const totalSession = useRef<number>(0);

    useEffect(() => {
        if (!accessToken) return

        async function fetchHeatMap() {
            const response = await getUserHeatMap(accessToken!, yearToFetch)
            console.log(response);

            setHeatMapData(response)
            mapperRef.current.clear()
            totalSession.current = 0;

            for (const item of response) {
                totalSession.current += item.total;
                mapperRef.current.set(item.date, item.total)
            }
        }

        fetchHeatMap()
    }, [accessToken, yearToFetch])

    return {
        mapperRef,
        heatMapData,
        totalSession,
    }
}

export default useFetchHeatMap
