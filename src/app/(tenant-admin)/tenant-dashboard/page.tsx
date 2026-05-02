"use client";
import {  useState, useEffect,  useMemo } from "react";

// PROJECT IMPORT
import {
  useTenantDashboardCallOverview,
  useTenantDashboardSelector,
  useTenantCallData,
  tenantDashboardDataGet,
  useTenantDashboardKpis,
  useTenantDashboardInbound,
  useTenantDashboardOutbound,
  useTenantDashboardTrafficTrends,
  useTenantDashboardDispositionTrends,
  useTenantDashboardCallDistribution,
} from "@/redux/slice/tenant-admin/tenantDashboardSlice";
import { useAppDispatch } from "@/redux/hooks";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { StatCard } from "@/components/tenant-admin/dashboard/StatCard";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  PhoneMissed,
  CornerDownLeft,
  Users,
  Phone,
  X,
  Clock, Pause, Headphones, Timer, Activity, CirclePause,
  Coffee
} from "lucide-react";
import { PerformanceKpiCard } from "@/components/tenant-admin/dashboard/PerformanceKpiCard";
import TrafficVolumeTrends from "@/components/tenant-admin/dashboard/TrafficVolumeTrends";
import OperationsHealth from "@/components/tenant-admin/dashboard/TrendingDisposition";
import CallDistribution from "@/components/tenant-admin/dashboard/CallDistribution";
import QueueVolume from "@/components/tenant-admin/dashboard/QueueVolume";
import TrendingDisposition from "@/components/tenant-admin/dashboard/TrendingDisposition";

// export const useDashboardContext = () => useContext(DashboardContext);
type CardCfg = {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  deltaText?: string;
  deltaCaption?: string;
  icon: React.ReactNode;
  iconBgClassName: string;
  iconClassName: string;
};
const InboundMissedIcon = () => (
  <span className="relative inline-flex">
    <PhoneIncoming className="h-5 w-5" />
    <X className="absolute -right-2 -top-2 h-3.5 w-3.5" />
  </span>
);
type KpiCfg = {
  key: string;
  icon: React.ReactNode;
  iconClassName: string;
  value: string;
  label: string;
  trend: "up" | "down";
  percent: string;
};
const Dashboard = () => {
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const dispatch = useAppDispatch();
  const selector: any = useTenantDashboardSelector();
  const callOverview = useTenantDashboardCallOverview();
  const callsData = useTenantCallData();
  console.log(callsData, 'callsData');
  const dashboardKpis = useTenantDashboardKpis();
const inbound = useTenantDashboardInbound();
const outbound = useTenantDashboardOutbound();
const trafficTrends = useTenantDashboardTrafficTrends();
const dispositionTrends = useTenantDashboardDispositionTrends();
const callDistribution = useTenantDashboardCallDistribution();
console.log(dashboardKpis,inbound, outbound, trafficTrends, dispositionTrends, callDistribution, 'dashboardData');
const formatNum = (n: any) => Number(n ?? 0).toLocaleString();
useEffect(() => {
  dispatch(
    tenantDashboardDataGet({
      tenant_uuid: selector.tenant_uuid,
      filter: period, // daily/weekly/monthly
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );
}, [selector?.tenant_uuid, period, dispatch]);
const kpis: KpiCfg[] = useMemo(() => ([
  {
    key: "wait-time",
    icon: <Clock className="h-5 w-5" />,
    iconClassName: "text-orange-500",
    value: dashboardKpis?.wait_time ?? "00:00:00",
    label: "WAIT TIME",
    trend: "up",
    percent: "0%",
  },
  {
    key: "hold-time",
    icon: <Pause className="h-5 w-5" />,
    iconClassName: "text-orange-500",
    value: dashboardKpis?.hold_time ?? "00:00:00",
    label: "HOLD TIME",
    trend: "up",
    percent: "0%",
  },
  {
    key: "ring-time",
    icon: <PhoneCall className="h-5 w-5" />,
    iconClassName: "text-emerald-600",
    value: dashboardKpis?.ring_time ?? "00:00:00",
    label: "RING TIME",
    trend: "up",
    percent: "0%",
  },
  {
    key: "aht",
    icon: <Timer className="h-5 w-5" />,
    iconClassName: "text-blue-600",
    value: dashboardKpis?.aht ?? "00:00:00",
    label: "AHT",
    trend: "up",
    percent: "0%",
  },
  {
    key: "wrap-up",
    icon: <Activity className="h-5 w-5" />,
    iconClassName: "text-blue-600",
    value: dashboardKpis?.wrap_up ?? "00:00:00",
    label: "WRAP-UP",
    trend: "up",
    percent: "0%",
  },
  {
    key: "idle-time",
    icon: <PhoneOff className="h-5 w-5" />,
    iconClassName: "text-orange-500",
    value: dashboardKpis?.idle_time ?? "00:00:00",
    label: "IDLE TIME",
    trend: "up",
    percent: "0%",
  },
  {
    key: "pause-time",
    icon: <CirclePause className="h-5 w-5" />,
    iconClassName: "text-rose-500",
    value: dashboardKpis?.pause_time ?? "00:00:00",
    label: "PAUSE TIME",
    trend: "up",
    percent: "0%",
  },
  {
    key: "break-time",
    icon: <Coffee className="h-5 w-5" />,
    iconClassName: "text-violet-600",
    value: dashboardKpis?.break_time ?? "00:00:00",
    label: "BREAK TIME",
    trend: "up",
    percent: "0%",
  },
]), [dashboardKpis]);


const outboundCards: CardCfg[] = useMemo(() => ([
  {
    title: "Total Calls",
    value: formatNum(outbound?.total_calls ?? 0),
    icon: <PhoneCall className="h-6 w-6" />,
    iconBgClassName: "bg-blue-50",
    iconClassName: "text-blue-500",
  },
  {
    title: "Connected Calls",
    value: formatNum(outbound?.connected_calls ?? 0),
    icon: <Phone className="h-6 w-6" />,
    iconBgClassName: "bg-emerald-50",
    iconClassName: "text-emerald-500",
  },
  {
    title: "Not Connected",
    value: formatNum(outbound?.not_connected ?? 0),
    icon: <PhoneOff className="h-6 w-6" />,
    iconBgClassName: "bg-amber-50",
    iconClassName: "text-amber-600",
  },
  {
    title: "Dropped Calls",
    value: formatNum(outbound?.missed_calls ?? 0),
    icon: <PhoneMissed className="h-6 w-6" />,
    iconBgClassName: "bg-rose-50",
    iconClassName: "text-rose-500",
  },
  // {
  //   title: "Dropped Calls",
  //   value: formatNum(outbound?.dropped_calls ?? 0),
  //   icon: <PhoneOff className="h-6 w-6" />,
  //   iconBgClassName: "bg-orange-50",
  //   iconClassName: "text-orange-600",
  // },
]), [outbound]);

const inboundCards: CardCfg[] = useMemo(() => ([
  {
    title: "Total Calls",
    value: formatNum(inbound?.total_calls ?? 0),
    icon: <PhoneIncoming className="h-6 w-6" />,
    iconBgClassName: "bg-blue-50",
    iconClassName: "text-blue-500",
  },
  {
    title: "Connected Calls",
    value: formatNum(inbound?.connected_calls ?? 0),
    icon: <Phone className="h-6 w-6" />,
    iconBgClassName: "bg-emerald-50",
    iconClassName: "text-emerald-500",
  },
  {
    title: "IVR Hits",
    value: formatNum(inbound?.ivr_hits ?? 0),
    icon: <CornerDownLeft className="h-5 w-5" />,
    iconBgClassName: "bg-amber-50",
    iconClassName: "text-amber-500",
  },
  {
    title: "Missed Calls",
    value: formatNum(inbound?.missed_calls ?? 0),
    icon: <InboundMissedIcon />,
    iconBgClassName: "bg-rose-50",
    iconClassName: "text-rose-500",
  },
  {
    title: "Dropped Calls",
    value: formatNum(inbound?.dropped_calls ?? 0),
    icon: <PhoneOff className="h-5 w-5" />,
    iconBgClassName: "bg-orange-50",
    iconClassName: "text-orange-600",
  },
]), [inbound]);

  // const [top10Loading, setTop10Loading] = useState<boolean>(false);
  // const [recent10Loading, setRecent10Loading] = useState<boolean>(false);
  // const [callOverviewLoading, setCallOverviewLoading] =
  //   useState<boolean>(false);
  // const [filter, setFilter] = useState({
  //   by_user: "",
  //   date: "1",
  // });

  // const [donutSelected, setDonutSelected] = useState({
  //   top10: "top10-user-usage",
  //   recent10: "recent10-user-usage",
  // });

  // const [top10, setTop10] = useState<string>("top10-user-usage");
  // const [recent10, setRecent10] = useState<string>("recent10-user-usage");

  // Add tab state
  // const [activeTab, setActiveTab] = useState<string>("normal");

  // Dashboard options for dropdown
  // const dashboardOptions = [
  //   { value: "normal", label: "Normal Dashboard", icon: "Dashboard" as const },
  //   { value: "account", label: "Account Dashboard", icon: "SipDevices" as const },
  //   { value: "realtime", label: "Call Realtime Dashboard", icon: "ActiveCall" as const },
  // ];

  // useLayoutEffect(() => {
    // onGetDashboard();
    // onGetUserOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useLayoutEffect(() => {
    // onGetDashboardCallOverview();
    // onGetDashboard("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filter]);

  // Listen for header switch changes
  // useEffect(() => {
  //   const handleTabChange = (event: CustomEvent) => {
  //     setActiveTab(event.detail.tab);
  //   };

  //   // Listen for custom event from header
  //   window.addEventListener("dashboard-tab-changed", handleTabChange as EventListener);

  //   // Initialize from localStorage
  //   const savedTab = localStorage.getItem("dashboard-tab");
  //   if (savedTab) {
  //     setActiveTab(savedTab);
  //   }

  //   return () => {
  //     window.removeEventListener("dashboard-tab-changed", handleTabChange as EventListener);
  //   };
  // }, []);

  // Sync local state changes to localStorage
  // useEffect(() => {
  //   localStorage.setItem("dashboard-tab", activeTab);
  // }, [activeTab]);

  // Fetching Tenant Options
  // const onGetUserOptions = async () => {
  //   try {
  //     await dispatch(userOptionsGet());
  //   } catch (err) {
  //     console.error("Get User Options Err =-=>", err);
  //   }
  // };

  // Fetching Dashboard Data
  // const onGetDashboard = async (feature: string) => {
  //   try {
  //     const data = getDateFilterOptions()?.find(
  //       (val: any) => val?.value === filter.date
  //     );
  //     const payload = {
  //       feature,
  //       start_date: formatDate(data?.start_date),
  //       end_date: formatDate(data?.end_date),
  //       by_user: filter?.by_user,
  //     };
  //     await dispatch(tenantDashboardGet(payload)).unwrap();
  //   } catch (err) {
  //     console.error("Get Dashboard Err =-=> ", err);
  //   }
  // };

  // Fetching Call OverView Data
  // const onGetDashboardCallOverview = async () => {
  //   setCallOverviewLoading(true);
  //   try {
  //     const data = getDateFilterOptions()?.find(
  //       (val: any) => val?.value === filter.date
  //     );
  //     const payload = {
  //       by_user: filter?.by_user,
  //       start_date: data?.start_date,
  //       end_date: data?.end_date,
  //     };
  //     await dispatch(tenantDashboardCallOverviewGet(payload)).unwrap();
  //     setCallOverviewLoading(false);
  //   } catch (err) {
  //     setCallOverviewLoading(false);
  //     console.error("Get Dashboard Call Overview Err =-=> ", err);
  //   }
  // };

  // Fetching Top 10 Tenant Data
  // const onGetDashboardTop10Filter = async (
  //   feature: string = "top10-user-usage"
  // ) => {
  //   setTop10Loading(true);
  //   try {
  //     const data = getDateFilterOptions()?.find(
  //       (val: any) => val?.value === filter.date
  //     );
  //     const payload = {
  //       feature,
  //       start_date: formatDate(data?.start_date),
  //       end_date: formatDate(data?.end_date),
  //       by_user: filter?.by_user,
  //     };
  //     await dispatch(tenantDashboardTop10FilterGet(payload)).unwrap();
  //     setTop10Loading(false);
  //   } catch (err) {
  //     setTop10Loading(false);
  //     console.error("Get Dashboard Top 10 Filter Err =-=> ", err);
  //   }
  // };

  // Fetching Recent 10 Tenant Data
  // const onGetDashboardRecent10Filter = async (
  //   feature: string = "recent10-user-usage"
  // ) => {
  //   setRecent10Loading(true);
  //   try {
  //     const data = getDateFilterOptions()?.find(
  //       (val: any) => val?.value === filter.date
  //     );
  //     const payload = {
  //       feature,
  //       start_date: formatDate(data?.start_date),
  //       end_date: formatDate(data?.end_date),
  //       by_user: filter?.by_user,
  //     };
  //     await dispatch(tenantDashboardRecent10FilterGet(payload)).unwrap();
  //     setRecent10Loading(false);
  //   } catch (err) {
  //     setRecent10Loading(false);
  //     console.error("Get Dashboard Recent 10 Filter Err =-=> ", err);
  //   }
  // };

  // Trigger When - Select Value Change
  // const handleChange = (key: string, val: string) => {
  //   setFilter({
  //     ...filter,
  //     [key]: val,
  //   });
  // };

  // const handleTenantChange = (key: string, val: string) => {
  //   setDonutSelected({
  //     ...donutSelected,
  //     [key]: val,
  //   });
  // };

  // const prepareData: any = () => {
  //   const data = callOverview?.length ? callOverview : [];
  //   const dates: any = [];
  //   const total: any = [];
  //   const success: any = [];
  //   const fail: any = [];

  //   data?.forEach((val: any) => {
  //     total.push(val?.total);
  //     success.push(val?.success);
  //     fail.push(val?.fail);
  //     dates.push(val?._id?.date);
  //   });

  //   const options = {
  //     chart: {
  //       width: "100%",
  //       type: "area",
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     xaxis: {
  //       type: "date",
  //       categories: dates,
  //     },
  //     legend: {
  //       position: "right",
  //       offsetY: 0,
  //       height: 230,
  //     },
  //     colors: ["#90E4BB", "#C8C7FF", "#E49090"],
  //   };
  //   const series = [
  //     {
  //       name: "Total Calls",
  //       data: total,
  //     },
  //     {
  //       name: "Success Calls",
  //       data: success,
  //     },
  //     {
  //       name: "Failed Calls",
  //       data: fail,
  //     },
  //   ];

  //   return { options, series };
  // };
  // useEffect(() => {
  //   onGetDashboardTop10Filter(top10);
  // }, [top10, filter]);
  // useEffect(() => {
  //   onGetDashboardRecent10Filter(recent10);
  // }, [recent10, filter]);

  // Normal Dashboard Component
  // const NormalDashboard = () => (
  //   <div className="space-y-5 bg-white p-6 rounded-[25px]">
  //     <div className="grid grid-cols-2 gap-2">
  //       <div className="flex gap-3 tsm:flex-nowrap tsm:gap-2 row-span-1 tsm:col-span-4 ">
  //         {staticMainCardData?.map((val: any, index: number) => {
  //           return (
  //             <div key={index} className="flex-1 w-full ">
  //               <DashboardCard
  //                 {...val}
  //                 count={selector[val?.name]}
  //                 onRefresh={() => {
  //                   onGetDashboard(val?.refreshKey);
  //                 }}
  //               />
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div className="col-span-3 tsm:col-span-4 bg-blue-50 rounded-md drop-shadow-lg">
  //         <div className="mx-3 py-2   flex justify-between items-center">
  //           <div className="text-heading text-xm font-bold bg-white w-[50%] p-2 ml-2 pl-5 rounded-[25px] ">
  //             Call Overview
  //           </div>
  //           <div className="flex gap-2">
  //             <DashSelect
  //               className="min-w-[150px] max-w-[250px] w-auto"
  //               name="by_user"
  //               isShowLabel={false}
  //               placeholder="Select User"
  //               removable
  //               options={userOptions}
  //               value={filter.by_user}
  //               onChange={(e: any) => {
  //                 handleChange("by_user", e.target.value);
  //               }}
  //             />

  //             <DashSelect
  //               className="min-w-[170px] max-w-[250px] w-auto"
  //               name="date"
  //               icon="Calendar"
  //               isShowLabel={false}
  //               options={getDateFilterOptions()}
  //               value={filter.date}
  //               onChange={(e: any) => {
  //                 handleChange("date", e.target.value);
  //               }}
  //             />

  //             <Icon
  //               className="cursor-pointer "
  //               tooltip="Refresh"
  //               name="Refresh2"
  //               width={15}
  //               height={15}
  //               alt="Refresh"
  //               onClick={() => {
  //                 onGetDashboard("all");
  //                 onGetDashboardTop10Filter(top10);
  //                 onGetDashboardRecent10Filter(recent10);
  //               }}
  //             />
  //           </div>
  //         </div>
  //         <div className="w-full area bg-blue-50">
  //           {callOverviewLoading ? (
  //             <Loader height={200} />
  //           ) : callOverview?.length ? (
  //             <ReactApexChart
  //               {...prepareData()}
  //               type="area"
  //               height={200}
  //               width={"100%"}
  //             />
  //           ) : (
  //             <div className="w-full h-[200px] flex items-center justify-center ">
  //               <Icon
  //                 name="NoRecordFound"
  //                 height={60}
  //                 width={160}
  //                 alt="Logo"
  //               />
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-5 gap-5 ">
  //       {staticCardData?.map((val: any, index: number) => {
  //         return (
  //           <div key={index}>
  //             <DashboardCard {...val} count={callsData[val?.name]} smaller />
  //           </div>
  //         );
  //       })}
  //     </div>
  //     <div className="grid grid-cols-2 tsm:grid-cols-1 gap-4 ">
  //       <DonutChart
  //         loading={top10Loading}
  //         title="Top Users"
  //         name="top10"
  //         data={top10Users}
  //         options={top10userOptions}
  //         selected={donutSelected?.top10}
  //         onRefresh={onGetDashboardTop10Filter}
  //         onChange={(key: string, val: string) => {
  //           setTop10(val);
  //           handleTenantChange(key, val);
  //         }}
  //       />
  //       <DonutChart
  //         loading={recent10Loading}
  //         title="Recently added Users"
  //         name="recent10"
  //         data={recent10Users}
  //         options={recent10userOptions}
  //         selected={donutSelected?.recent10}
  //         onRefresh={onGetDashboardRecent10Filter}
  //         onChange={(key: string, val: string) => {
  //           setRecent10(val);
  //           handleTenantChange(key, val);
  //         }}
  //       />
  //     </div>
  //   </div>
  // );
  const NormalDashboardNewUI = () => (
    <div className="space-y-5 p-4 bg-white">

      <div className="w-full ">
        {/* OUTBOUND */}
        <section className="mb-8">
        
                {/* FILTER: Daily / Weekly / Monthly */}
<div className="mb-5 flex items-end justify-between">
    <h2 className="text-xs font-semibold tracking-widest text-slate-500">
            OUTBOUND OPERATIONS
          </h2>
  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
    {(["daily", "weekly", "monthly"] as const).map((key) => {
      const active = period === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => setPeriod(key)}
          className={[
            "px-5 py-2 text-sm font-medium rounded-md transition-all",
            active
              ? "bg-white text-slate-900 shadow border border-slate-200"
              : "text-slate-500 hover:text-slate-800",
          ].join(" ")}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      );
    })}
  </div>
</div>


          <div className="mt-4 grid grid-cols-4 gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {outboundCards?.map((c) => (
              <StatCard
                key={c.title}
                title={c.title}
                value={c.value}
                trend={c.trend}
                deltaText={c.deltaText}
                deltaCaption={c.deltaCaption}
                icon={c.icon}
                iconBgClassName={c.iconBgClassName}
                iconClassName={c.iconClassName}
                variant="compact"
              />
            ))}
          </div>
        </section>

        {/* INBOUND */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest text-slate-500">
            INBOUND OPERATIONS
          </h2>

          <div className="mt-4 grid grid-cols-5 gap-6 lg:grid-cols-3 xl:grid-cols-5">
            {inboundCards?.map((c) => (
              <StatCard
                key={c.title}
                title={c.title}
                value={c.value}
                icon={c.icon}
                iconBgClassName={c.iconBgClassName}
                iconClassName={c.iconClassName}
                variant="compact"
              />
            ))}
          </div>
        </section>

        {/* PERFORMANCE KPI */}
        <section className="mt-8">
          <h2 className="text-xs font-semibold tracking-widest text-slate-500">
            PERFORMANCE KPIs
          </h2>

          {/* ✅ GRID like your screenshot: 8 in a row on xl */}
          <div className="mt-4 grid grid-cols-8 gap-3  lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
            {kpis?.map((k) => (
              <PerformanceKpiCard
                key={k.key}
                icon={k.icon}
                iconClassName={k.iconClassName}
                value={k.value}
                label={k.label}
                trend={k.trend}
                percent={k.percent}
              />
            ))}
          </div>
        </section>

        {/* GRAPHS */}
        <section className="mt-8">
          <div className="grid grid-cols-12 items-stretch gap-6">
            {/* Left: 8 columns on xl+, full width below */}
            <div className="col-span-8 xl:col-span-8">
              <TrafficVolumeTrends className="h-full" data={trafficTrends} />
            </div>

            {/* Right: 4 columns on xl+, full width below */}
            <div className="col-span-4 xl:col-span-4">
              <TrendingDisposition className="h-full" data={dispositionTrends} />
            </div>
          </div>
        </section>

        {/* Graphs */}
        <section className="mt-8">
          <div className="grid grid-cols-12 items-stretch gap-6">
            <div className="col-span-4 lg:col-span-6">
              <CallDistribution className="h-full" data={callDistribution} />
            </div>
            {/* <div className="col-span-4 lg:col-span-6">
              <QueueVolume className="h-full" />
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );

  // const AccountDashboardComponent = () => (
  //   <div className="bg-white rounded-[30px] p-5">
  //     <AccountDashboard />
  //   </div>
  // );

  return (
    <DashboardProvider>
      <NormalDashboardNewUI />
    </DashboardProvider>
  );
};

export default Dashboard;
