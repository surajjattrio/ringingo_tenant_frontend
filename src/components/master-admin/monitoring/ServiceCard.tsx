import { TargetHealthResult } from "@/types/master-admin/monitoringTypes";
import StatusPill from "./StatusPill";
import MetricBar from "./MetricBar";
import { formatMbAsGb, formatUptime, STATUS_COLOR } from "./utils";

interface ServiceCardProps {
    result: TargetHealthResult;
    onClick: () => void;
}

const ServiceCard = ({ result, onClick }: ServiceCardProps) => {
    const health = result.health;
    const status = result.reachable ? health?.status || "healthy" : "unreachable";

    return (
        <div
            onClick={onClick}
            className="cursor-pointer bg-white border border-gray-100 rounded-[20px] p-4 space-y-3 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="font-bold text-sm text-heading">{result.displayName}</div>
                    <div className="text-[11px] text-gray-400">{result.slug}</div>
                </div>
                <StatusPill status={status} />
            </div>

            {!result.reachable ? (
                <div className="text-xs text-error bg-red-50 rounded-lg px-2.5 py-2">
                    {result.error || "Unreachable"}
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
                        <span>Uptime: <b className="text-black">{formatUptime(health?.uptimeSeconds)}</b></span>
                        <span>Restarts: <b className="text-black">{health?.process?.restartCount ?? "-"}</b></span>
                        {health?.version?.commit && (
                            <span>Commit: <b className="text-black">{health.version.commit.slice(0, 7)}</b></span>
                        )}
                    </div>

                    {health?.system && (
                        <div className="space-y-2">
                            <MetricBar
                                label="CPU"
                                percent={health.system.cpuPercent}
                                threshold={85}
                            />
                            <MetricBar
                                label="Memory"
                                percent={health.system.memoryPercent}
                                detail={`${formatMbAsGb(health.system.memoryUsedMb)} / ${formatMbAsGb(health.system.memoryTotalMb)} GB`}
                                threshold={85}
                            />
                            {health.system.disks.map((disk) => (
                                <MetricBar
                                    key={disk.mount}
                                    label={`Disk ${disk.mount}`}
                                    percent={disk.usedPercent}
                                    detail={`${disk.usedGb} / ${disk.totalGb} GB`}
                                    threshold={85}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {health?.dependencies?.length ? (
                            health.dependencies.map((dep) => {
                                const color = STATUS_COLOR[dep.status] || STATUS_COLOR.unreachable;
                                return (
                                    <span
                                        key={dep.name}
                                        className="text-[10px] font-semibold rounded-md px-2 py-1"
                                        style={{ backgroundColor: `${color}1a`, color }}
                                    >
                                        {dep.name} {dep.status === "healthy" ? `${dep.latencyMs ?? 0}ms` : "✕"}
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-[10px] text-gray-400">No dependency checks reported</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ServiceCard;
