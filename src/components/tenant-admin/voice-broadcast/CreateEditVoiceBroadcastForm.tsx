"use client";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import General from "./General";
import LeadGroup from "./LeadGroup";
import Disposition from "./Disposition";
import { CardForm } from "@/components/ui-components";
import { useVoiceBroadcast } from "@/contexts/hooks/useVoiceBroadcast";
import { useVoiceBroadcastData } from "@/redux/slice/tenant-admin/voiceBroadcastSlice";
import { ManagerNameTypes } from "@/types/formTypes";

const tabsData = [
  { title: "General", component: General },
  { title: "Lead Group", component: LeadGroup },
  { title: "Disposition", component: Disposition },
];

const CreateEditVoiceBroadcastForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const router = useRouter();
  const voiceBroadcast = useVoiceBroadcastData();
  const { loading, handleSubmit, resetForm } = useVoiceBroadcast();

  return (
    <CardForm
      id={id}
      name="vb"
      managerName={managerName}
      tabsData={id ? tabsData : []}
      length={id ? 0 : voiceBroadcast?.count}
      title={id ? "Edit Voice Broadcast" : "Create Voice Broadcast"}
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        resetForm();
        router.back();
      }}
    >
      <General />
    </CardForm>
  );
};

export default CreateEditVoiceBroadcastForm;
