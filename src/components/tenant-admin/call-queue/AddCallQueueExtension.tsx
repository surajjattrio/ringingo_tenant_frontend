import React, { useEffect } from "react";

// PROJECTV IMPORT
import {
    sipOptionsGet,
    useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Select } from "@/components/forms";
import { Danger } from "@/redux/services/toasterServices";

// OPTIONS IMPORT
import { levelOptions } from "@/config/options";

// TYPES IMPORT
interface AddCallQueueExtensionProps {
    extensionData: any;
    setExtensionData: React.Dispatch<React.SetStateAction<any>>;
}

// DATA
const initialExtensionValues = {
    name: "",
    status: "0",
    extension_uuid: "",
    level: "",
    position: "",
    user_uuid: "",
};

const AddCallQueueExtension = (props: AddCallQueueExtensionProps) => {
    const { extensionData, setExtensionData } = props;
    const dispatch = useAppDispatch();
    const sipOptions = useSipOptions();

    useEffect(() => {
        onGetSipOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching SIP Devices Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get SIP Devices Options Err =-=>", err);
        }
    };

    // Trigger When - Input or Select Value Change
    const handleChange = (key: string, val: string, idx: number) => {
        const newData = [...extensionData];
        newData[idx] = { ...newData[idx], [key]: val };
        setExtensionData(newData);
    };

    // Add New Extension Data
    const onAdd = (value: any) => {
        if (value.name === "") {
            Danger("Please enter all value");
        } else {
            setExtensionData([...extensionData, { ...initialExtensionValues }]);
        }
    };

    // Delete Extension Data
    const onDelete = (index: number) => {
        const newData = [...extensionData];
        newData.splice(index, 1);
        setExtensionData([...newData]);
    };

    return (
        <>
            <div className="pt-7 pb-4">
                <span className="text-base font-bold">Extension</span>
            </div>
            {extensionData?.map((val: any, index: number) => {
                return (
                    <>
                        <div className="pt-5 pb-5 px-4 rounded-md bg-dark-950 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
                            <Input
                                name="name"
                                label="Extension Name"
                                icon="ExtensionName"
                                placeholder="Enter Extension Name"
                                value={val.name}
                                onChange={(e: any) =>
                                    handleChange("name", e.target.value, index)
                                }
                                isInfo
                            />
                            <Select
                                name="extension_uuid"
                                label="SIP Device"
                                icon="SipDevices"
                                placeholder="Select SIP Device"
                                removable
                                options={sipOptions}
                                value={val.extension_uuid}
                                isManual
                                onChange={(e: any) => {
                                    const newData = [...extensionData];
                                    newData[index] = {
                                        ...newData[index],
                                        extension_uuid: e?.value,
                                        user_uuid: e?.user_uuid,
                                    };
                                    setExtensionData(newData);
                                }}
                                isInfo
                            />
                            <Select
                                name="position"
                                label="Position"
                                icon="Position"
                                placeholder="Select Position"
                                removable
                                options={levelOptions}
                                value={val.position}
                                onChange={(e: any) =>
                                    handleChange("position", e.target.value, index)
                                }
                                isInfo
                            />
                            <Select
                                name="level"
                                label="Level"
                                icon="Level"
                                placeholder="Select Level"
                                removable
                                options={levelOptions}
                                value={val.level}
                                onChange={(e: any) =>
                                    handleChange("level", e.target.value, index)
                                }
                                isInfo
                            />
                        </div>

                        <div className="flex gap-3 py-5">
                            {index === extensionData?.length - 1 ? (
                                <Button
                                    className="p-2"
                                    icon="Plus"
                                    text="Add More"
                                    style="primary-outline"
                                    onClick={() => onAdd(val)}
                                />
                            ) : null}
                            {extensionData?.length !== 1 ? (
                                <Button
                                    className="p-2"
                                    icon="DeleteRed"
                                    text="Delete"
                                    style="error-outline"
                                    onClick={() => onDelete(index)}
                                />
                            ) : null}
                        </div>
                    </>
                );
            })}
        </>
    );
};

export default AddCallQueueExtension;
