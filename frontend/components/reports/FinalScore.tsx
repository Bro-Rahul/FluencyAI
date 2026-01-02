import { SessionReport, TranscriptionSchema } from '@/types/sessionReport'
import SpeechScoreMatrix from './SpeechScoreMatrix'
import StatCard from './StatCard'
import svg from '@/constants/svgs'
import Image from 'next/image'
import { formatDuration } from '@/utils/helper'

interface FinalScoreProps {
    report: SessionReport,
    transcriptions: TranscriptionSchema[]
    duration: number
}

const FinalScore = ({ report, transcriptions, duration }: FinalScoreProps) => {
    return (
        <div className='flex flex-col gap-5'>
            <SpeechScoreMatrix
                score={report.score * 10}
                description={report.description}
                performanceMetrix={report.key_metrics}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard label="Duration" value={`${formatDuration(duration)}s`} icon={svg.alarmSVG} />
                <StatCard label="Avg Pace" value={`${report.avg_pace}`} icon={svg.pacingSVG} />
                <StatCard label="Fillers" value={`${report.filler.total_count}`} icon={svg.graphicSVG} />
                <StatCard label="Streak" value="5 Days" icon={svg.streakSVG} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] overflow-hidden flex flex-col">
                    <div
                        className="p-4 border-b border-[#282e39] flex justify-between items-center bg-[#222731]">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Image src={svg.glowingLightbulbSVG} priority alt='Improment ' />
                            Improvement Suggestions
                        </h3>
                        <span
                            className="text-xs bg-[#282e39] text-[#9da6b9] px-2 py-1 rounded border border-[#3b4354]">3
                            found</span>
                    </div>
                    <div className="flex flex-col divide-y divide-[#282e39]">
                        <div className="p-4 flex gap-4 hover:bg-[#222731] transition-colors cursor-pointer">
                            <div className="mt-1">
                                <div className="size-2 rounded-full bg-red-500"></div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-red-400 uppercase">Grammar</span>
                                <p className="text-[#9da6b9] text-sm line-through decoration-red-500/50">"I have
                                    went to the store yesterday"</p>
                                <p className="text-white text-sm font-medium">"I <span
                                    className="text-[#22c55e]">went</span> to the store yesterday"</p>
                                <p className="text-[#6b7280] text-xs mt-1">Use simple past tense for completed
                                    actions in the past.</p>
                            </div>
                        </div>
                        <div className="p-4 flex gap-4 hover:bg-[#222731] transition-colors cursor-pointer">
                            <div className="mt-1">
                                <div className="size-2 rounded-full bg-yellow-500"></div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-yellow-400 uppercase">Vocabulary</span>
                                <p className="text-[#9da6b9] text-sm">"It was a <span
                                    className="underline decoration-yellow-500/50">good</span> experience"
                                </p>
                                <p className="text-white text-sm font-medium">Consider: "It was a <span
                                    className="text-[#22c55e]">rewarding</span> experience"</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t border-[#282e39] text-center">
                        <button className="text-[#135bec] text-sm font-bold hover:text-[#3b82f6]">View All
                            Suggestions</button>
                    </div>
                </div>
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] flex flex-col">
                    <div className="p-4 border-b border-[#282e39] bg-[#222731]">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Image src={svg.subtitlesSVG} alt='Transcript' />
                            Transcript Snippet
                        </h3>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto max-h-75 scrollbar">
                        {transcriptions.map((item, idx) =>
                            <div className="flex gap-4 mb-4" key={idx}>
                                <div className="text-xs text-[#6b7280] font-mono mt-1 min-w-10">{item.start}:{item.end}</div>
                                <p className="text-[#d1d5db] text-sm leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-[#282e39] text-center">
                        <button className="text-[#135bec] text-sm font-bold hover:text-[#3b82f6]">Full
                            Transcript Analysis</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinalScore