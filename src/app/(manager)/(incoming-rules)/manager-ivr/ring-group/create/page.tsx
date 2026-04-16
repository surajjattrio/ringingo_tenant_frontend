//PROJECT IMPORT
import CreateRingForm from "@/components/tenant-admin/call-center/ring-group/CreateRingForm";

/* ============================== RING GROUP CREATE ============================== */

const page = () => {
  return <CreateRingForm promptPath="manager-ivr" managerName="ringgroup" />;
};

export default page;
