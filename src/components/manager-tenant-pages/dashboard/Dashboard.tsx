"use client";
import { useLayoutEffect, useState, useEffect, createContext, useContext } from "react";
import dynamic from "next/dynamic";

// PROJECT IMPORT
import {
    useTenantDashboardCallOverview,
    useTenantDashboardSelector,
    useTenantTop10Users,
    useTenantRecent10Users,
    tenantDashboardGet,
    tenantDashboardCallOverviewGet,
    tenantDashboardTop10FilterGet,
    tenantDashboardRecent10FilterGet,
    useTenantCallData,
} from "@/redux/slice/tenant-admin/tenantDashboardSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import DashboardCard from "@/components/master-admin/dashboard/DashboardCard";
import {DashSelect} from "@/components/forms";

import { Chip, Icon, Loader } from "@/components/ui-components";
import { getDateFilterOptions, formatDate } from "@/helperFunctions";
import DonutChart from "@/components/master-admin/dashboard/DonutChart";

// DATA IMPORT
import {
    staticCardData,
    staticMainCardData,
} from "@/components/tenant-admin/dashboard/mock";
import { recent10userOptions, top10userOptions } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

// Import RealtimeReport component
import RealtimeReport from "@/components/manager-tenant-pages/reports/realtime-report/RealtimeReport";

// Import AccountDashboard component
import AccountDashboard from "@/components/tenant-admin/account-dashboard/AccountDashboard";
import { DashboardProvider } from "@/contexts/DashboardContext";

// Dashboard Context
const DashboardContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: "normal",
  setActiveTab: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

// THIRD - PARTY IMPORT
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const Dashboard = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const dispatch = useAppDispatch();
    const selector: any = useTenantDashboardSelector();
    const userOptions = useUserOptions();
    const callOverview = useTenantDashboardCallOverview();
    const callsData = useTenantCallData();
    const top10Users = useTenantTop10Users();
    const recent10Users = useTenantRecent10Users();

    const [top10Loading, setTop10Loading] = useState<boolean>(false);
    const [recent10Loading, setRecent10Loading] = useState<boolean>(false);
    const [callOverviewLoading, setCallOverviewLoading] =
        useState<boolean>(false);
    const [filter, setFilter] = useState({
        by_user: "",
        date: "1",
    });

    const [donutSelected, setDonutSelected] = useState({
        top10: "top10-user-usage",
        recent10: "recent10-user-usage",
    });

    const [top10, setTop10] = useState<string>("top10-user-usage");
    const [recent10, setRecent10] = useState<string>("recent10-user-usage");

    // Add tab state
    // const [activeTab, setActiveTab] = useState<string>("normal");

    // Dashboard options for dropdown
    // const dashboardOptions = [
    //     { value: "normal", label: "Normal Dashboard", icon: "Dashboard" as const },
    //     { value: "account", label: "Account Dashboard", icon: "SipDevices" as const },
    //     { value: "realtime", label: "Call Realtime Dashboard", icon: "ActiveCall" as const },
    // ];

    useLayoutEffect(() => {
        onGetDashboard();
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        onGetDashboardCallOverview();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Listen for header switch changes
    // useEffect(() => {
    //     const handleTabChange = (event: CustomEvent) => {
    //         setActiveTab(event.detail.tab);
    //     };

    //     // Listen for custom event from header
    //     window.addEventListener("dashboard-tab-changed", handleTabChange as EventListener);

    //     // Initialize from localStorage
    //     const savedTab = localStorage.getItem("dashboard-tab");
    //     if (savedTab) {
    //         setActiveTab(savedTab);
    //     }

    //     return () => {
    //         window.removeEventListener("dashboard-tab-changed", handleTabChange as EventListener);
    //     };
    // }, []);

    // Sync local state changes to localStorage
    // useEffect(() => {
    //     localStorage.setItem("dashboard-tab", activeTab);
    // }, [activeTab]);

    // Fetching Tenant Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Dashboard Data
    const onGetDashboard = async (feature: string = "all") => {
        try {
            await dispatch(tenantDashboardGet(feature)).unwrap();
        } catch (err) {
            console.error("Get Dashboard Err =-=> ", err);
        }
    };

    // Fetching Call OverView Data
    const onGetDashboardCallOverview = async () => {
        setCallOverviewLoading(true);
        try {
            const data = getDateFilterOptions()?.find(
                (val: any) => val?.value === filter.date
            );
            const payload = {
                by_user: filter?.by_user,
                start_date: data?.start_date,
                end_date: data?.end_date,
            };
            await dispatch(tenantDashboardCallOverviewGet(payload)).unwrap();
            setCallOverviewLoading(false);
        } catch (err) {
            setCallOverviewLoading(false);
            console.error("Get Dashboard Call Overview Err =-=> ", err);
        }
    };

    // Fetching Top 10 Tenant Data
    const onGetDashboardTop10Filter = async (
        feature: string = "top10-user-usage"
    ) => {
        setTop10Loading(true);
        try {
            await dispatch(tenantDashboardTop10FilterGet(feature)).unwrap();
            setTop10Loading(false);
        } catch (err) {
            setTop10Loading(false);
            console.error("Get Dashboard Top 10 Filter Err =-=> ", err);
        }
    };

    // Fetching Recent 10 Tenant Data
    const onGetDashboardRecent10Filter = async (
        feature: string = "recent10-user-usage"
    ) => {
        setRecent10Loading(true);
        try {
            await dispatch(tenantDashboardRecent10FilterGet(feature)).unwrap();
            setRecent10Loading(false);
        } catch (err) {
            setRecent10Loading(false);
            console.error("Get Dashboard Recent 10 Filter Err =-=> ", err);
        }
    };

    // Trigger When - Select Value Change
    const handleChange = (key: string, val: string) => {
        setFilter({
            ...filter,
            [key]: val,
        });
    };

    const handleTenantChange = (key: string, val: string) => {
        setDonutSelected({
            ...donutSelected,
            [key]: val,
        });
    };

    const prepareData: any = () => {
        const data = callOverview?.length ? callOverview : [];
        const dates: any = [];
        const total: any = [];
        const success: any = [];
        const fail: any = [];

        data?.forEach((val: any) => {
            total.push(val?.total);
            success.push(val?.success);
            fail.push(val?.fail);
            dates.push(val?._id?.date);
        });

        const options = {
            chart: {
                width: "100%",
                type: "area",
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                type: "date",
                categories: dates,
            },
            legend: {
                position: "right",
                offsetY: 0,
                height: 230,
            },
            colors: ["#90E4BB", "#C8C7FF", "#E49090"],
        };
        const series = [
            {
                name: "Total Calls",
                data: total,
            },
            {
                name: "Success Calls",
                data: success,
            },
            {
                name: "Failed Calls",
                data: fail,
            },
        ];

        return { options, series };
    };

    const NormalDashboard = () => (
        <>
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-4">
                    <div className="tsm:flex tsm:gap-2 space-y-3 tsm:space-y-0 col-span-1 tsm:col-span-4">
                        {staticMainCardData?.map((val: any, index: number) => {
                            return (
                                <div key={index}>
                                    <DashboardCard
                                        {...val}
                                        navigate={
                                            val?.name === "liveCall"
                                                ? managerName
                                                    ? "/manager-live-call"
                                                    : "/tenant-live-call"
                                                : null
                                        }
                                        count={selector[val?.name]}
                                        onRefresh={() => {
                                            onGetDashboard(val?.refreshKey);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-3 tsm:col-span-4 bg-white rounded-md drop-shadow-lg">
                        <div className="mx-3 py-2 border-b-2 border-dark-700 flex justify-between items-center">
                            <span className="text-heading text-sm font-bold">
                                 Call Overview
                            </span>
                            <div className="flex gap-2">
                                <DashSelect
                                    className="min-w-[180px] max-w-[250px] w-auto"
                                    name="by_user"
                                    isShowLabel={false}
                                    placeholder="Select User"
                                    removable
                                    options={userOptions}
                                    value={filter.by_user}
                                    onChange={(e: any) => {
                                        handleChange("by_user", e.target.value);
                                    }}
                                />

                                <DashSelect
                                    className="min-w-[180px] max-w-[250px] w-auto"
                                    name="date"
                                    icon="Calendar"
                                    isShowLabel={false}
                                    options={getDateFilterOptions()}
                                    value={filter.date}
                                    onChange={(e: any) => {
                                        handleChange("date", e.target.value);
                                    }}
                                />

                                <Icon
                                    className="cursor-pointer"
                                    name="Refresh2"
                                    width={15}
                                    height={15}
                                    alt="Refresh"
                                    onClick={() => {
                                        onGetDashboardCallOverview();
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-full area">
                            {callOverviewLoading ? (
                                <Loader height={200} />
                            ) : callOverview?.length ? (
                                <ReactApexChart
                                    {...prepareData()}
                                    type="area"
                                    height={200}
                                    width={"100%"}
                                />
                            ) : (
                                <div className="w-full h-[200px] flex items-center justify-center">
                                    <Chip title="Record Not Found" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-5 gap-5">
                    {staticCardData?.map((val: any, index: number) => {
                        return (
                            <div key={index}>
                                <DashboardCard {...val} count={callsData[val?.name]} smaller />
                            </div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 tsm:grid-cols-1 gap-4">
                    <DonutChart
                        loading={top10Loading}
                        title="Top Users 2"
                        name="top10"
                        data={top10Users}
                        options={top10userOptions}
                        selected={donutSelected?.top10}
                        onRefresh={onGetDashboardTop10Filter}
                        onChange={(key: string, val: string) => {
                            onGetDashboardTop10Filter(val);
                            handleTenantChange(key, val);
                        }}
                    />
                    <DonutChart
                        loading={recent10Loading}
                        title="Recently added Users"
                        name="recent10"
                        data={recent10Users}
                        options={recent10userOptions}
                        selected={donutSelected?.recent10}
                        onRefresh={onGetDashboardRecent10Filter}
                        onChange={(key: string, val: string) => {
                            onGetDashboardRecent10Filter(val);
                            handleTenantChange(key, val);
                        }}
                    />
                </div>
            </div>
        </>
    );

    const AccountDashboardComponent = () => (
        <div className="bg-white rounded-[30px] p-5">
            <AccountDashboard />
        </div>
    );

    return (
        <DashboardProvider>
        {/* <DashboardContext.Provider value={{ activeTab, setActiveTab }}> */}

                <NormalDashboard />

            {/* Tab Content */}
            {/* {activeTab === "normal" ? (
                <NormalDashboard />
            ) : activeTab === "account" ? (
                <AccountDashboardComponent />
            ) : (
                <div className="bg-white rounded-[30px] p-5">
                    <RealtimeReport />
                </div>
            )} */}
        </DashboardProvider>
    );
};

export default Dashboard;
