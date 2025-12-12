
const TimeLine = () => {
    return (
        <div className="grid grid-cols-3 gap-6 mb-8">
            {["Hours", "Minutes", "Seconds"].map((label) => (
                <div
                    key={label}
                    className="rounded-lg py-4 flex flex-col items-center border border-gray-700"
                >
                    <p className="text-2xl font-bold">00</p>
                    <span className="text-gray-400 text-sm">{label}</span>
                </div>
            ))}
        </div>
    )
}

export default TimeLine