//PROJECT IMPORT
import CreateConferenceForm from "@/components/tenant-admin/comman/conference/CreateConferenceForm";

/* ============================== CONFERENCE CREATE ============================== */

const page = () => {
    return (
        <CreateConferenceForm
            promptPath="manager-did/forwarding"
            managerName="conference"
        />
    );
};

export default page;
