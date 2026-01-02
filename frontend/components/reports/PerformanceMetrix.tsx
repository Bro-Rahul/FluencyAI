import Image from "next/image"

interface PerformanceMetrixProps {
    label: string,
    icon: any,
    value: number,
    color: string
}

const PerformanceMetrix = ({ color, icon, label, value }: PerformanceMetrixProps) => {
    return (
        <div key={label} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-white inline-flex gap-x-2 items-center">
                    <Image
                        src={icon}
                        alt="this is svg"
                        width={20}
                        height={20}
                        priority
                    />
                    {label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-2 bg-[#282e39] rounded-full">
                <div
                    className={`h-full ${color} rounded-full`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    )
}

export default PerformanceMetrix