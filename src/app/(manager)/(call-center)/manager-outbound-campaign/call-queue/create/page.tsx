// PROJECT IMPORT
import CreateCallQueueForm from "@/components/tenant-admin/call-center/call-queue/CreateCallQueueForm";

const page = () => {
  return (
    <CreateCallQueueForm
      promptPath="manager-outbound-campaign"
      managerName="call-queue"
    />
  );
};

export default page;
