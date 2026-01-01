import { TranscriptionSchema } from "@/types/sessionReport"

interface PlainTranscriptionTextProps {
    transcriptions: TranscriptionSchema[]
}

const PlainTranscriptionText = ({ transcriptions }: PlainTranscriptionTextProps) => {
    return (
        transcriptions.map((item, idx) => (
            <div key={idx}
                className="flex gap-4 md:gap-6 group hover:bg-[#222731] p-3 rounded-lg transition-colors -mx-3">
                <div className="flex flex-col items-end gap-1 min-w-15">
                    <span className="text-xs font-mono text-[#135bec] font-bold">{item.end} - {item.start}</span>
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
        ))
    )
}

export default PlainTranscriptionText