import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { getUserHeatMap } from '@/https/users/users'
import { UserHeatMapType } from '@/types/users'

const useFetchHeatMap = (
    accountCreatedDate: string,
    accessToken: string | undefined
) => {
    const [year, setYear] = useState(() => dayjs(accountCreatedDate).year())
    const [heatMapData, setHeatMapData] = useState<UserHeatMapType[] | null>(null)
    const mapperRef = useRef<Map<string, number>>(new Map())
    const totalSession = useRef<number>(0);

    useEffect(() => {
        if (!accessToken) return

        async function fetchHeatMap() {
            const response = await getUserHeatMap(accessToken!)

            setHeatMapData(response)
            mapperRef.current.clear()
            totalSession.current = 0;

            for (const item of response) {
                totalSession.current += item.total;
                mapperRef.current.set(item.date, item.total)
            }
        }

        fetchHeatMap()
    }, [year, accessToken])

    return {
        year,
        mapperRef,
        heatMapData,
        totalSession,
        setYear,
    }
}

export default useFetchHeatMap
