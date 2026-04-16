// TYPES
interface ChipProps {
    className?: string;
    title: string
}

/* ============================== CHIP ============================== */

const Chip = (props: ChipProps) => {
    const { className, title } = props
    return (
        // <span className={`${className} border border-dark-700 rounded-md px-5 py-2.5 text-xs font-semibold text-txt-secondary`}>{title}</span>
        <span className={`${className}  rounded-md px-5 py-2.5 text-xm font-semibold text-black`}>{title}</span>
    )
}

export default Chip