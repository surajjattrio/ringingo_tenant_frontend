"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    sipDevicesDelete,
    sipDevicesGet,
    sipDevicesSearch,
    sipDevicesUpdateStatus,
    useSipDevicesData,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useSipDevices } from "@/contexts/hooks/useSipDevices";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Head, Table, Icon } from "@/components/ui-components";
import { Button, InputSelect, Select, Switch } from "@/components/forms";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { SipDevicesFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

const initialValues: SipDevicesFilterTypes = {
    device_name: { key: "device_name|1", val: "", dropdown: "1" },
    username: { key: "username|1", val: "", dropdown: "1" },
    user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
    devices: { key: "devices|1", val: "", dropdown: "1" },
};

const SipDevices = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const sipDevices = useSipDevicesData();
    const userOptions = useUserOptions();
    const { fillData } = useSipDevices();

    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("0");
    const [deleteId, setDeleteId] = useState<any>("");
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [data, setData] = useState<any>(initialValues);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });

    const columns: ColumnsType[] = [
        {
            name: "device_name",
            title: "Device Name",
            sortable: true,
            action: (row: any) => {
                const active = row?.extension_status === "0";
                const title = row?.device_name;
                return (
                    <>
                        <div className="flex gap-2 items-center">
                            <span
                                className={`rounded-full h-[10px] w-[10px] ${active ? "bg-primary-success" : "bg-error"
                                    }`}
                            ></span>
                            <span>{title}</span>
                        </div>
                    </>
                );
            },
        },
        { name: "username", title: "Username", sortable: true },
        {
            name: "user_name",
            title: "User",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
        },  
        // {
        //     name: "otherFeatures",
        //     title: "Other Features",
        //     action: (row: any) => {
        //         return (
        //             <div className="flex justify-center item-center">
        //                 <Button
        //                     icon="MoreHoriZontalGray"
        //                     style="dark-outline"
        //                     className="h-7 w-7"
        //                     iconHeight={30}
        //                     iconWidth={30}
        //                     onClick={() => {
        //                         fillData(row);
        //                         router.push(
        //                             managerName
        //                                 ? "/manager-sip-devices/other-features/" + row?.uuid
        //                                 : "/tenant-sip-devices/other-features/" + row?.uuid
        //                         );
        //                     }}
        //                 />
        //             </div>
        //         );
        //     },
        // },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    useEffect(() => {
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching SIP Devices Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(sipDevicesGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get SIP Device Error --->", e.message);
        }
    }, 500);

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    // Advance Search - Trigger when right side Select value change
    const handleSelect = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
        });
    };

    // Advance Search - Searching Data API call
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["device_name"]["key"]]: data["device_name"]["val"],
                [data["username"]["key"]]: data["username"]["val"],
                [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
                status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(sipDevicesSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching SIP Devices Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create SIP Devices Page
    const onCreateSipDevices = () =>
        router.push(
            managerName ? "/manager-sip-devices/create" : "/tenant-sip-devices/create"
        );

    // Navigate to Update SIP Devices Page
    const onEditClick = async (data: any) =>
        router.push(
            managerName
                ? "/manager-sip-devices/" + data?.uuid
                : "/tenant-sip-devices/" + data?.uuid
        );

    // Update SIP Devices Status & Fetching SIP Devices Data
    const onUpdateStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(sipDevicesUpdateStatus(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                setFilter({ ...filter });
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update SIP Devices Status Err =-=>", err);
        }
    };

    // Deleting Selected SIP Devices & Fetching SIP Devices Data
    const onDeleteSipDevices = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(sipDevicesDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === sipDevices?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete SIP Devices Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteSipDevices = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={sipDevices?.count}
                createText="Create SIP Devices"
                search={filter?.search}
                onCreateClick={onCreateSipDevices}
                onDeleteClick={onMassDeleteSipDevices}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        isAdvance: false,
                        page: 1,
                        limit: 10,
                    })
                }
                onSearchClick={() =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    })
                }
                onHide={onEmptySearch}
            >
                <InputSelect
                    name="device_name"
                    label="Device name"
                    placeholder="Enter Device name"
                    value={data.device_name.val}
                    dropdownValue={data.device_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("device_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("device_name", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="username"
                    label="Username"
                    placeholder="Enter Username"
                    value={data.username.val}
                    dropdownValue={data.username.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("username", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("username", e.target.value)
                    }
                    noSpace
                    isInfo
                />
                <Select
                    name="user_uuid"
                    label="User"
                    placeholder="Select User"
                    removable
                    value={data.user_uuid.val}
                    options={userOptions}
                    onChange={(e: any) => handleChnage("user_uuid", e.target.value)}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="SIP devices"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-sip-devices/create"
                            : "/tenant-sip-devices/create"
                    }
                    columns={columns}
                    data={sipDevices?.data?.length ? sipDevices.data : []}
                    page={filter.page}
                    totalCount={sipDevices?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) => setDeleteId(data.uuid)}
                    onSelectRow={(e: any, data: any, array: string[]) =>
                        setSelectedRow(array)
                    }
                    onLimitChange={(limit: number) => {
                        setFilter({
                            ...filter,
                            page: 1,
                            limit,
                        });
                    }}
                    onUpdateStatus={onUpdateStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteSipDevices(deleteId)}
            />
        </div>
    );
};

export default SipDevices;
