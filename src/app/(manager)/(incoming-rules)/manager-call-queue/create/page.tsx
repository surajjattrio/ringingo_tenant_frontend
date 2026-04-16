//PROJECT IMPORT
import CreateEditCallQueueForm from "@/components/tenant-admin/call-queue/CreateEditCallQueueForm";

/* ============================== TENANT CREATE ============================== */

const page = () => {
    return (
        <>
            <CreateEditCallQueueForm managerName="call-queue" />
        </>
    );
};

export default page;
