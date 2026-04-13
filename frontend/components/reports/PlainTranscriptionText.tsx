import { TranscriptionSchema } from "@/types/sessionReport"

interface PlainTranscriptionTextProps {
    transcriptions: TranscriptionSchema[]
}

const formatTimestamp = (value: number) => {
    const totalSeconds = Math.max(0, Math.floor(value))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const PlainTranscriptionText = ({ transcriptions }: PlainTranscriptionTextProps) => {
    return (
        transcriptions.map((item, idx) => {
            const intervalStart = idx * 3
            const intervalEnd = intervalStart + 3

            return (
                <div
                    key={idx}
                    className="flex gap-4 md:gap-6 group hover:bg-[#222731] p-3 rounded-lg transition-colors -mx-3">
                    <div className="flex flex-col items-end gap-1 min-w-15">
                        <span className="text-xs font-mono text-[#135bec] font-bold">
                            {formatTimestamp(intervalStart)} - {formatTimestamp(intervalEnd)}
                        </span>
                        <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9da6b9] hover:text-white">

                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="text-[#d1d5db] text-base leading-relaxed">
                            {item.text}
                        </p>
                    </div>
                </div>
            )
        })
    )
}

export default PlainTranscriptionText
