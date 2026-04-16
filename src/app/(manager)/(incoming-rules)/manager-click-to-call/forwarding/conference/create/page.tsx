//PROJECT IMPORT
import CreateConferenceForm from "@/components/tenant-admin/comman/conference/CreateConferenceForm";

/* ============================== CONFERENCE CREATE ============================== */

const page = () => {
  return (
    <CreateConferenceForm
      promptPath="manager-click-to-call/forwarding"
      managerName="conference"
    />
  );
};

export default page;
