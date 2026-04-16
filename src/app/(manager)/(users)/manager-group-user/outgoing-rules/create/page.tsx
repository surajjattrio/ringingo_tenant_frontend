//PROJECT IMPORT
import CreateTenantOutgoingForm from "@/components/tenant-admin/comman/outgoing-rules/CreateTenantOutgoingForm";

/* ============================== TENANT OUTGOING RULE CREATE ============================== */

const page = () => {
    return (
        <CreateTenantOutgoingForm
            trunkPath="manager-group-user"
            managerName="outgoing-rules"
        />
    );
};

export default page;
