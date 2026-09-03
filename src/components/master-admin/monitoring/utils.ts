import { HealthStatus } from "@/types/master-admin/monitoringTypes";

export const STATUS_COLOR: Record<HealthStatus | "unreachable", string> = {
    healthy: "#16a34a",
    degraded: "#f59e0b",
    unhealthy: "#dc2626",
    unreachable: "#9ca3af",
};

export const STATUS_LABEL: Record<HealthStatus | "unreachable", string> = {
    healthy: "Healthy",
    degraded: "Degraded",
    unhealthy: "Unhealthy",
    unreachable: "Unreachable",
};

export const formatUptime = (totalSeconds?: number) => {
    if (!totalSeconds || totalSeconds <= 0) return "-";
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

export const formatAge = (fromIso?: string) => {
    if (!fromIso) return "-";
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(fromIso).getTime()) / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
};

export const ageSeconds = (fromIso?: string) => {
    if (!fromIso) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(fromIso).getTime()) / 1000));
};

export const formatMbAsGb = (mb?: number) => {
    if (!mb && mb !== 0) return "-";
    return (mb / 1024).toFixed(1);
};
