"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import Legacy from "next/legacy/image";
import { Helmet } from "react-helmet";
// PROJECT IMPORTS
import {
  setHeaderValue,
  toggleDrawer,
  useDrawerOpen,
  useHeaderValue,
  useShowCallingIcon,
} from "@/redux/slice/commonSlice";
import { useAppDispatch } from "@/redux/hooks";
import Header from "./Header";
import SideBar from "./SideBar";
import CallingModal from "@/components/manager-admin/calling-functionality/CallingModal";
import { useAuth } from "@/contexts/hooks/useAuth";
import { getTenantPersonalization } from "@/redux/slice/master-admin/tenantSlice";
import getDomain from "@/utils/GetDoamin";
import { usePathname } from "next/navigation";
// ASSETS
const callIcon = "/assets/icons/white/call_white.svg";

const baseUrl = process.env.BASE_URL;
const FaviconIcon = process.env.COLLAPSED_LOGO;
// const FaviconIcon = "/assets/images/xcess-collapsed-logo.png";

/* ============================== MAIN LAYOUT ============================== */

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const isDrawerOpen = useDrawerOpen();
  const showCallingIcon = useShowCallingIcon();

  const pathname = usePathname(); // this replaces useRouter().pathname

  const headerValue = useHeaderValue();

  // useEffect(() => {
  //   if (!pathname.includes("create") && headerValue) {
  //     dispatch(setHeaderValue(""));
  //   }
  // }, [pathname, headerValue, dispatch]);
  useEffect(() => {
    const isCreate = pathname.includes("create");
    const isReports = pathname.startsWith("/reports");

    // UUID v4 regex (covers your edit URL)
    const isEdit = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(
      pathname
    );

    if (!isCreate && !isEdit && !isReports && headerValue) {
      dispatch(setHeaderValue(""));
    }
  }, [pathname, headerValue, dispatch]);


  const domain = getDomain();

  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleSideBar = () => {
    dispatch(toggleDrawer(!isDrawerOpen));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [personalizeData, setPersonalizeData] = useState<any>({});

  const getTenantPersonalizeData = async () => {
    setLoading(true);
    try {
      const res: any = await dispatch(
        getTenantPersonalization(domain)
      ).unwrap();
      if (res?.statusCode === 200) {
        setPersonalizeData(res?.data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Tenant Personlize Data Err =-=>", err);
    }
  };

  useLayoutEffect(() => {
    getTenantPersonalizeData();
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Helmet — meta stuff */}
      {personalizeData?.title && personalizeData?.faviconfile ? (
        <Helmet>
          <title>{personalizeData.title}</title>
          <link
            rel="icon"
            type="image/svg"
            href={baseUrl + `/tenant/download/${personalizeData?.faviconfile}`}
          />
        </Helmet>
      ) : (
        <Helmet>
          <title>{process.env.TITLE}</title>
          <link rel="icon" href={FaviconIcon} />
        </Helmet>
      )}

      {/* Hidden Audio */}
      <audio id="mediaElement" controls className="hidden"></audio>

      {/* Header */}
      <Header
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleSideBar}
        title={headerValue}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleSideBar} />

        {/* Main Content */}
        <main
          className={`transition-all bg-main-background flex-1 overflow-auto pl-5 pr-5 pb-[20px] pt-[95px] tsm:pt-[130px] rounded-[30px] mt-[15px] mr-[20px] ${isDrawerOpen ? "ml-[260px]" : "ml-[80px]"
            } tsm:pl-3 relative`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1  bg-white rounded-[25px] overflow-auto scrollbar-hide">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center py-3 text-xs text-txt-primary">
        {showCallingIcon && user?.role === "manager" && (
          <div className="flex items-center justify-center bg-primary rounded-full h-[44px] w-[44px] 3xl:h-[54px] 3xl:w-[54px] fixed right-7 bottom-8 z-50 drop-shadow-lg cursor-pointer hover:bg-opacity-80">
            <div className="relative w-[24px] h-[24px] 3xl:w-[28px] 3xl:h-[28px]">
              <Legacy src={callIcon} alt="call" layout="fill" />
            </div>
          </div>
        )}
        {personalizeData?.footer ? (
          <span>
            ©{new Date().getFullYear()}.{personalizeData.footer}
          </span>
        ) : (
          <span>
            ©{new Date().getFullYear()}.{process.env.FOOTER}
          </span>
        )}
      </div>

      {/* Calling Modal */}
      {user?.role === "manager" && (
        <CallingModal
          showModal={showModal}
          setShowModal={setShowModal}
          onCancleClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
