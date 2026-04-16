//PROJECT IMPORT
import CreateTimeConditionForm from "@/components/tenant-admin/comman/timeCondition/CreateTimeConditionForm";

/* ============================== TIME CONDITION CREATE ============================== */

const page = () => {
    return (
        <CreateTimeConditionForm
            routPath="manager-did/forwarding"
            managerName="timecondition"
        />
    );
};

export default page;
