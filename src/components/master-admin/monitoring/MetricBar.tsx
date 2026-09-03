interface MetricBarProps {
    label: string;
    percent: number;
    detail?: string;
    threshold?: number;
    className?: string;
}

const MetricBar = ({ label, percent, detail, threshold = 85, className = "" }: MetricBarProps) => {
    const clamped = Math.min(100, Math.max(0, percent || 0));
    const breached = clamped >= threshold;
    const barColor = breached ? "#dc2626" : clamped >= threshold * 0.8 ? "#f59e0b" : "#16a34a";

    return (
        <div className={`${className} w-full`}>
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>{label}</span>
                <span className={breached ? "font-semibold text-error" : ""}>
                    {detail || `${clamped.toFixed(1)}%`}
                </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${clamped}%`, backgroundColor: barColor }}
                />
            </div>
        </div>
    );
};

export default MetricBar;
