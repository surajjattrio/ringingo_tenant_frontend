"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// PROJECT IMPORT
import {
    dashboardCallOverviewGet,
    dashboardTop10FilterGet,
    dashboardRecent10FilterGet,
    dashboardGet,
    useDashboardCallOverview,
    useDashboardSelector,
    useIsLoading,
    useRecent10Tenant,
    useTop10Tenant,
} from "@/redux/slice/master-admin/dashboardSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
    staticMainCardData,
    usageChartData,
} from "@/components/master-admin/dashboard/mock";
import { DashSelect, Select } from "@/components/forms";
import { Chip, Icon, Loader } from "@/components/ui-components";
import {
    tenantOptionsGet,
    useTenantOptions,
} from "@/redux/slice/master-admin/tenantSlice";
import DashboardCard from "@/components/master-admin/dashboard/DashboardCard";
import DonutChart from "@/components/master-admin/dashboard/DonutChart";
import UsageChart from "@/components/master-admin/dashboard/UsageChart";
import { formatDate, getDateFilterOptions } from "@/helperFunctions";

// OPTIONS IMPORT
import { recent10tenantOptions, top10tenantOptions } from "@/config/options";

// THIRD - PARTY IMPORT
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const selector: any = useDashboardSelector();
    const tenantOptions = useTenantOptions();
    const callOverview = useDashboardCallOverview();
    const isLoading = useIsLoading();
    const top10Tenant = useTop10Tenant();
    const recent10Tenant = useRecent10Tenant();

    const [top10Loading, setTop10Loading] = useState<boolean>(false);
    const [recent10Loading, setRecent10Loading] = useState<boolean>(false);
    const [callOverviewLoading, setCallOverviewLoading] =
        useState<boolean>(false);
    const [filter, setFilter] = useState({
        by_tenant: "",
        date: "1",
    });

    const [donutSelected, setDonutSelected] = useState({
        top10: "top10-tenant-users",
        recent10: "recent10-tenant-users",
    });

    const [top10, setTop10] = useState<string>("top10-tenant-users");
    const [recent10, setRecent10] = useState<string>("recent10-tenant-users");

    useLayoutEffect(() => {
        //onGetDashboard();
        onGetTenantOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        onGetDashboardCallOverview();
        onGetDashboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Tenant Options
    const onGetTenantOptions = async () => {
        try {
            await dispatch(tenantOptionsGet());
        } catch (err) {
            console.error("Get Tenant Options Err =-=>", err);
        }
    };

    // Fetching Dashboard Data
    const onGetDashboard = async (feature: string = "all") => {
        try {
            const data = getDateFilterOptions()?.find((val: any) => val?.value === filter.date);
            const payload = {
                feature,
                start_date: formatDate(data?.start_date),
                end_date: formatDate(data?.end_date),
                by_tenant: filter?.by_tenant
            };
            await dispatch(dashboardGet(payload)).unwrap();
        } catch (err) {
            console.error("Get Dashboard Err =-=> ", err);
        }
    };

    // Fetching Call OverView Data
    const onGetDashboardCallOverview = async () => {
        setCallOverviewLoading(true);
        try {
            const data = getDateFilterOptions()?.find((val: any) => val?.value === filter.date);
            const payload = {
                by_tenant: filter?.by_tenant,
                start_date: formatDate(data?.start_date),
                end_date: formatDate(data?.end_date),
            };
            await dispatch(dashboardCallOverviewGet(payload)).unwrap();
            setCallOverviewLoading(false);
        } catch (err) {
            setCallOverviewLoading(false);
            console.error("Get Dashboard Call Overview Err =-=> ", err);
        }
    };

    // Fetching Top 10 Tenant Data
    const onGetDashboardTop10Filter = async (
        feature: string = "top10-tenant-users"
    ) => {
        setTop10Loading(true);
        try {
            const data = getDateFilterOptions()?.find((val: any) => val?.value === filter.date);
            const payload = {
                feature,
                start_date: formatDate(data?.start_date),
                end_date: formatDate(data?.end_date),
                by_tenant: filter?.by_tenant
            };
            await dispatch(dashboardTop10FilterGet(payload)).unwrap();
            setTop10Loading(false);
        } catch (err) {
            setTop10Loading(false);
            console.error("Get Dashboard TOp 10 Filter Err =-=> ", err);
        }
    };

    // Fetching Recent 10 Tenant Data
    const onGetDashboardRecent10Filter = async (
        feature: string = "recent-tenant-users"
    ) => {
        setRecent10Loading(true);
        try {
            const data = getDateFilterOptions()?.find((val: any) => val?.value === filter.date);
            const payload = {
                feature,
                start_date: formatDate(data?.start_date),
                end_date: formatDate(data?.end_date),
                by_tenant: filter?.by_tenant
            };
            await dispatch(dashboardRecent10FilterGet(payload)).unwrap();
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
    useEffect(() => {
        onGetDashboardTop10Filter(top10);
    }, [top10, filter]);
    useEffect(() => {
        onGetDashboardRecent10Filter(recent10)
    }, [recent10, filter]);
    return (
        <>
            <div className="space-y-5 bg-white p-6 rounded-[25px]">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-3 tsm:flex-nowrap tsm:gap-2 row-span-1 tsm:col-span-4 ">

                        {staticMainCardData?.map((val: any, idx: number) => {
                            return (
                                <div key={idx} className="w-[500px]">
                                    <DashboardCard
                                        {...val}
                                        count={selector[val?.name]}
                                        onRefresh={() => {
                                            onGetDashboard(val?.refreshKey);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* <div className="col-span-3 tsm:col-span-4 bg-white rounded-md drop-shadow-lg">
                        <div className="mx-3 py-2   flex justify-between items-center">
                            <div className="text-heading text-xm font-bold bg-blue-50 w-[70%] p-2 ml-2 rounded-[25px] ">
                                Call Overview
                            </div> */}
                            <div className="col-span-3 tsm:col-span-4 bg-blue-50 rounded-md drop-shadow-lg">
                        <div className="mx-3 py-2   flex justify-between items-center">
                            <div className="text-heading text-xm font-bold bg-white w-[50%] p-2 ml-2 rounded-[25px] ">
                                Call Overview
                            </div>
                            <div className="flex gap-2">
                                <DashSelect
className="min-w-[180px] max-w-[250px] w-auto"
                                    name="by_tenant"
                                    isShowLabel={false}
                                    placeholder="Select Tenant"
                                    options={tenantOptions}
                                    value={filter.by_tenant}
                                    removable
                                    onChange={(e: any) => {
                                        handleChange("by_tenant", e.target.value);
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
                                        onGetDashboard();
                                       // onGetDashboardTop10Filter(top10);
                                        //onGetDashboardRecent10Filter(recent10);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-full area">
                            {/* <Button text="Reset" style="secondary" /> */}
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
                <div className="grid grid-cols-2 tsm:grid-cols-1 gap-4">
                    <DonutChart
                        loading={top10Loading}
                        title="Top Tenants"
                        name="top10"
                        data={top10Tenant}
                        options={top10tenantOptions}
                        selected={donutSelected?.top10}
                        onRefresh={onGetDashboardTop10Filter}
                        onChange={(key: string, val: string) => {
                            //onGetDashboardTop10Filter(val)
                            handleTenantChange(key, val)
                            setTop10(val);
                        }}
                    />
                    <DonutChart
                        loading={recent10Loading}
                        title="Recently added Tenants"
                        name="recent10"
                        data={recent10Tenant}
                        options={recent10tenantOptions}
                        selected={donutSelected?.recent10}
                        onRefresh={onGetDashboardRecent10Filter}
                        onChange={(key: string, val: string) => {
                            //onGetDashboardRecent10Filter(val)
                            handleTenantChange(key, val)
                            setRecent10(val);
                        }}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4 tsm:grid-cols-1">
                    {usageChartData?.map((val: any, idx: number) => (
                        <div key={idx}>
                            <UsageChart
                                title={val?.title}
                                data={selector[val?.name]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;

