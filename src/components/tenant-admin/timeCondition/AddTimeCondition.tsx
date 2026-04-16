import React from "react";

// PROJECT IMPORT
import { Button, Input, Select } from "@/components/forms";
import { DateRangePicker, TimePicker } from "@/components/pickers";
import { Danger } from "@/redux/services/toasterServices";

// THIRD - PARTY IMPORT
import moment from "moment";

// OPTIONS IMPORT
import {
    daysOptions,
    priorityOptions,
    routingTypeOptions3,
} from "@/config/options";
import { usePathname } from "next/navigation";

// TYPES
interface AddTimeConditionProps {
    conditionData: any;
    setConditionData: React.Dispatch<React.SetStateAction<any>>;
    getName?: any;
    getOptions?: any;
}

// DATA
const initialConditionValues = {
    start_hour: "",
    start_minute: "",
    end_hour: "",
    end_minute: "",
    weekday_start: "",
    weekday_end: "",
    monthday_start: "",
    monthday_end: "",
    start_month: "",
    end_month: "",
    start_year: "",
    end_year: "",
    extension_calltype: "1",
    extension_destination: "",
    priority: "",
};
const AddTimeCondition = (props: AddTimeConditionProps) => {
    const { conditionData, setConditionData, getName, getOptions } = props;

    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager"

    // Trigger When - Input or Select or Day Picker Value Change
    const handleChange = (key: string, val: string, idx: number) => {
        let newData = [...conditionData];
        newData[idx] = { ...newData[idx], [key]: val };
        setConditionData(newData);
    };

    // Trigger When - Date Range Picker Value Change
    const handleDateChange = (
        { start_year, start_month, monthday_start }: any,
        { end_year, end_month, monthday_end }: any,
        idx: number
    ) => {
        let newData = [...conditionData];
        newData[idx] = {
            ...newData[idx],
            start_year,
            start_month,
            monthday_start,
            end_year,
            end_month,
            monthday_end,
        };
        setConditionData(newData);
    };

    // Trigger When - Time Picker Value Change
    const handleTimeChange = (
        key: string,
        secondKey: string,
        hour: string,
        minute: string,
        idx: number
    ) => {
        let newData = [...conditionData];
        newData[idx] = {
            ...newData[idx],
            [key]: hour,
            [secondKey]: minute,
        };
        setConditionData(newData);
    };

    // Add New Row to Time Condition
    const onAdd = (val: any) => {

        // Check if start time is selected but end time is missing
        if ((val?.start_year) && !(val?.end_year)) {
            Danger("Please select End Date");
            return;
        }

        // Check if end time is selected but start time is missing
        if ( !val?.start_year || ((val?.end_year) && !(val?.start_year))) {
            Danger("Please select Start Date");
            return;
        }
        
        // Check if start time is selected but end time is missing
        if ((val?.start_hour || val?.start_minute) && !(val?.end_hour || val?.end_minute)) {
            Danger("Please select End Time");
            return;
        }

        // Check if end time is selected but start time is missing
        if (!val?.start_hour || ((val?.end_hour || val?.end_minute) && !(val?.start_hour || val?.start_minute))) {
            Danger("Please select Start Time");
            return;
        }

        if (
            !(
                val?.start_year &&
                val?.end_year &&
                val?.start_hour &&
                val?.end_hour &&
                // val?.weekday_start &&
                // val?.weekday_end &&
                val?.priority &&
                val?.extension_destination
            )
        ) {
            Danger("Please fill all data");
            return;
        }

        setConditionData([...conditionData, initialConditionValues]);
    };

    // Delete Time Condition Row
    const onDelete = (idx: number) => {
        let newData = [...conditionData];
        newData.splice(idx, 1);
        setConditionData([...newData]);
    };

    // get create name
    const getCreateName = (type: string) => {
        const data = routingTypeOptions3?.find((val: any) => val?.value === type);
        return data?.label || "";
    };

    // get create name
    const getCreateUrl = (type: string) => {
        const data = routingTypeOptions3?.find((val: any) => val?.value === type);
        return data?.url
            ? data?.url !== "time-condition"
                ? isPathname ? `/manager-time-condition/${data?.url}/create` : `/tenant-time-condition/${data?.url}/create`
                : ""
            : "";
    };

    return (
        <>
            <div className="pt-7 pb-4">
                <span className="text-sm font-bold">Time Condition</span>
            </div>
            {conditionData?.length &&
                conditionData?.map((val: any, index: number, array: any) => {
                    return (
                        <React.Fragment key={index}>
                            <div className="rounded-md bg-dark-950 pt-5 pb-5 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                                <DateRangePicker
                                    className="rounded-md"
                                    name="date"
                                    minDate={new Date()}
                                    startDate={
                                        val?.start_year
                                            ? new Date(
                                                `${val?.start_year}-${val?.start_month}-${val?.monthday_start}`
                                            )?.setHours(0, 0, 0, 0)
                                            : null
                                    }
                                    endDate={
                                        val?.end_year
                                            ? new Date(
                                                `${val?.end_year}-${val?.end_month}-${val?.monthday_end}`
                                            )?.setHours(0, 0, 0, 0)
                                            : null
                                    }
                                    startLabel="Start Date*"
                                    endLabel="End Date*"
                                    // startPlaceholder="Start Date*"
                                    // endPlaceholder="End Date*"
                                    onChange={(start: any, end: any) => {
                                        handleDateChange(start, end, index);
                                    }}
                                    isInfo
                                />
                                <div className="grid grid-cols-2">
                                    <TimePicker
                                        className="border-r-0 rounded-r-none"
                                        label="Start Time*"
                                        name="start_time"
                                        placeholder="Select Start Time"
                                        value={
                                            val?.start_hour || val?.start_minute
                                                ? moment()
                                                    .set("hour", val?.start_hour)
                                                    .set("minute", val?.start_minute)
                                                : undefined
                                        }
                                        onChange={(start_hour: string, start_minute: string) => {
                                            handleTimeChange(
                                                "start_hour",
                                                "start_minute",
                                                start_hour,
                                                start_minute,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                    <TimePicker
                                        className="rounded-l-none"
                                        label="End Time*"
                                        name="end_time"
                                        placeholder="Select End time"
                                        value={
                                            val?.end_hour || val?.end_minute
                                                ? moment()
                                                    .set("hour", val?.end_hour)
                                                    .set("minute", val?.end_minute)
                                                : undefined
                                        }
                                        onChange={(end_hour: string, end_minute: string) => {
                                            handleTimeChange(
                                                "end_hour",
                                                "end_minute",
                                                end_hour,
                                                end_minute,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                </div>
                                <div className="grid grid-cols-2">
                                    <Select
                                        style={{
                                            borderRight: 0,
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                            borderColor: "#D8D8D8",
                                            backgroundColor: "transparent",
                                        }}
                                        name="weekday_start"
                                        label="Start Week"
                                        placeholder="Select Start Week"
                                        removable
                                        value={val.weekday_start}
                                        options={daysOptions}
                                        onChange={(e: any) => {
                                            handleChange("weekday_start", e.target.value, index);
                                        }}
                                        isInfo
                                    />
                                    <Select
                                        style={{
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                            borderColor: "#D8D8D8",
                                            backgroundColor: "transparent",
                                        }}
                                        name="weekday_end"
                                        label="End Week"
                                        placeholder="Select End Week"
                                        removable
                                        value={val.weekday_end}
                                        options={daysOptions}
                                        onChange={(e: any) => {
                                            handleChange("weekday_end", e.target.value, index);
                                        }}
                                        isInfo
                                    />
                                </div>
                                <Select
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                    name="priority"
                                    label="Priority"
                                    placeholder="Select Priority"
                                    removable
                                    options={priorityOptions}
                                    value={val.priority}
                                    onChange={(e: any) => {
                                        handleChange("priority", e.target.value, index);
                                    }}
                                    isInfo
                                />
                                <Select
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                    name="extension_calltype"
                                    label="Routing Type"
                                    placeholder="Select Routing Type"
                                    options={routingTypeOptions3}
                                    value={val.extension_calltype}
                                    onChange={(e: any) => {
                                        let newData = [...conditionData];
                                        newData[index] = {
                                            ...newData[index],
                                            extension_calltype: e.target.value,
                                            extension_destination: "",
                                        };
                                        setConditionData(newData);
                                    }}
                                    isInfo
                                />
                                {val.extension_calltype === "8" ? (
                                    <Input
                                        inputClassName="bg-transparent"
                                        type="number"
                                        name="extension_destination"
                                        label={getName(val.extension_calltype)}
                                        placeholder={`Enter ${getName(val.extension_calltype)}`}
                                        value={val.extension_destination}
                                        onChange={(e: any) => {
                                            handleChange(
                                                "extension_destination",
                                                e.target.value,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                ) : (
                                    <Select
                                        style={{
                                            backgroundColor: "transparent",
                                        }}
                                        name="extension_destination"
                                        label={getName(val.extension_calltype)}
                                        placeholder={`Select ${getName(val.extension_calltype)}`}
                                        isAdd
                                        createName={
                                            "Create " + getCreateName(val.extension_calltype)
                                        }
                                        createPath={getCreateUrl(val.extension_calltype)}
                                        options={getOptions(val.extension_calltype) || []}
                                        value={val.extension_destination}
                                        onChange={(e: any, title: string) => {
                                            handleChange(
                                                "extension_destination",
                                                e.target.value,
                                                index
                                            );
                                        }}
                                        isInfo
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 py-5">
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
                        </React.Fragment>
                    );
                })}
        </>
    );
};

export default AddTimeCondition;
