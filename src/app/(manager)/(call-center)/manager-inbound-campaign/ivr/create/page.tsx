// PROJECT IMPORT
import CreateIvrForm from "@/components/tenant-admin/call-center/ivr/CreateIvrForm";

const page = () => {
  return (
    <CreateIvrForm promptPath="manager-inbound-campaign" managerName="ivr" />
  );
};

export default page;
