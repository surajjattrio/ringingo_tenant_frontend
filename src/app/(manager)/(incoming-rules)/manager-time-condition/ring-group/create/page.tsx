//PROJECT IMPORT
import CreateRingForm from "@/components/tenant-admin/call-center/ring-group/CreateRingForm";

/* ============================== RING GROUP CREATE ============================== */

const page = () => {
  return (
    <CreateRingForm
      promptPath="manager-time-condition"
      managerName="ringgroup"
    />
  );
};

export default page;
