"use client";
import { useState } from "react";
import RealTimeDB from "@/components/tenant-admin/realtime-dashboard/RealTimeDB";
import LeadGroupRealtimeDashboard from "@/components/tenant-admin/realtime-dashboard/LeadGroupRealtimeDashboard";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"calls" | "leads">("calls");

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mx-5 mt-4">
        <button
          onClick={() => setActiveTab("calls")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === "calls"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Call Realtime
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === "leads"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Lead Group Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "calls" ? <RealTimeDB /> : <LeadGroupRealtimeDashboard />}
    </div>
  );
};

export default Page;