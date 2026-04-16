
// TYPES IMPORT
interface ProgressBarProps {
    value: number;
    width?: number;
    height?: number
}

const ProgressBar = (props: ProgressBarProps) => {
    const { value = 0, width = 20, height = 1 } = props
    return (
        <>
            <div className="w-full bg-primary-v9 rounded-full items-center transition-all" style={{ width: width, height: height }}>
                <div className="bg-primary rounded-full" style={{ width: `${value}%`, height: height }}></div>
            </div>
        </>
    )
}

export default ProgressBar