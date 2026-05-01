"use client";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui-components";
import { IconKey } from "@/components/ui-components/Icon";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setHeaderValue } from "@/redux/slice/commonSlice";

const reports: { title: string; url: string; icon: IconKey }[] = [
  { title: "CDRs", url: "manager-reports/manager-cdrs", icon: "CDRs" },
  { title: "Live Calls", url: "manager-reports/manager-live-call", icon: "liveCalls" },
  { title: "Missed Call", url: "manager-reports/manager-missedcall", icon: "MissedCall" },
  { title: "Call Queue Report", url: "manager-reports/manager-call-queue", icon: "CallQueue" },
  { title: "Dropped Calls Report", url: "manager-reports/manager-dropped-calls", icon: "DroppedCalls" },
  { title: "Realtime Report", url: "manager-reports/manager-realtime-report", icon: "Realtimereport" },
  { title: "Lead Report", url: "manager-reports/manager-lead-report", icon: "LeadReport" },
  { title: "Campaign Report", url: "manager-reports/manager-campaign-report", icon: "CampaignReport" },
  { title: "VoiceBroadcast Report", url: "manager-reports/manager-voicebroadcast-report", icon: "Voicebroadcasting" },
  { title: "User Performance", url: "manager-reports/manager-user-performance", icon: "UserPerformance" },
  { title: "Login Logout Report", url: "manager-reports/manager-loginLogout", icon: "loginlogoutreport" },
  { title: "Voicemail", url: "manager-reports/manager-voicemail", icon: "Voicemail" },
  { title: "Sticky Agent Report", url: "manager-reports/manager-sticky-agent-report", icon: "StickyAgentReport" },
  // { title: "Recordings", url: "reports/manager-recording", icon: "Recording" },
  { title: "Dids", url: "manager-reports/manager-did-report", icon: "DIDCALLERID" },
  { title: "Omni-Channel Report", url: "manager-reports/manager-omni-channel-report", icon: "MessagingChannel" },
  // { title: "IVR Report", url: "reports/manager-ivr-report", icon: "AllowedTransferIVR" },
  { title: "CSAT Report", url: "manager-reports/manager-csat-report", icon: "Csat" },
];

export default function ReportsPage() {
   const dispatch = useAppDispatch();
  useEffect(() => {
    // Reports landing page par child title clear
    dispatch(setHeaderValue(""));
  }, [dispatch]);
  const router = useRouter();
  return (
    <div className="px-6 py-6 min-h-screen bg-[#f3f6fa]">
  <div
    className="grid gap-6 justify-center"
    style={{
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 310px))",
    }}
  >
    {reports?.map((report) => (
      <div
        key={report.url}
        className="cursor-pointer bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center border border-gray-100 transition  hover:shadow-xl hover:border-blue-400 active:ring-4 active:ring-blue-30"
        style={{
          background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)",
          minHeight: 180,
          position: "relative",
          overflow: "hidden",
           // optional, but not needed if grid is set
        }}
        
        // onClick={() => router.push(report.url)}
        onClick={() => {
  dispatch(setHeaderValue(report.title)); // 👈 child title
  router.push(`/${report.url}`);          // 👈 correct route
}}
      >
        <div className="mb-4">
          <span className="inline-block w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-4xl text-blue-200">
            <Icon name={report.icon} height={20} width={30} />
          </span>
        </div>
        <div className="text-lg font-bold text-gray-600 text-center">{report.title}</div>
      </div>
    ))}
  </div>
</div>
    
    
  );
}
