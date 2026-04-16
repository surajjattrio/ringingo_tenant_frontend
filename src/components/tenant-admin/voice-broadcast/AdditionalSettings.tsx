import { useEffect } from "react";

// PROJECT IMPORT
import { Button, Select } from "@/components/forms";
import {
    broadcastTypeOption,
    digitsOptions,
    digitsOptions2,
} from "@/config/options";
import VoiceBrodcastAccordion from "./VoiceBrodcastAccordion";
import { useVoiceBroadcast } from "@/contexts/hooks/useVoiceBroadcast";
import { useIvrOptions } from "@/redux/slice/tenant-admin/ivrSlice";
import { usePromptsOptions } from "@/redux/slice/tenant-admin/promptsSlice";
import { Danger } from "@/redux/services/toasterServices";
import { usePathname } from "next/navigation";

// TYPES
interface AddRulesProps {
    settingData: any;
    setSettingData: React.Dispatch<React.SetStateAction<any>>;
}

// DATA
const initialSettingValues = {
    prompt_uuid: "",
    from: "",
    to: "",
    prompt_name: "",
};

const AdditionalSettings = (props: AddRulesProps) => {
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";
    const { settingData, setSettingData } = props;
    const ivrOptions = useIvrOptions();
    const promptsOptions = usePromptsOptions();

    const { values, touched, errors, setValues, handleBlur, setFieldValue } =
        useVoiceBroadcast();

    useEffect(() => {
        setValues({
            ...values,
            survey_value: settingData,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingData]);

    // Trigger When - Input or Select Value Change
    const handleChangeData = (key: string, val: string, idx: number) => {
        let newData = [...settingData];
        newData[idx] = { ...newData[idx], [key]: val };
        setSettingData(newData);
    };

    // Add New Row to Additional Setting
    const onAdd = (val: any) => {
        if (!(val?.prompt_uuid && val?.from && val?.to)) {
            Danger("Please fill data");
            return false;
        }
        setSettingData([...settingData, initialSettingValues]);
    };

    // Delete Additional Setting Row
    const onDelete = (idx: number) => {
        let newData = [...settingData];
        newData.splice(idx, 1);
        setSettingData([...newData]);
    };

    return (
        <VoiceBrodcastAccordion title={`Continue ( On "0"  Press  ) `}>
            <div className="pt-3 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Select
                    name="exit_prompt_uuid"
                    label={
                        <>
                            Exit Prompt <span className="text-red-500">*</span>
                        </>
                    }
                    icon="ExitPrompt"
                    placeholder="Select Exit Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        isPathname
                            ? "/manager-voice-broadcast/audio-prompts/create"
                            : "/tenant-voice-broadcast/audio-prompts/create"
                    }
                    options={promptsOptions}
                    value={values.exit_prompt_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("exit_prompt_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="broadcast_type"
                    label="Broadcast Type"
                    icon="BroadcastType"
                    placeholder="Select Broadcast Type"
                    options={broadcastTypeOption}
                    value={values.broadcast_type}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("broadcast_type", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                {values.broadcast_type === "1" ? (
                    <Select
                        name="ivr_uuid"
                        label="IVR"
                        placeholder="Select IVR"
                        isAdd
                        createPath={
                            isPathname
                                ? "/manager-voice-broadcast/ivr/create"
                                : "/tenant-voice-broadcast/ivr/create"
                        }
                        createName="Create IVR"
                        options={ivrOptions}
                        value={values.ivr_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("ivr_uuid", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                ) : null}
            </div>
            {settingData?.length && values.broadcast_type === "0"
                ? settingData?.map((val: any, index: number, array: any) => {
                    return (
                        <>
                            <div className="rounded-md bg-dark-950 pt-5 pb-5 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                                <Select
                                    name="prompt_uuid"
                                    label="Prompt File"
                                    icon="PromptFile"
                                    placeholder="Select Prompt File"
                                    options={promptsOptions}
                                    isAdd
                                    createName="Create Audio Prompts"
                                    createPath={
                                        isPathname
                                            ? "/manager-voice-broadcast/audio-prompts/create"
                                            : "/tenant-voice-broadcast/audio-prompts/create"
                                    }
                                    value={val.prompt_uuid}
                                    touched={touched}
                                    errors={errors}
                                    isManual
                                    onChange={(e: any) => {
                                        let newData = [...settingData];
                                        newData[index] = {
                                            ...newData[index],
                                            prompt_uuid: e?.value,
                                            prompt_name: e?.label,
                                        };
                                        setSettingData(newData);
                                    }}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                                <Select
                                    name="from"
                                    label="From Digit"
                                    icon="FromDigit"
                                    placeholder="Select From Digit"
                                    options={digitsOptions2}
                                    value={val.from}
                                    touched={touched}
                                    errors={errors}
                                    onChange={(e: any) => {
                                        handleChangeData("from", e.target.value, index);
                                    }}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                                <Select
                                    name="to"
                                    label="To Digit"
                                    icon="FromDigit"
                                    placeholder="Select To Digit"
                                    options={digitsOptions}
                                    value={val.to}
                                    touched={touched}
                                    errors={errors}
                                    onChange={(e: any) => {
                                        handleChangeData("to", e.target.value, index);
                                    }}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                                <div className="flex gap-3 py-2">
                                    {index === array?.length - 1 ? (
                                        <Button
                                            className="p-2"
                                            icon="Plus"
                                            text="Add More"
                                            style="primary-outline"
                                            onClick={() => onAdd(val)}
                                        />
                                    ) : null}
                                    {array?.length !== 1 ? (
                                        <Button
                                            className="p-2"
                                            icon="DeleteRed"
                                            text="Delete"
                                            style="error-outline"
                                            onClick={() => onDelete(index)}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </>
                    );
                })
                : null}
        </VoiceBrodcastAccordion>
    );
};
export default AdditionalSettings;
