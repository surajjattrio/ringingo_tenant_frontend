"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaCheckCircle, FaHdd, FaExclamationTriangle, FaChartLine, FaClock } from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { useAuth } from "@/contexts/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { useUserOptions, userOptionsGet } from "@/redux/slice/tenant-admin/userSlice";
import { DashSelect } from "@/components/forms";
import { Icon, Loader } from "@/components/ui-components";
import { getDateFilterOptions, formatDate } from "@/helperFunctions";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Fix for React Node type issue with react-icons v5 and @types/react v18
const CloudUploadIcon = FaCloudUploadAlt as any;
const CheckCircleIcon = FaCheckCircle as any;
const ExclamationTriangleIcon = FaExclamationTriangle as any;
const ClockIcon = FaClock as any;

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

interface AnalyticsStatsProps {
    isConnected?: boolean;
    onConnect?: () => void;
    refreshTrigger?: number;
}

const StatCard = ({ title, value, subtext, icon: Icon, color, index }: any) => {
    // Map colors to specific tailwind classes for the icon background
    const getColorClasses = (c: string) => {
        switch (c) {
            case "indigo": return "bg-indigo-600 text-white";
            case "green": return "bg-emerald-500 text-white";
            case "blue": return "bg-blue-500 text-white";
            case "rose": return "bg-rose-500 text-white";
            case "purple": return "bg-purple-500 text-white";
            default: return "bg-gray-500 text-white";
        }
    };

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-blue-50 dark:bg-gray-800 flex w-full p-4 rounded-[40px] items-center overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            {/* Icon - Simulating the circle background from the project SVGs */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${getColorClasses(color)}`}>
                <Icon size={24} />
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col ml-4 justify-center overflow-hidden">
                {/* Title */}
                <span className="font-medium text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {title}
                </span>

                <div className="flex flex-col mt-0.5">
                    {/* Count */}
                    <span className="text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
                        {value}
                    </span>

                    {/* Subtext - Added to match user request even though original card might not have it */}
                    {subtext && (
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                            {subtext}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const AnalyticsStats = ({ isConnected = true, onConnect, refreshTrigger = 0 }: AnalyticsStatsProps) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();

    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activityLoading, setActivityLoading] = useState(false);

    // Filters state
    const [filter, setFilter] = useState({
        by_user: "",
        date: "1", // Default to "Today" or whatever 1 maps to in your options, likely matches dashboard default
    });

    useEffect(() => {
        // Fetch user options for the dropdown
        if (isConnected) {
            dispatch(userOptionsGet());
        }
    }, [dispatch, isConnected]);

    // Load main stats (cards)
    useEffect(() => {
        const loadStats = async () => {
            if (!user?.tenant_detail?.uuid || !isConnected) return;
            try {
                const statsRes = await googleDriveService.getRecordingStats({ tenant_uuid: user.tenant_detail.uuid });
                if (statsRes.success) {
                    setStats(statsRes.data);
                }
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [user, isConnected, refreshTrigger]);

    // Load Activity Chart (triggers on filter change)
    useEffect(() => {
        const loadActivity = async () => {
            if (!user?.tenant_detail?.uuid || !isConnected) return;
            try {
                setActivityLoading(true);
                const dateOption = getDateFilterOptions()?.find((val: any) => val?.value === filter.date);

                const params: any = {
                    tenant_uuid: user.tenant_detail.uuid,
                    interval: 'day'
                };

                if (dateOption) {
                    params.start_date = formatDate(dateOption.start_date);
                    params.end_date = formatDate(dateOption.end_date);
                }

                if (filter.by_user) {
                    params.user_uuid = filter.by_user;
                }

                const activityRes = await googleDriveService.getUploadActivity(params);
                if (activityRes.success) {
                    setActivity(activityRes.data.activity);
                }
            } catch (error) {
                console.error("Failed to load activity", error);
            } finally {
                setActivityLoading(false);
            }
        };
        loadActivity();
    }, [user, refreshTrigger, filter]);

    const handleChange = (key: string, val: string) => {
        setFilter(prev => ({ ...prev, [key]: val }));
    };

    // Transform activity data for chart
    const timestamps = activity.map(item => item.formatted_date);
    const counts = activity.map(item => item.count);

    const series = [
        {
            name: "Uploads",
            data: counts,
        }
    ];

    const chartOptions: any = {
        chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            fontFamily: "inherit",
            background: "transparent",
            animations: { enabled: false }
        },
        colors: ["#6366f1"],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories: timestamps,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#9ca3af" } },
        },
        yaxis: {
            labels: { style: { colors: "#9ca3af" } },
        },
        grid: {
            borderColor: "#f3f4f6", // tailwind gray-100
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
        },
        tooltip: { theme: "light" },
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                    <CloudUploadIcon size={60} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect Google Drive</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                    Connect your Google Drive account to automatically sync recordings, track storage usage, and monitor upload activity in real-time.
                </p>
                <button
                    onClick={onConnect}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                    Connect Account
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    index={0}
                    title="Total Recordings"
                    value={stats?.total_recordings?.toLocaleString() || "0"}
                    subtext="All time uploads"
                    icon={CloudUploadIcon}
                    color="indigo"
                />
                <StatCard
                    index={1}
                    title="Success Rate"
                    value={stats?.success_rate ? `${stats.success_rate}%` : "0%"}
                    subtext={`${stats?.successful_uploads || 0} successful`}
                    icon={CheckCircleIcon}
                    color="green"

                />
                <StatCard
                    index={2}
                    title="Avg Upload Time"
                    value={stats?.avg_upload_time_sec ? `${stats.avg_upload_time_sec}s` : "0s"}
                    subtext="Per file average"
                    icon={ClockIcon}
                    color="blue"
                />
                <StatCard
                    index={3}
                    title="Failed Uploads"
                    value={stats?.failed_uploads || "0"}
                    subtext="Requires attention"
                    icon={ExclamationTriangleIcon}
                    color={stats?.failed_uploads > 0 ? "rose" : "gray"}
                />
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="mx-3 py-2 flex justify-between items-center">
                    <div className="text-heading text-xm font-bold bg-white w-fit px-5 py-2 rounded-[25px] shadow-sm">
                        Upload Activity
                    </div>
                    <div className="flex gap-2">
                        <DashSelect
                            className="min-w-[150px] max-w-[250px] w-auto"
                            name="by_user"
                            isShowLabel={false}
                            placeholder="Select User"
                            removable
                            options={userOptions}
                            value={filter.by_user}
                            onChange={(e: any) => handleChange("by_user", e.target.value)}
                        />

                        <DashSelect
                            className="min-w-[170px] max-w-[250px] w-auto"
                            name="date"
                            icon="Calendar"
                            isShowLabel={false}
                            options={getDateFilterOptions()}
                            value={filter.date}
                            onChange={(e: any) => handleChange("date", e.target.value)}
                        />

                        <Icon
                            className="cursor-pointer"
                            tooltip="Refresh"
                            name="Refresh2"
                            width={15}
                            height={15}
                            alt="Refresh"
                            onClick={() => {
                                // Re-trigger load
                                const load = async () => {
                                    setActivityLoading(true);
                                    try {
                                        const res = await googleDriveService.getUploadActivity({ tenant_uuid: user?.tenant_detail?.uuid, interval: 'day' });
                                        if (res.success) setActivity(res.data.activity);
                                        // Reset filters if desired, or just re-fetch with current filters
                                    } finally { setActivityLoading(false); }
                                };
                                load();
                            }}
                        />
                    </div>
                </div>

                <div className="w-full bg-blue-50 p-4 relative min-h-[350px]">
                    {activityLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px] rounded transition-all duration-300">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <span className="text-sm font-medium text-blue-600 animate-pulse">Updating Graph...</span>
                        </div>
                    )}

                    {activity.length > 0 ? (
                        <ReactApexChart options={chartOptions} series={series} type="area" height={350} />
                    ) : (
                        !activityLoading && (
                            <div className="h-[350px] flex items-center justify-center text-gray-400">
                                <div className="flex flex-col items-center">
                                    <Icon name="NoRecordFound" height={60} width={160} alt="No Records" />
                                    <span className="mt-2 text-sm">No activity found for selected range</span>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsStats;
