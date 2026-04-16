//PROJECT IMPORT
import CreateIvrForm from "@/components/tenant-admin/call-center/ivr/CreateIvrForm";

/* ============================== IVR CREATE ============================== */

const page = () => {
  return (
    <CreateIvrForm
      promptPath="manager-click-to-call/forwarding"
      managerName="ivr"
    />
  );
};

export default page;
