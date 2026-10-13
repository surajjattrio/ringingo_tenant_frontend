"use client";
import React, { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Icon } from "@/components/ui-components";
import { openDrawer, useDrawerOpen } from "@/redux/slice/commonSlice";
import Link from "next/link"


import { getTenantPersonalization } from "@/redux/slice/master-admin/tenantSlice";
import { useAppDispatch } from "@/redux/hooks";
import getDomain from "@/utils/GetDoamin";

const LogoSection = ({
  hover,
  isDrawerOpen,
  toggleDrawer,
}: {
  hover: boolean;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const isdrawerOpen = useDrawerOpen();

  const domain = "cc.ringingo.com";
  // const domain = getDomain();

  const [loading, setLoading] = useState<boolean>(false);
  const [personalizeData, setPersonalizeData] = useState<any>({});


  const isOpen = isDrawerOpen || hover;

  useLayoutEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res: any = await dispatch(getTenantPersonalization(domain)).unwrap();
        if (res?.statusCode === 200) {
          setPersonalizeData(res?.data);
        }
      } catch (err) {
        console.error("Personalization Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoClick = () => {
    if (user?.role === "tenant") {
      router.push("/tenant-dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    // <div
    //   className={`flex items-center h-[55px] border-b-1 border-dark-700 px-4  transition-all duration-300 ${
    //     isOpen ? "justify-between" : "justify-center"
    //   }`}
    // >
    <div
      className={`relative  flex items-center justify-between h-[60px]  border-[#E5E7EB] px-3 ${isdrawerOpen ? "pl-4" : ""
        }`}
    >
      <span
        className={`${isdrawerOpen
          ? "absolute bottom-0 left-5 w-[185px] border-b border-[#E5E7EB]"
          : "absolute bottom-0 left-4 w-[30px] border-b border-[#E5E7EB]"
          }`}
      ></span>

      {/* Logo Section */}
      <div
        className="cursor-pointer flex items-center gap-2"
        onClick={handleLogoClick}
      >
        {isOpen ? (
          <Link href={`${process.env.BASE_URL}`}>
            {/* <img
              src={`${process.env.BASE_URL}/tenant/download/${personalizeData?.expandedfile}`}
              alt="Expanded Logo"
              className="w-[150px] h-10 object-contain transition-all duration-300"
            /> */}
            <Icon
              name="NewLogo"
              height={40}
              width={180}
              alt="Logo"
            />
          </Link>
        ) : (
          <Link href={`${process.env.BASE_URL}`}>
            {/* <img
              src={`${process.env.BASE_URL}/tenant/download/${personalizeData?.collapsedfile}`}
              alt="Collapsed Logo"
              className="w-10 h-10 object-contain transition-all duration-300"
            /> */}
            <Icon
              name="CollapsedNewLogo"
              height={20}
              width={40}
              alt="Logo"
            />
          </Link>
        )}
      </div>


      {/* Sidebar Toggle Button */}
      {/* {isOpen && (
        <button
          onClick={toggleDrawer}
          className="p-2 rounded-md text-white hover:text-primary transition-all duration-300 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Icon
            name="Menu"
            width={24}
            height={24}
            className="text-white transition-transform duration-300 transform hover:rotate-90"
          />
        </button>
      )} */}
      <div
        onClick={() => {
          dispatch(openDrawer(!isdrawerOpen));
        }}
        // cursor-pointer p-1 hover:bg-white hover:shadow-sm rounded-[36px] transition-all duration-200
        className={` ${!isdrawerOpen &&
          "fixed left-[54px] top-[43px] bg-white shadow-sm z-30 rounded-[36px] p-[3px] hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200"
          }`}
      >

        <div
          className={`transition-transform duration-200 ${isdrawerOpen
            ? "rotate-0 fixed left-[225px]  top-[43px] bg-white cursor-pointer  rounded-[36px] p-[3px]  hover:bg-white hover:shadow-sm"
            : "rotate-180"
            }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 19l-7-7 7-7"
              stroke={isdrawerOpen ? "#6B7280" : "#111827"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
