import { MONTHS, DAYSOFWEEK } from '@/constants/data'
import { getDaysOfYear } from '@/utils/helper';
import ContributionCell from './ContributionCell';


const Grid = ({ year, heatMapData }: { year: number, heatMapData: Map<string, number> }) => {
    const days = getDaysOfYear(year);

    return (
        <div className="overflow-x-auto p-4">
            <div className="ml-10 mb-2 grid grid-flow-col auto-cols-[91px] text-xs text-[#9da6b9]">
                {MONTHS.map(m => (
                    <span key={m} className="text-lg">{m}</span>
                ))}
            </div>

            <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 text-xs text-[#9da6b9]">
                    {DAYSOFWEEK.map((d, i) => (
                        <span key={i} className="h-3.5 text-md">{d}</span>
                    ))}
                </div>
                <div
                    className="grid grid-rows-7 grid-flow-col auto-cols-max gap-1.5 pb-2"
                >
                    {days.map((day, i) => (
                        <ContributionCell
                            key={i}
                            date={day}
                            total={heatMapData.get(day) !== undefined ? heatMapData.get(day)! : 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Grid