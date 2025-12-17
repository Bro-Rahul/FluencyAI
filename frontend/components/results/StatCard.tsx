
const StatCard = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="bg-[#1c1f27] p-4 rounded-xl border border-[#282e39]">
            <p className="text-xs text-[#9da6b9] uppercase">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    )
}


export default StatCard;