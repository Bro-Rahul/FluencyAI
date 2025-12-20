


const TimeLine: React.FC<{
    Hours: number,
    Minutes: number,
    Seconds: number
}> = (props) => {
    return (
        <div className="grid grid-cols-3 gap-6 mb-8">
            {Object.entries(props).map(([key, val]) => (
                <div
                    key={key}
                    className="rounded-lg py-4 flex flex-col items-center border border-gray-700"
                >
                    <p className="text-2xl font-bold">{val}</p>
                    <span className="text-gray-400 text-sm">{key}</span>
                </div>
            ))}
        </div>
    )
}

export default TimeLine