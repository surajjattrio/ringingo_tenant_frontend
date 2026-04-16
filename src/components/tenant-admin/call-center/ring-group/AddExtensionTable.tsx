import React, { useEffect, useState } from "react";

// PROJECT IMPORTS
import { Danger, Success } from "@/redux/services/toasterServices";
import { Button, Input, Select } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// OPTIONS IMPORT
import { extensionTypeOptions } from "@/config/options";
import {
    sipNameOptionsGet,
    useSipNameOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useAppDispatch } from "@/redux/hooks";

// TYPES
interface AddExtensionTableProps {
    extensionData: any;
    setExtensionData: React.Dispatch<React.SetStateAction<any>>;
}

// DATA
const initialValues = {
    extension_type: "0",
    extension: "",
    user_uuid: "",
};
/* ============================== SET PARAMETERS TABLE ============================== */

const AddExtensionTable = (props: AddExtensionTableProps) => {
    const { extensionData, setExtensionData } = props;
    const dispatch = useAppDispatch();
    const sipOptions = useSipNameOptions();

    const [data, setData] = useState<any>(extensionData || []);
    const [addNewValues, setAddNewValues] = useState<any>(initialValues);

    useEffect(() => {
        const newData = extensionData?.map((val: any, idx: number) => ({
            ...val,
            isEdit: data?.length && data[idx] && data[idx]["isEdit"] ? true : false,
        }));
        setData(newData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extensionData]);

    useEffect(() => {
        onGetSipNameOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching SIP Devices Options
    const onGetSipNameOptions = async () => {
        try {
            await dispatch(sipNameOptionsGet());
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Preparing Data for Extension Table
    const prepareData = (nData?: any) => {
        if (!nData) nData = data;
        const newData = nData?.map((element: any) => ({
            extension_type: element.extension_type,
            extension: element.extension,
            user_uuid: element.user_uuid,
        }));
        setExtensionData(newData);
    };

    // Add New Row to Extension Table
    const onAdd = () => {
        const addData = {
            extension_type: addNewValues.extension_type,
            extension: addNewValues.extension,
            user_uuid: addNewValues.user_uuid,
            isEdit: false,
        };
        const newData = [...data, addData];
        prepareData(newData);
        setData(newData);
        setAddNewValues(initialValues);
    };

    // Edit Click
    const onEditClick = (idx: number) => {
        const newData = [...data];
        newData[idx]["isEdit"] = true;
        setData(newData);
    };

    // Update Extension Table Row
    const onUpdate = (val: any, idx: number) => {
        prepareData();
        const newData = [...data];
        data[idx]["isEdit"] = false;
        setData(newData);
    };

    // Delete Extension Table Row
    const onDelete = (idx: number) => {
        const newData = [...data];
        newData.splice(idx, 1);
        setData(newData);
        prepareData(newData);
    };

    // Trigger When - Input or Select Value Change
    const handelChange = (key: string, val: any, idx: number) => {
        const newData = [...data];
        newData[idx] = {
            ...newData[idx],
            [key]: val,
        };
        setData(newData);
    };
    console.log(addNewValues);

    // Trigger When - Add New Extension Row Vlaue Change
    const addNewHandelChange = (key: string, val: any) => {
        setAddNewValues({
            ...addNewValues,
            [key]: val,
        });
    };

    // Set Extension Type Title
    const getTypeName = (value: string) => {
        const element = extensionTypeOptions?.find((val) => val?.value === value);
        return element?.label || "";
    };

    // Set Extension Title
    const getExtensionName = (value: any) => {
        if (value?.extension_type === "1") return value?.extension;
        const element = sipOptions?.find(
            (val: any) => val?.value === value?.extension
        );
        return element?.label || "";
    };

    return (
        <>
            <div className="border-t border-dark-700">
                <div className="pt-7 pb-4">
                    <span className="text-sm font-bold">Set Parameters</span>
                </div>
                <div className="relative overflow-x-auto rounded-md mb-20">
                    <table className="w-full text-left">
                        <thead className="text-xs text-white font-bold bg-secondary border border-secondary">
                            <tr>
                                <th className="px-6 py-4">No.</th>
                                <th className="px-6 py-4">Extension Type</th>
                                <th className="px-6 py-4">Extension</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((val: any, index: number) => (
                                <React.Fragment key={index}>
                                    {val?.isEdit ? (
                                        <tr className="bg-dark-950 border">
                                            <td className="px-6 py-4 font-normal text-txt-primary text-xs whitespace-nowrap">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-txt-primary text-xs whitespace-nowrap">
                                                <Select
                                                    name="extension_type"
                                                    isShowLabel={false}
                                                    options={extensionTypeOptions}
                                                    value={val.extension_type}
                                                    onChange={(e: any) => {
                                                        handelChange(
                                                            "extension_type",
                                                            e.target.value,
                                                            index
                                                        );
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-normal text-txt-primary whitespace-nowrap">
                                                {val.extension_type === "1" ? (
                                                    <Input
                                                        name="extension"
                                                        type="number"
                                                        isShowLabel={false}
                                                        placeholder="Enter Extension"
                                                        value={val.extension}
                                                        onChange={(e: any) => {
                                                            handelChange("extension", e.target.value, index);
                                                        }}
                                                    />
                                                ) : (
                                                    <Select
                                                        name="extension"
                                                        isShowLabel={false}
                                                        placeholder="Select"
                                                        removable
                                                        options={sipOptions}
                                                        isManual
                                                        value={val.extension}
                                                        onChange={(e: any) => {
                                                            const newData = [...data];
                                                            newData[index] = {
                                                                ...newData[index],
                                                                user_uuid: e.user_uuid,
                                                                extension: e.value,
                                                            };
                                                            setData(newData);
                                                        }}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-txt-primary whitespace-nowrap">
                                                <Button
                                                    className="px-10 py-2 cursor-pointer"
                                                    text="Update"
                                                    style="primary-outline"
                                                    onClick={() => {
                                                        onUpdate(val, index);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr className="bg-dark-950 border">
                                            <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                                                {getTypeName(val?.extension_type)}
                                            </td>
                                            <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                                                {getExtensionName(val)}
                                            </td>
                                            <td className="px-6 py-6 font-normal text-txt-primary whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <Icon
                                                        className="cursor-pointer"
                                                        tooltip="Edit"
                                                        name="Edit"
                                                        width={20}
                                                        height={20}
                                                        alt="Edit"
                                                        onClick={() => {
                                                            onEditClick(index);
                                                        }}
                                                    />
                                                    <Icon
                                                        className="cursor-pointer"
                                                        tooltip="Delete"
                                                        name="DeleteRed"
                                                        width={20}
                                                        height={20}
                                                        alt="Delete"
                                                        onClick={() => {
                                                            onDelete(index);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            <tr className="bg-dark-950 border">
                                <td className="px-6 py-4 font-normal text-txt-primary text-xs whitespace-nowrap">
                                    {data?.length + 1}
                                </td>
                                <td className="px-6 py-4 font-normal text-txt-primary whitespace-nowrap">
                                    <Select
                                        name="extension_type"
                                        isShowLabel={false}
                                        options={extensionTypeOptions}
                                        value={addNewValues.extension_type}
                                        onChange={(e: any) => {
                                            addNewHandelChange("extension_type", e.target.value);
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 font-normal text-txt-primary whitespace-nowrap">
                                    {addNewValues.extension_type === "1" ? (
                                        <Input
                                            name="extension"
                                            type="number"
                                            isShowLabel={false}
                                            placeholder="Enter Extension"
                                            value={addNewValues.extension}
                                            onChange={(e: any) => {
                                                addNewHandelChange("extension", e.target.value);
                                            }}
                                        />
                                    ) : (
                                        <Select
                                            name="extension"
                                            isShowLabel={false}
                                            placeholder="Select"
                                            removable
                                            options={sipOptions}
                                            isManual
                                            value={addNewValues.extension}
                                            onChange={(e: any) => {
                                                setAddNewValues({
                                                    ...addNewValues,
                                                    user_uuid: e.user_uuid,
                                                    extension: e.value,
                                                });
                                            }}
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 font-normal text-txt-primary whitespace-nowrap">
                                    <Button
                                        tooltip="Add more"
                                        icon="Plus"
                                        className="px-3 py-2 cursor-pointer"
                                        text="Add More"
                                        style="primary-outline"
                                        onClick={() => onAdd()}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AddExtensionTable;
