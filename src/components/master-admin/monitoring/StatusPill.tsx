import { HealthStatus } from "@/types/master-admin/monitoringTypes";
import { STATUS_COLOR, STATUS_LABEL } from "./utils";

interface StatusPillProps {
    status: HealthStatus | "unreachable";
    className?: string;
}

const StatusPill = ({ status, className = "" }: StatusPillProps) => {
    const color = STATUS_COLOR[status] || STATUS_COLOR.unreachable;
    return (
        <span
            className={`${className} inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold`}
            style={{ backgroundColor: `${color}1a`, color }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            {STATUS_LABEL[status] || STATUS_LABEL.unreachable}
        </span>
    );
};

export default StatusPill;
