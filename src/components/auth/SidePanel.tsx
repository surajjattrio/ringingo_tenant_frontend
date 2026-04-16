"use client";
import React, { useLayoutEffect, useState } from "react";

import { Icon } from "../ui-components";
import {
  getTenantPersonalization
} from "@/redux/slice/master-admin/tenantSlice";
import getDomain from "@/utils/GetDoamin";
import { useAppDispatch } from "@/redux/hooks";

/* ============================== SIDE PANEL ============================== */

const baseUrl = process.env.BASE_URL;

/* ============================== SIDE PANEL ============================== */

const SidePanel = () => {

  const dispatch = useAppDispatch();
  const domain = getDomain();

    const [loading, setLoading] = useState<boolean>(false);
    const [personalizeData, setPersonalizeData] = useState<any>({});

    const getTenantPersonalizeData = async () => {
      setLoading(true);
      try {
          const res: any = await dispatch(getTenantPersonalization(domain)).unwrap();
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
    <>
      <div className="tsm:py-14 flex flex-col justify-center bg-secondary items-center">
        <div className="flex flex-col items-center">
          <div>
            <Icon name="MenuLogoExpandedImage" width={250} height={596 / 2} alt="Logo" />
          </div>
          <div className="flex flex-col items-center pt-10">
            <div className="flex flex-col items-center font-bold text-xl space-y-2 text-white">
              <span>Your Unified</span>
              <span>Communications Platform.</span>
            </div>
            <div className="max-w-[540px] pt-2 text-white">
              <p className="text-center text-sm font-normal">
                Smart Contact Center platform for High performance teams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
