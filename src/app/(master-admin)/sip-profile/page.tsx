"use client";
import React, { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    sipProfileDelete,
    sipProfileGet,
    sipProfileSearch,
    sipProfileStatusUpdate,
    updateSingleSipData,
    useSipProfileData,
} from "@/redux/slice/master-admin/sipProfileSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Table, Icon } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { SipProfileAdvancedFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: SipProfileAdvancedFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    sip_ip: { key: "sip_ip|1", val: "", dropdown: "1" },
    sip_port: { key: "sip_port|1", val: "", dropdown: "1" },
};
/* ============================== SIP - PROFILE PAGE ============================== */

const SipProfile = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const sipProfileData = useSipProfileData();

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
            name: "name",
            title: "Name",
            sortable: true,
        },
        { name: "sip_ip", title: "SIP - IP", sortable: true },
        { name: "sip_port", title: "SIP - Port", sortable: true },
        {
            name: "status",
            title: "Status",
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching SIP Profile Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(sipProfileGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get sip Error --->", e.message);
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

    // Advance Search - Fetching SIP Profile Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["sip_ip"]["key"]]: data["sip_ip"]["val"],
                [data["sip_port"]["key"]]: data["sip_port"]["val"],
                status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(sipProfileSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching SIP Profile Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create SIP Profile Page
    const onCreateSipProfile = () => router.push("/sip-profile/create");

    // Store Single SIP Profile Data in Redux & Navigate to Edit SIP Profile Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleSipData(data));
            router.push("/sip-profile/" + data?.uuid);
        } catch (e: any) {
            console.error("Store Single sip-profile Data Err --->", e?.message);
        }
    };

    // Update SIP Profile Status & Fetching SIP Profile Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(sipProfileStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update SIP Profile Status Err --->", e?.message);
        }
    };

    // Deleting Selected SIP Profile & Fetching SIP Profile Data
    const onDeleteSipProfile = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(sipProfileDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === sipProfileData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Tenant Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteSpiProfile = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                createText="Create SIP Profile"
                onCreateClick={onCreateSipProfile}
                onDeleteClick={onMassDeleteSpiProfile}
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
                    name="name"
                    label="Name"
                    placeholder="Enter First name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
                <InputSelect
                    name="sip_ip"
                    label="SIP - IP"
                    placeholder="Enter SIP - IP"
                    value={data.sip_ip.val}
                    dropdownValue={data.sip_ip.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("sip_ip", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("sip_ip", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="sip_port"
                    label="SIP - Port"
                    placeholder="Enter SIP - Port"
                    value={data.sip_port.val}
                    dropdownValue={data.sip_port.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("sip_port", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("sip_port", e.target.value)
                    }
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="SIP Profile"
                    navigate="/sip-profile/create"
                    columns={columns}
                    data={sipProfileData?.data?.length ? sipProfileData.data : []}
                    page={filter.page}
                    totalCount={sipProfileData?.count || 0}
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
                onDoneClick={() => onDeleteSipProfile(deleteId)}
            />
        </div>
    );
};

export default SipProfile;
