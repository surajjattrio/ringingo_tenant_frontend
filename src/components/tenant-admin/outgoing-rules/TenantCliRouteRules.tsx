import { Fragment, useEffect } from "react";
import { usePathname } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    didOptionsGet,
    useCidDidOptions,
    useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import {
    tenantTrunkOptionsGet,
    useTenantTrunkOptions,
} from "@/redux/slice/tenant-admin/tenantTrunkSlice";
import { Button, Input, Select } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// TYPES
interface TenantCliRouteRulesProps {
    rulesData: any[];
    setRulesData: React.Dispatch<React.SetStateAction<any>>;
}

// DATA
// CLI based route row : route selected by caller id, CLI & To number formatted per trunk leg
export const initialCliRouteValues = {
    match_cli: [],
    cli_allowed_lengths: "",
    to_allowed_lengths: "",
    trunk_uuid: "",
    cli_keep_last: "",
    cli_prefix: "",
    to_keep_last: "",
    to_prefix: "",
    failover_trunk_1_uuid: "",
    failover_trunk_1_call_id: "",
    failover_trunk_1_cli_keep_last: "",
    failover_trunk_1_cli_prefix: "",
    failover_trunk_1_to_keep_last: "",
    failover_trunk_1_to_prefix: "",
    failover_trunk_2_uuid: "",
    failover_trunk_2_call_id: "",
    failover_trunk_2_cli_keep_last: "",
    failover_trunk_2_cli_prefix: "",
    failover_trunk_2_to_keep_last: "",
    failover_trunk_2_to_prefix: "",
};

// Allowed lengths are typed comma separated (e.g. 10,11,12); old rows may have them as array
const lengthsToText = (value: any) => (Array.isArray(value) ? value.join(",") : String(value ?? ""));
const cleanLengths = (value: string) => String(value || "").replace(/[^0-9,]/g, "").replace(/,{2,}/g, ",");

const onlyDigits = (value: string) => String(value || "").replace(/\D/g, "");

/* ============================== CLI ROUTE RULES ============================== */

const TenantCliRouteRules = (props: TenantCliRouteRulesProps) => {
    const { rulesData, setRulesData } = props;
    const dispatch = useAppDispatch();
    const trunkOptions = useTenantTrunkOptions();
    const didOptions = useDidOptions();
    const cidDidOptions = useCidDidOptions();
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";

    useEffect(() => {
        dispatch(tenantTrunkOptionsGet());
        dispatch(didOptionsGet());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // DID options with name (if DID has name)
    const cliOptions = (didOptions || []).map(
        (val: any) => cidDidOptions?.find((cid: any) => cid?.value === val?.value) || val
    );

    // Remove trunks already selected in same row
    const getTrunkOptions = (uuids: string[]) =>
        trunkOptions?.filter((val: any) => !uuids?.includes(val?.value));

    const handleChange = (key: string, val: any, idx: number) => {
        let newData = [...rulesData];
        newData[idx] = { ...newData[idx], [key]: val };
        // Failover 2 is allowed only with Failover 1 : clear it when Failover 1 trunk is removed
        if (key === "failover_trunk_1_uuid" && !val) {
            Object.keys(initialCliRouteValues)
                .filter((field) => field.startsWith("failover_trunk_2_"))
                .forEach((field) => (newData[idx][field] = ""));
        }
        setRulesData(newData);
    };

    const onAdd = () => setRulesData([...rulesData, { ...initialCliRouteValues }]);

    const onDelete = (idx: number) => {
        let newData = [...rulesData];
        newData.splice(idx, 1);
        setRulesData([...newData]);
    };

    // Keep last digits + prefix inputs for CLI and To number of one trunk leg
    const renderFormat = (row: any, index: number, key: string, title: string) => (
        <>
            <Input
                name={`${key}cli_keep_last`}
                label={`${title} CLI Keep Last Digits`}
                icon="Strip"
                placeholder="All digits"
                value={row[`${key}cli_keep_last`]}
                onChange={(e: any) => handleChange(`${key}cli_keep_last`, onlyDigits(e.target.value), index)}
                isInfo
            />
            <Input
                name={`${key}cli_prefix`}
                label={`${title} CLI Prefix`}
                icon="Prepend"
                placeholder="e.g. 0 or +91"
                value={row[`${key}cli_prefix`]}
                onChange={(e: any) => handleChange(`${key}cli_prefix`, e.target.value.replace(/[^0-9+*#]/g, ""), index)}
                isInfo
            />
            <Input
                name={`${key}to_keep_last`}
                label={`${title} To Keep Last Digits`}
                icon="Strip"
                placeholder="All digits"
                value={row[`${key}to_keep_last`]}
                onChange={(e: any) => handleChange(`${key}to_keep_last`, onlyDigits(e.target.value), index)}
                isInfo
            />
            <Input
                name={`${key}to_prefix`}
                label={`${title} To Prefix`}
                icon="Prepend"
                placeholder="e.g. 0 or 91"
                value={row[`${key}to_prefix`]}
                onChange={(e: any) => handleChange(`${key}to_prefix`, e.target.value.replace(/[^0-9+*#]/g, ""), index)}
                isInfo
            />
        </>
    );

    const renderFailover = (row: any, index: number, n: number) => {
        const key = `failover_trunk_${n}_`;
        const otherTrunks = [row.trunk_uuid, row[`failover_trunk_${n === 1 ? 2 : 1}_uuid`]];
        return (
            <>
                <Select
                    name={`${key}uuid`}
                    label={`Failover Trunk ${n}`}
                    placeholder={`Select Failover Trunk ${n}`}
                    icon={n === 1 ? "FailOverTrunk1" : "FailOverTrunk2"}
                    removable
                    isAdd
                    createName="Create SIP Trunk"
                    createPath={
                        isPathname
                            ? "/manager-outgoing-rules/sip-trunk/create"
                            : "/tenant-outgoing-rules/sip-trunk/create"
                    }
                    options={getTrunkOptions(otherTrunks)}
                    value={row[`${key}uuid`]}
                    onChange={(e: any) => handleChange(`${key}uuid`, e.target.value, index)}
                    isInfo
                />
                {/* Caller ID & formats of this failover are shown only after its trunk is selected */}
                {row[`${key}uuid`] ? (
                    <>
                        <Select
                            name={`${key}call_id`}
                            label={
                                <>
                                    Failover Trunk {n} Caller ID <span className="text-red-500">*</span>
                                </>
                            }
                            icon="CallerID"
                            placeholder={`Select Failover Trunk ${n} Caller ID`}
                            removable
                            options={cliOptions}
                            value={row[`${key}call_id`]}
                            onChange={(e: any) => handleChange(`${key}call_id`, e.target.value, index)}
                            isInfo
                        />
                        {renderFormat(row, index, key, `Failover ${n}`)}
                    </>
                ) : null}
            </>
        );
    };

    return (
        <div className="px-4">
            <div className="pb-2">
                <span className="text-sm font-bold">CLI Routes</span>
            </div>
            <p className="pb-4 text-xs text-gray-500">
                Call uses the first route whose CLIs contain the caller id (agent selected / campaign CLI) and whose
                allowed lengths match. If no caller id is given, the first matching route is used with its first CLI
                or its CLIs in turn (Round Robin), as selected in "No CLI Selected".
                Keep Last Digits + Prefix converts numbers, e.g. +919876543210 with keep last 10 and prefix 0 becomes
                09876543210.
            </p>
            {rulesData?.length > 0 &&
                rulesData?.map((row: any, index: number, array: any) => (
                    <Fragment key={index}>
                        <div className="relative rounded-md bg-dark-950 pt-5 pb-14 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                            <div className="col-span-3 tsm:col-span-1 text-sm font-semibold">Route {index + 1}</div>
                            <Select
                                name="match_cli"
                                isMulti
                                label="CLIs (Caller IDs)"
                                icon="CallerID"
                                placeholder="Select CLIs"
                                options={cliOptions}
                                value={row.match_cli || []}
                                onChange={(e: any) => handleChange("match_cli", e || [], index)}
                                isInfo
                            />
                            <Input
                                name="cli_allowed_lengths"
                                label="CLI Allowed Lengths"
                                icon="Length1"
                                placeholder="Any length (e.g. 10,11,12)"
                                value={lengthsToText(row.cli_allowed_lengths)}
                                onChange={(e: any) => handleChange("cli_allowed_lengths", cleanLengths(e.target.value), index)}
                                isInfo
                            />
                            <Input
                                name="to_allowed_lengths"
                                label="To Number Allowed Lengths"
                                icon="Length1"
                                placeholder="Any length (e.g. 10,11,12)"
                                value={lengthsToText(row.to_allowed_lengths)}
                                onChange={(e: any) => handleChange("to_allowed_lengths", cleanLengths(e.target.value), index)}
                                isInfo
                            />
                            <Select
                                name="trunk_uuid"
                                label="Trunk"
                                icon="Trunk"
                                placeholder="Select Trunk"
                                removable
                                isAdd
                                createName="Create SIP Trunk"
                                createPath={
                                    isPathname
                                        ? "/manager-outgoing-rules/sip-trunk/create"
                                        : "/tenant-outgoing-rules/sip-trunk/create"
                                }
                                options={getTrunkOptions([row.failover_trunk_1_uuid, row.failover_trunk_2_uuid])}
                                value={row.trunk_uuid}
                                onChange={(e: any) => handleChange("trunk_uuid", e.target.value, index)}
                                isInfo
                            />
                            {renderFormat(row, index, "", "Trunk")}
                            {renderFailover(row, index, 1)}
                            {/* Failover 2 only after Failover 1 trunk is selected */}
                            {row.failover_trunk_1_uuid ? renderFailover(row, index, 2) : null}

                            {array?.length !== 1 && (
                                <div className="absolute right-5 bottom-4">
                                    <div
                                        onClick={() => onDelete(index)}
                                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-icon-border bg-icon-background shadow-sm"
                                    >
                                        <Icon name="DeleteWhiteNew" width={16} height={16} className="text-red-500 " />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-3 py-5">
                            {index === array?.length - 1 ? (
                                <Button
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-primaryPurple border border-primary-primaryPurple rounded-full bg-transparent hover:bg-primary-primaryPurple/10 transition-all duration-200"
                                    icon="PlusBlue"
                                    text="Add Route"
                                    style="custom"
                                    onClick={() => onAdd()}
                                />
                            ) : null}
                        </div>
                    </Fragment>
                ))}
        </div>
    );
};

export default TenantCliRouteRules;
