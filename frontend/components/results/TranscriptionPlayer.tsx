import Image from "next/image"
import svg from "@/constants/svgs"

const TranscriptionPlayer = () => {
    return (
        <div
            className="flex flex-wrap items-center justify-between gap-4 bg-[#1c1f27] p-4 rounded-xl border border-[#282e39]">
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center justify-center size-10 rounded-full bg-[#135bec] text-white hover:bg-[#1d64f2] transition-colors shadow-md">
                    <Image src={svg.playSVG} alt='play btn' />
                </button>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">Play Recording</span>
                    <span className="text-[#9da6b9] text-xs">02:14 Total Duration</span>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500/20 border border-red-500 block"></span>
                    <span className="text-xs text-[#9da6b9] font-medium">Grammar</span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500 block"></span>
                    <span className="text-xs text-[#9da6b9] font-medium">Vocabulary</span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="size-3 rounded-full bg-blue-500/20 border border-blue-500 block"></span>
                    <span className="text-xs text-[#9da6b9] font-medium">Pronunciation</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-[#374151] border border-[#4b5563] block"></span>
                    <span className="text-xs text-[#9da6b9] font-medium">Filler Words</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 text-[#9da6b9] hover:text-white transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button className="p-2 text-[#9da6b9] hover:text-white transition-colors">
                    <span className="material-symbols-outlined">download</span>
                </button>
            </div>
        </div>
    )
}

export default TranscriptionPlayer