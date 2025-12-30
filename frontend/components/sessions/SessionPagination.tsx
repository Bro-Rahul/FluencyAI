import svg from '@/constants/svgs'
import Image from 'next/image'


const SessionPagination = () => {
    return (
        <div className="flex justify-center items-center gap-4 border-t border-[#282e39] pt-6 mb-8">
            <button
                className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                <Image priority src={svg.arrowForwardSVG} alt="arrow backword" className="rotate-180" />
                Previous
            </button>
            <div className="flex items-center gap-2">
                <button
                    className="size-8 flex items-center justify-center rounded-lg bg-[#135bec] text-white text-sm font-bold">1</button>
                <button
                    className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">2</button>
                <button
                    className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">3</button>
                <span className="text-[#9da6b9]">...</span>
                <button
                    className="size-8 flex items-center justify-center rounded-lg text-[#9da6b9] hover:text-white hover:bg-[#282e39] text-sm font-bold transition-colors">8</button>
            </div>
            <button
                className="flex items-center gap-2 text-[#9da6b9] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#282e39]">
                Next
                <Image priority src={svg.arrowForwardSVG} alt="arrow forward" />
            </button>
        </div>
    )
}

export default SessionPagination