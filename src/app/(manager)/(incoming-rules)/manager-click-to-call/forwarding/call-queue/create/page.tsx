//PROJECT IMPORT
import CreateCallQueueForm from "@/components/tenant-admin/call-center/call-queue/CreateCallQueueForm";

/* ============================== CALL QUEUE CREATE ============================== */

const page = () => {
  return (
    <CreateCallQueueForm
      promptPath="manager-click-to-call/forwarding"
      managerName="call-queue"
    />
  );
};

export default page;
