import { useEffect } from "react";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    tenantTrunkOptionsGet,
    useTenantTrunkOptions,
} from "@/redux/slice/tenant-admin/tenantTrunkSlice";
import { didOptionsGet, useDidOptions } from "@/redux/slice/tenant-admin/didSlice";
import { Button, Input, InputNumber, Select } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// TYPES
interface TenantAddRulesProps {
    rulesData: any;
    setRulesData: React.Dispatch<React.SetStateAction<any>>;
    trunkPath: string;
}

// DATA
const initialRulesValues = {
    length: "0",
    prefix: "",
    strip: "",
    prepend: "",
    trunk_uuid: "",
    failover_trunk_1_uuid: "",
    failover_trunk_1_call_id: "",
    failover_trunk_2_uuid: "",
    failover_trunk_2_call_id: "",
};

const TenantAddRules = (props: TenantAddRulesProps) => {
    const { rulesData, setRulesData, trunkPath } = props;
    const dispatch = useAppDispatch();
    const trunkOptions = useTenantTrunkOptions();
    const didOptions = useDidOptions();
    const didCreatePath = trunkPath?.startsWith("manager") ? "/manager-did/create" : "/tenant-did/create";

    useEffect(() => {
        onGetTrunkOptions();
        onGetDidOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Remove Select Trunk in Failover Trunk Dropdownd
    const getTrunkOptions = (uuids: string[]) =>
        trunkOptions?.filter((val: any) => !uuids?.includes(val?.value));

    // Fetching Trunk Options
    const onGetTrunkOptions = async () => {
        try {
            await dispatch(tenantTrunkOptionsGet());
        } catch (err) {
            console.error("Get Trunk Options Err =-=>", err);
        }
    };

    // Fetching this tenant's DID list — used as the Failover Trunk Caller ID options (pick, don't type)
    const onGetDidOptions = async () => {
        try {
            await dispatch(didOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    // Trigger When - Input or Select Value Change
    const handleChange = (key: string, val: string, idx: number) => {
        let newData = [...rulesData];
        newData[idx] = { ...newData[idx], [key]: val };
        setRulesData(newData);
    };

    // Add New Row to Rules List
    const onAdd = () => {
        setRulesData([...rulesData, initialRulesValues]);
    };

    // Delete Rules Row
    const onDelete = (idx: number) => {
        let newData = [...rulesData];
        newData.splice(idx, 1);
        setRulesData([...newData]);
    };

    return (
        <>
            <div className="pt-7 pb-4">
                <span className="text-sm font-bold">Extension</span>
            </div>
            {rulesData?.length &&
                rulesData?.map((val: any, index: number, array: any) => {
                    return (
                        <>
                            <div className="rounded-md bg-dark-950 pt-5 pb-5 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4 relative">
                                <InputNumber
                                    name="length"
                                    label="Length"
                                    placeholder="Enter Length"
                                    value={val.length}
                                    onChange={(value: string) =>
                                        handleChange("length", value, index)
                                    }
                                    isInfo
                                />
                                <Input
                                    name="prefix"
                                    label="Prefix"
                                    placeholder="Enter Prefix"
                                    value={val.prefix}
                                    onChange={(e: any) => {
                                        handleChange("prefix", e.target.value, index);
                                    }}
                                    isInfo
                                />
                                <Input
                                    name="strip"
                                    label="Strip"
                                    placeholder="Enter Strip"
                                    value={val.strip}
                                    onChange={(e: any) => {
                                        handleChange("strip", e.target.value, index);
                                    }}
                                    isInfo
                                />
                                <Input
                                    name="prepend"
                                    label="Prepend"
                                    placeholder="Enter Prepend"
                                    value={val.prepend}
                                    onChange={(e: any) => {
                                        handleChange("prepend", e.target.value, index);
                                    }}
                                    isInfo
                                />
                                <Select
                                    name="trunk_uuid"
                                    label="Trunk"
                                    placeholder="Select Trunk "
                                    removable
                                    options={getTrunkOptions([
                                        val.failover_trunk_1_uuid,
                                        val.failover_trunk_2_uuid,
                                    ])}
                                    isAdd
                                    createName="Create SIP Trunk"
                                    createPath={`/${trunkPath}/sip-trunk/create`}
                                    value={val.trunk_uuid}
                                    onChange={(e: any) => {
                                        handleChange("trunk_uuid", e.target.value, index);
                                    }}
                                    isInfo
                                />
                                <Select
                                    name="failover_trunk_1_uuid"
                                    label="Failover Trunk 1"
                                    placeholder="Select Failover Trunk 1"
                                    removable
                                    options={getTrunkOptions([
                                        val.trunk_uuid,
                                        val.failover_trunk_2_uuid,
                                    ])}
                                    isAdd
                                    createName="Create SIP Trunk"
                                    createPath={`/${trunkPath}/sip-trunk/create`}
                                    value={val.failover_trunk_1_uuid}
                                    onChange={(e: any) => {
                                        handleChange(
                                            "failover_trunk_1_uuid",
                                            e.target.value,
                                            index
                                        );
                                    }}
                                    isInfo
                                />
                                {val.failover_trunk_1_uuid ? (
                                    <Select
                                        name="failover_trunk_1_call_id"
                                        label="Failover Trunk 1 Caller ID"
                                        icon="CallerID"
                                        placeholder="Select Failover Trunk 1 Caller ID"
                                        removable
                                        isAdd
                                        createName="Create DID"
                                        createPath={didCreatePath}
                                        options={didOptions}
                                        value={val.failover_trunk_1_call_id}
                                        onChange={(e: any) => {
                                            handleChange(
                                                "failover_trunk_1_call_id",
                                                e.target.value,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                ) : null}
                                <Select
                                    name="failover_trunk_2_uuid"
                                    label="Failover Trunk 2"
                                    placeholder="Select Failover Trunk 2"
                                    removable
                                    isAdd
                                    createName="Create SIP Trunk"
                                    createPath={`/${trunkPath}/sip-trunk/create`}
                                    options={getTrunkOptions([
                                        val.trunk_uuid,
                                        val.failover_trunk_1_uuid,
                                    ])}
                                    value={val.failover_trunk_2_uuid}
                                    onChange={(e: any) => {
                                        handleChange(
                                            "failover_trunk_2_uuid",
                                            e.target.value,
                                            index
                                        );
                                    }}
                                    isInfo
                                />
                                {val.failover_trunk_2_uuid ? (
                                    <Select
                                        name="failover_trunk_2_call_id"
                                        label="Failover Trunk 2 Caller ID"
                                        icon="CallerID"
                                        placeholder="Select Failover Trunk 2 Caller ID"
                                        removable
                                        isAdd
                                        createName="Create DID"
                                        createPath={didCreatePath}
                                        options={didOptions}
                                        value={val.failover_trunk_2_call_id}
                                        onChange={(e: any) => {
                                            handleChange(
                                                "failover_trunk_2_call_id",
                                                e.target.value,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                ) : null}
                                {array?.length !== 1 ? (
                                    <div
                                        onClick={() => onDelete(index)}
                                        className="absolute top-2 right-2 cursor-pointer"
                                    >
                                        <Icon name="DeleteRed" width={20} height={20} />
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex gap-3 py-5">
                                {index === array?.length - 1 ? (
                                    <Button
                                        className="p-2"
                                        icon="Plus"
                                        text="Add More"
                                        style="primary-outline"
                                        onClick={() => onAdd()}
                                    />
                                ) : null}
                                {/* {array?.length !== 1 ? (
                                    <Button
                                        className="p-2"
                                        icon="DeleteRed"
                                        text="Delete"
                                        style="error-outline"
                                        onClick={() => onDelete(index)}
                                    />
                                ) : null} */}
                            </div>
                        </>
                    );
                })}
        </>
    );
};

export default TenantAddRules;
