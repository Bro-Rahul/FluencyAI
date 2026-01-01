interface CircularProgressProps {
    value: number;
}

const ScoreBoard = ({ value }: CircularProgressProps) => {
    const radius = 76;
    const circumference = 2 * Math.PI * radius;

    const progress = Math.min(Math.max(value, 0), 100);
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative size-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="88"
                    cy="88"
                    r={radius}
                    stroke="#282e39"
                    strokeWidth="12"
                    fill="none"
                />

                <circle
                    cx="88"
                    cy="88"
                    r={radius}
                    stroke="#135bec"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
            </svg>

            <div className="absolute text-center">
                <p className="text-5xl font-black text-white">{progress}</p>
                <p className="text-sm font-bold text-[#135bec]">Excellent</p>
            </div>
        </div>
    );
};

export default ScoreBoard;
