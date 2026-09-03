import { TargetHealthResult } from "@/types/master-admin/monitoringTypes";
import { STATUS_COLOR } from "./utils";

interface DependencyMatrixProps {
    services: TargetHealthResult[];
}

const DependencyMatrix = ({ services }: DependencyMatrixProps) => {
    const dependencyNames = Array.from(
        new Set(
            services.flatMap((s) => s.health?.dependencies?.map((d) => d.name) || [])
        )
    );

    if (!dependencyNames.length) {
        return (
            <div className="bg-white rounded-[25px] p-5">
                <div className="font-bold text-heading mb-2">Dependency Matrix</div>
                <div className="text-xs text-gray-400">
                    No dependency checks reported by any service yet.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[25px] p-5">
            <div className="font-bold text-heading mb-4">Dependency Matrix</div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="text-left font-semibold text-gray-500 pb-2 pr-4">Service</th>
                            {dependencyNames.map((name) => (
                                <th key={name} className="text-left font-semibold text-gray-500 pb-2 px-3 capitalize">
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.slug} className="border-t border-gray-50">
                                <td className="py-2.5 pr-4 font-medium text-heading whitespace-nowrap">
                                    {service.displayName}
                                </td>
                                {dependencyNames.map((name) => {
                                    const dep = service.health?.dependencies?.find((d) => d.name === name);
                                    if (!dep) {
                                        return (
                                            <td key={name} className="py-2.5 px-3 text-gray-300">
                                                —
                                            </td>
                                        );
                                    }
                                    const color = STATUS_COLOR[dep.status] || STATUS_COLOR.unreachable;
                                    return (
                                        <td key={name} className="py-2.5 px-3">
                                            <span className="font-semibold" style={{ color }}>
                                                {dep.status === "healthy" ? `${dep.latencyMs ?? 0}ms` : "✕"}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DependencyMatrix;
