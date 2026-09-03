import { MonitoringServerGroup, TargetHealthResult } from "@/types/master-admin/monitoringTypes";
import StatusPill from "./StatusPill";
import MetricBar from "./MetricBar";
import ServiceCard from "./ServiceCard";

interface ServerGroupProps {
    server: MonitoringServerGroup;
    onSelect: (result: TargetHealthResult) => void;
}

const ServerGroup = ({ server, onSelect }: ServerGroupProps) => {
    const representative = server.services.find((s) => s.reachable && s.health?.system)?.health;

    return (
        <div className="bg-white rounded-[25px] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-heading">{server.hostname}</span>
                        {server.ip && <span className="text-xs text-gray-400">{server.ip}</span>}
                    </div>
                    <StatusPill status={server.status} className="mt-1" />
                </div>
                {representative?.system && (
                    <div className="grid grid-cols-3 gap-4 min-w-[280px] max-w-[420px] flex-1">
                        <MetricBar label="CPU" percent={representative.system.cpuPercent} />
                        <MetricBar
                            label="Memory"
                            percent={representative.system.memoryPercent}
                        />
                        <MetricBar
                            label="Disk"
                            percent={representative.system.disks?.[0]?.usedPercent ?? 0}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 tmd:grid-cols-2 tsm:grid-cols-1 gap-4">
                {server.services.map((result) => (
                    <ServiceCard key={result.slug} result={result} onClick={() => onSelect(result)} />
                ))}
            </div>
        </div>
    );
};

export default ServerGroup;
