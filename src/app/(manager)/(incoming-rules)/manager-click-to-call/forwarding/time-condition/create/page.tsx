//PROJECT IMPORT
import CreateTimeConditionForm from "@/components/tenant-admin/comman/timeCondition/CreateTimeConditionForm";

/* ============================== TIME CONDITION CREATE ============================== */

const page = () => {
    return (
        <CreateTimeConditionForm
            routPath="manager-click-to-call/forwarding"
            managerName="timecondition"
        />
    );
};

export default page;
