"use client";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { useBlendedData } from "@/redux/slice/tenant-admin/blendedSlice";
import { useBlended } from "@/contexts/hooks/useBlended";
import { setActiveTab } from "@/redux/slice/commonSlice";
import General from "./General";
import LeadGroup from "./LeadGroup";
import DialableStatus from "./DialableStatus";
import HangupStatuses from "./HangupStatuses";
import Preset from "./Preset";
import { ManagerNameTypes } from "@/types/formTypes";

// DATA
const tabsData = [
  { title: "General", component: General },
  { title: "Lead Group", component: LeadGroup },
  { title: "Dialable Status", component: DialableStatus },
  { title: "Hangup Statuses", component: HangupStatuses },
    { title: "Preset", component: Preset },
];

const CreateEditBlended = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const blended = useBlendedData();

  const { loading, handleSubmit, resetForm } = useBlended();

  return (
    <CardForm
      id={id}
      name="oc"
      managerName={managerName}
      tabsData={id ? tabsData : []}
      length={id ? 0 : blended?.count}
      title={id ? "Edit Blended Campaign" : "Create Blended Campaign"}
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

export default CreateEditBlended;
