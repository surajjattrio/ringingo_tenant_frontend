"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useSideBarData } from "@/redux/slice/commonSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import LoginToPopup from "@/components/popups/LoginToPopup";
import NotificationPopup from "@/components/popups/NotificationPopup";
import LogoutPopup from "@/components/popups/LogoutPopup";
import { tenantHeaderGetAll } from "@/redux/slice/master-admin/tenantSlice";
import Modal from "@/components/modals/Modal";
import { Danger, Success } from "@/redux/services/toasterServices";
import { clearAllData, clearTenantData } from "@/helperFunctions";
import { Avatar, BreadCrumbs, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";

interface HeaderProps {
  isDrawerOpen: boolean;
  toggleDrawer: any;
  title: string;
}

/* ============================== HEADER ============================== */

const Header = (props: HeaderProps) => {
  const { isDrawerOpen, toggleDrawer, title } = props;
  const { user, logout, tenantLogin, switchMaster } = useAuth();
console.log("HEADER PROP TITLE =>", title);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const sideBarData = useSideBarData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const [switchVisible, setSwitchVisible] = useState<any>(false);
  const [filter, setFilter] = useState<any>({
    search: "",
  });

  // Dashboard switch state
  const [activeTab, setActiveTab] = useState<string>("normal");

  const pathname = usePathname();
  const array = pathname.split("/");

  // Check if we're on the tenant dashboard page
  // const isTenantDashboard = pathname.includes("tenant-dashboard");
  // const isManagerDashboard = pathname.includes("manager-dashboard");
  // const shouldShowDashboardSwitch = isTenantDashboard || isManagerDashboard;

  // Sync dashboard switch state with localStorage
  // useEffect(() => {
  //   if (shouldShowDashboardSwitch) {
  //     const savedTab = localStorage.getItem("dashboard-tab");
  //     if (savedTab) {
  //       setActiveTab(savedTab);
  //     }
  //   }
  // }, [shouldShowDashboardSwitch]);

  // Listen for changes from dashboard page
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const savedTab = localStorage.getItem("dashboard-tab");
  //     if (savedTab && savedTab !== activeTab) {
  //       setActiveTab(savedTab);
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, [activeTab]);

  useEffect(() => {
    if (user?.role !== "master_admin") return;
    getTenantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filter, user?.role]);

  const getTitle = () => {
    const data = sideBarData?.sideBarTitles?.find(
      (val: any) => val?.url === `/${array[1]}`
    );
    return data?.title || "";
  };

  const handleNavigateMain = () => {
    const mainRoute = getMainRoute();
    router.push(mainRoute);
  };

  const getMainRoute = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.length ? `/${segments[0]}` : "/";
  };

  const getTenantData = useDebouncedCallback(async () => {
    try {
      const payload = { ...filter };
      await dispatch(tenantHeaderGetAll(payload)).unwrap();
    } catch (e: any) {
      console.error("Get Tenant Error --->", e.message);
    }
  }, 500);

  const onLogoutClick = () => {
    if (user?.role === "manager") Cookies.set("role", "manager");
    clearAllData(dispatch);
    logout();
    setShowLogoutPopup(false);
  };

  const onSelectUser = async () => {
    const uuid = switchVisible?.uuid;
    try {
      const res: any = await tenantLogin(uuid);
      if (res?.statusCode === 200) {
        Success(res?.data);
      } else {
        Danger(res?.data);
      }
    } catch (err) {
      console.error("Tenant Login Err =-=>", err);
    }
  };

  const SwitchBack = () => {
    clearTenantData(dispatch);
    const res: any = switchMaster();
    if (res?.access_token) {
      Success("Successfully switched back to master admin");
    }
  };

  // Dashboard Switch Component
  // const DashboardSwitch = () => {
  //   if (!shouldShowDashboardSwitch) return null;

  //   const handleTabChange = (tab: string) => {
  //     setActiveTab(tab);
  //     localStorage.setItem("dashboard-tab", tab);
  //     // Dispatch a custom event to notify the dashboard page
  //     window.dispatchEvent(new CustomEvent("dashboard-tab-changed", { detail: { tab } }));
  //   };

  //   return (
  //     <div className="flex items-center gap-2 mr-4">
  //       {/* Switch Toggle */}
  //       <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shadow-inner">
  //         <button
  //           onClick={() => handleTabChange("normal")}
  //           className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group relative ${
  //             activeTab === "normal"
  //               ? "bg-white text-blue-600 shadow-lg transform scale-105"
  //               : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  //           }`}
  //           title="Normal Dashboard - Standard view with charts and statistics"
  //         >
  //           <Icon 
  //             name="Dashboard" 
  //             width={14} 
  //             height={14} 
  //             className={activeTab === "normal" ? "text-blue-600" : "text-gray-500"}
  //           />
  //           <span className="hidden sm:inline">Normal</span>
            
  //           {/* Hover Tooltip */}
  //           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
  //             Normal Dashboard
  //             <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
  //           </div>
  //         </button>
  //         <button
  //           onClick={() => handleTabChange("account")}
  //           className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group relative ${
  //             activeTab === "account"
  //               ? "bg-white text-blue-600 shadow-lg transform scale-105"
  //               : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  //           }`}
  //           title="Account Dashboard - SIP devices, managers, agents, and campaigns overview"
  //         >
  //           <Icon 
  //             name="SipDevices" 
  //             width={14} 
  //             height={14} 
  //             className={activeTab === "account" ? "text-blue-600" : "text-gray-500"}
  //           />
  //           <span className="hidden sm:inline">Account</span>
            
  //           {/* Hover Tooltip */}
  //           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
  //             Account Dashboard
  //             <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
  //           </div>
  //         </button>
  //         <button
  //           onClick={() => handleTabChange("realtime")}
  //           className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 group relative ${
  //             activeTab === "realtime"
  //               ? "bg-white text-blue-600 shadow-lg transform scale-105"
  //               : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  //           }`}
  //           title="Real-time Dashboard - Live call monitoring and agent status"
  //         >
  //           <Icon 
  //             name="ActiveCall" 
  //             width={14} 
  //             height={14} 
  //             className={activeTab === "realtime" ? "text-blue-600" : "text-gray-500"}
  //           />
  //           <span className="hidden sm:inline">Realtime</span>
            
  //           {/* Hover Tooltip */}
  //           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
  //             Real-time Dashboard
  //             <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
  //           </div>
  //         </button>
  //       </div>

  //       {/* Status Indicator */}
  //       <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
  //         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  //         <span className="text-xs font-medium text-green-700">
  //           {activeTab === "normal" ? "Live" : activeTab === "account" ? "Account" : "Real-time"}
  //         </span>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <div
        className={`fixed top-3 mt-5 mx-[20px] right-5 h-[55px] bg-white rounded-full z-20 border-dark-700 transition-all flex ${isDrawerOpen ? "left-[260px]" : "left-[80px]"
          }`}
      >
        {!isDrawerOpen && (
          <div className="flex items-center py-3 tsm:hidden">
            <div
              onClick={() => {
                toggleDrawer();
              }}
            >
              {/* <Icon
                className="cursor-pointer"
                name="ArrowRightDouble"
                alt="directionRight"
                width={34}
                height={34}
              /> */}
            </div>
          </div>
        )}
        <div
          className={`flex justify-between items-center py-3 px-8 tsm:px-3 w-full  ${!isDrawerOpen && "pl-4"
            }`}
        >
          
          <div className="hidden tsm:flex tsm:gap-3">
            
            <Icon
              alt="smallLogo"
              name="MenuLogoCollapsedImage"
              width={25}
              height={25}
              onClick={() => {
                if (user?.role === "tenant") {
                  router.push("tenant-dashboard");
                } else if (user?.role === "manager") {
                  router.push("manager-dashboard");
                }
                {
                  router.push("/");
                }
              }}
              
            />
            
            <Icon
              alt="menu"
              name="Menu"
              width={28}
              height={28}
              onClick={() => {
                toggleDrawer();
              }}
            />
          </div>
          <div className="tsm:hidden flex items-center gap-2">
            <p className="text-base font-bold text-gray-800" onClick={handleNavigateMain}
            >{getTitle()}</p>
             {/* <BreadCrumbs />  */}
            {title &&
              <>
                <Icon
                  name="ChevronRight"
                  className="w-3 h-3 mt-[2px]" // Adjust size & alignment
                />
                <span className="text-sm font-semibold text-gray-500">{title}</span>
              </>
            }
          </div>

          {/* <div className="tsm:hidden mr-[800px]">
            <p className="text-base font-bold ">{getTitle()}</p>
           
          </div> */}
          <div className="flex items-center">
            {!user?.noSwitch &&
              (user?.role === "master_admin" ? (
                <div
                  className="p-2 rounded-full bg-dark-800 mr-2.5 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Icon name="Data" alt="dataIcon" width={20} height={20} />
                </div>
              ) : (
                <div
                  className="p-2 rounded-full bg-dark-800 mr-2.5 cursor-pointer"
                  onClick={() => {
                    SwitchBack();
                  }}
                >
                  <Icon alt="Switch" name="SwitchRed" width={20} height={20} />
                </div>
              ))}
            {/* <div
              className="p-2 rounded-full bg-dark-800 mr-4 cursor-pointer"
              onClick={() => setShowNotification(!showNotification)}
            >
              <Icon
                name="Notification"
                alt="notification"
                width={20}
                height={20}
              />
            </div> */}

            {/* Dashboard Switch - Only show on tenant dashboard */}
            {/* <DashboardSwitch /> */}

            <div
              className="flex gap-3 cursor-pointer"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            >
              <div className="rounded-full">
                <Avatar text={user?.name} width={35} height={35} />
              </div>
              <div className="flex flex-col tsm:hidden">
                <div>
                  <p className="text-[11px] font-normal text-txt-primary">
                    {user?.title || ""}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-bold mr-1.5">{user?.name || ""}</p>
                  <Icon
                    alt="arrow-down"
                    name="ArrowDown"
                    width={14}
                    height={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`hidden fixed tsm:flex flex-col top-[55px] h-[60px] gap-2 bg-white w-full z-10 border-b-2 px-3 justify-center transition-all`}
      >
        <div>
          <p className="text-base font-bold">{getTitle()}</p>
          {/* <BreadCrumbs /> */}
        </div>
      </div>
      <LoginToPopup
        className="z-10 absolute top-[76px] right-8"
        visible={isOpen}
        filter={filter}
        setFilter={setFilter}
        onClick={() => setIsOpen(false)}
        onSelectUser={(uuid: string, name: string) =>
          setSwitchVisible({ uuid, name })
        }
      />
      <NotificationPopup
        visible={showNotification}
        className="z-10 absolute top-[76px] right-8"
        onClick={() => setShowNotification(false)}
      />
      <LogoutPopup
        visible={showLogoutPopup}
        className="z-10 absolute top-[76px] right-6"
        onCancelClick={() => setShowLogoutPopup(false)}
        onLogoutClick={() => onLogoutClick()}
        onProfileClick={() => {
          if (user?.role === "tenant") {
            router.push("/tenant-profile");
          } else if (user?.role === "manager") {
            router.push("/manager-profile");
          } else {
            router.push("/profile");
          }
          setShowLogoutPopup(false);
        }}
      />
      <Modal
        visible={!!switchVisible}
        title="Masquerading User"
        content={`You are masquerading another account "${switchVisible?.name}".`}
        doneText="Switch User"
        cancelText="Cancel"
        onCancelClick={() => setSwitchVisible(false)}
        onDoneClick={() => onSelectUser()}
      />
    </>
  );
};

export default Header;
