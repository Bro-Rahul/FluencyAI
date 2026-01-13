import clsx from "clsx";

const ContributionCell = ({ date, total }: { date: string, total: number }) => {
    const index = Math.min(total, 4);
    return (
        <div
            title={`Total ${total} sessions on ${date}`}
            className={clsx('w-3.75 h-3.75 rounded-sm', `color-${index}`)}
        />
    )
}

export default ContributionCell;