//PROJECT IMPORT
import CreateIvrForm from "@/components/tenant-admin/call-center/ivr/CreateIvrForm";

/* ============================== IVR CREATE ============================== */

const page = () => {
  return (
    <CreateIvrForm promptPath="manager-time-condition" managerName="ivr" />
  );
};

export default page;
