// PROJECT IMPORT

import CreateEditTenantOutgoingForm from "@/components/tenant-admin/outgoing-rules/CreateEditTenantOutgoingForm";

/* ============================== TENANT CREATE ============================== */

const page = () => {
  return (
    <>
      <CreateEditTenantOutgoingForm managerName="outgoing-rules" />
    </>
  );
};

export default page;
