import { SessionReport, TranscriptionSchema } from '@/types/sessionReport'
import SpeechScoreMatrix from './SpeechScoreMatrix'
import StatCard from './StatCard'
import svg from '@/constants/svgs'
import Image from 'next/image'
import { formateDuration } from '@/utils/helper'
import { Fragment } from 'react'

interface FinalScoreProps {
    report: SessionReport,
    transcriptions: TranscriptionSchema[]
    duration: number
}

const formatTimestamp = (value: number) => {
    const totalSeconds = Math.max(0, Math.floor(value))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const highlightText = (text: string, target: string, className: string) => {
    if (!target.trim()) {
        return text
    }

    const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escapedTarget})`, 'gi'))

    return parts.map((part, idx) => {
        if (part.toLowerCase() === target.toLowerCase()) {
            return (
                <span key={idx} className={className}>
                    {part}
                </span>
            )
        }

        return <Fragment key={idx}>{part}</Fragment>
    })
}

const FinalScore = ({ report, transcriptions, duration }: FinalScoreProps) => {
    const totalSuggestions = report.grammar_corrections.length + report.vocabulary_enhancements.length

    return (
        <div className='flex flex-col gap-5'>
            <SpeechScoreMatrix
                score={report.score * 10}
                description={report.description}
                performanceMetrix={report.key_metrics}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard label="Duration" value={`${formateDuration(duration)}s`} icon={svg.alarmSVG} />
                <StatCard label="Avg Pace" value={`${report.avg_pace}`} icon={svg.pacingSVG} />
                <StatCard label="Fillers" value={`${report.filler.total_count}`} icon={svg.graphicSVG} />
                <StatCard label="Streak" value="5 Days" icon={svg.streakSVG} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] overflow-hidden flex h-[30rem] flex-col">
                    <div
                        className="p-4 border-b border-[#282e39] flex justify-between items-center bg-[#222731]">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Image src={svg.glowingLightbulbSVG} priority alt='Improment ' />
                            Improvement Suggestions
                        </h3>
                        <span
                            className="text-xs bg-[#282e39] text-[#9da6b9] px-2 py-1 rounded border border-[#3b4354]">
                            {totalSuggestions} found
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar">
                        <div className="flex flex-col divide-y divide-[#282e39]">
                            {report.grammar_corrections.map((item, idx) => (
                                <div className="p-4 flex gap-4 hover:bg-[#222731] transition-colors cursor-pointer" key={`grammar-${idx}`}>
                                    <div className="mt-1">
                                        <div className="size-2 rounded-full bg-red-500"></div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-red-400 uppercase">Grammar</span>
                                        <p className="text-[#9da6b9] text-sm line-through decoration-red-500/50">
                                            "{item.user_sentence}"
                                        </p>
                                        <p className="text-white text-sm font-medium">
                                            "
                                            <span className="text-[#22c55e]">{item.corrected_sentence}</span>
                                            "
                                        </p>
                                        <p className="text-[#6b7280] text-xs mt-1">{item.why_it_matters}</p>
                                    </div>
                                </div>
                            ))}
                            {report.vocabulary_enhancements.map((item, idx) => (
                                <div className="p-4 flex gap-4 hover:bg-[#222731] transition-colors cursor-pointer" key={`vocabulary-${idx}`}>
                                    <div className="mt-1">
                                        <div className="size-2 rounded-full bg-yellow-500"></div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-yellow-400 uppercase">Vocabulary</span>
                                        <p className="text-[#9da6b9] text-sm">
                                            "
                                            {highlightText(
                                                item.original_word,
                                                item.original_word,
                                                'underline decoration-yellow-500/50'
                                            )}
                                            "
                                        </p>
                                        <p className="text-white text-sm font-medium">
                                            Consider: "
                                            <span className="text-[#22c55e]">
                                                {highlightText(item.enhanced_word, item.enhanced_word, 'text-[#22c55e]')}
                                            </span>
                                            "
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {totalSuggestions === 0 && (
                                <div className="p-4 text-sm text-[#9da6b9]">
                                    No improvement suggestions were returned in this report.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                <div className="bg-[#1c1f27] rounded-xl border border-[#282e39] flex h-120 flex-col">
                    <div className="p-4 border-b border-[#282e39] bg-[#222731]">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Image src={svg.subtitlesSVG} alt='Transcript' />
                            Transcript Snippet
                        </h3>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto scrollbar">
                        {transcriptions.map((item, idx) => {
                            const intervalStart = idx * 3
                            const intervalEnd = intervalStart + 3

                            return <div className="flex gap-4 mb-4" key={idx}>
                                <div className="text-xs text-[#6b7280] font-mono mt-1 min-w-16">
                                    {formatTimestamp(intervalStart)} - {formatTimestamp(intervalEnd)}
                                </div>
                                <p className="text-[#d1d5db] text-sm leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinalScore
