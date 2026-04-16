export const staticCardData = [
  { icon: "CallDashboard", name: "total", text: "Total Calls" },
  {
    icon: "CallIncomingDashboard",
    name: "totalIncoming",
    text: "Total Incoming Calls",
  },
  { icon: "CallOutgoingDashboard", name: "totalOutgoing", text: "Total Outgoing Calls" },
  { icon: "CallCloseDashboard", name: "failedIncoming", text: "Missed Calls" },
  {
    icon: "CallErrorDashboard",
    name: "failedOutgoing",
    text: "Failed Outgoing Calls",
  },
];

export const staticMainCardData = [
  {
    name: "lc",
    refreshKey: "refresh-live-calls",
    icon: "CallingWhite",
    text: "Live Calls",
    status: "up",
    buttonText: "View List",
    navigate:"/tenant-live-call",
  },
  {
    name: "totalRegister",
    refreshKey: "refresh-total-extension",
    icon: "CallPlus",
    text: "Registered SIP Devices",
    status: "down",
  },
];
