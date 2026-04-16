// PROJECT IMPORT
import CreateEditIpMappingForm from "@/components/tenant-admin/ip-mapping/CreateEditIpMapping";

/* ============================== TENANT CREATE ============================== */

const page = () => {
  return (
    <>
      <CreateEditIpMappingForm managerName="ip-mapping" />
    </>
  );
};

export default page;
