// PROJECT IMPORT
import CreateRingForm from "@/components/tenant-admin/call-center/ring-group/CreateRingForm";

const page = () => {
  return (
    <CreateRingForm
      promptPath="manager-inbound-campaign"
      managerName="ringgroup"
    />
  );
};

export default page;
