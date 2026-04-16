// PROJECT IMPORT
import CreateRingForm from "@/components/tenant-admin/call-center/ring-group/CreateRingForm";

const page = () => {
  return (
    <CreateRingForm
      promptPath="manager-blended-campaign"
      managerName="ringgroup"
    />
  );
};

export default page;
