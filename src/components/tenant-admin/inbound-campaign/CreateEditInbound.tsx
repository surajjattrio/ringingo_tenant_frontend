"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { useInboundData } from "@/redux/slice/tenant-admin/inboundSlice";
import { callerIdGroupOptionsGet } from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { useInbound } from "@/contexts/hooks/useInbound";
import General from "./General";
import { ManagerNameTypes } from "@/types/formTypes";
import { setActiveTab } from "@/redux/slice/commonSlice";
import Preset from "./Preset";
import HangupStatuses from "./HangupStatuses";

// DATA
const tabsData = [
  { title: "General", component: General },
   { title: "Hangup Statuses", component: HangupStatuses },
  { title: "Preset", component: Preset },
];


// DATA
const CreateEditInbound = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inbound = useInboundData();

  const { loading, handleSubmit, resetForm } = useInbound();

  useEffect(() => {
    onGetCallerIdGroupOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching Caller ID Group Options
  const onGetCallerIdGroupOptions = async () => {
    try {
      await dispatch(callerIdGroupOptionsGet());
    } catch (err) {
      console.error("Get Caller ID Group Options Err =-=>", err);
    }
  };

  return (
    <CardForm
      id={id}
      name="ic"
      managerName={managerName}
      tabsData={id ? tabsData : []}
      length={id ? 0 : inbound?.count}
      title={id ? "Edit Inbound Campaign" : "Create Inbound Campaign"}
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        resetForm();
        dispatch(setActiveTab(0));
        router.back();
      }}
    >
      <General />
    </CardForm>
  );
};

export default CreateEditInbound;
