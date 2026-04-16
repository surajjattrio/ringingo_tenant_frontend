"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    adminIpMappingDelete,
    adminIpMappingGet,
    adminIpMappingSearch,
    adminIpMappingStatusUpdate,
    updateSingleAdminIpMappingData,
    useAdminIpMappingData,
} from "@/redux/slice/master-admin/adminIpMappingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { IpMappingFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: IpMappingFilterTypes = {
    ip: { key: "ip|1", val: "", dropdown: "1" },
    prefix: { key: "prefix|1", val: "", dropdown: "1" },
};

const IpMapping = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const adminIpMappingData = useAdminIpMappingData();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");

    const columns: ColumnsType[] = [
        {
            name: "ip",
            title: "IP",
            sortable: true,
        },
        {
            name: "prefix",
            title: "Prefix",
            sortable: true,
        },
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

    // Fetching IP Mapping Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(adminIpMappingGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Admin IP Mapping Err =-=>", err);
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

    // Advance Search - Fetching IP Mapping Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["ip"]["key"]]: data["ip"]["val"],
                [data["prefix"]["key"]]: data["prefix"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(adminIpMappingSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching IP Mapping Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create IP Mapping Page
    const onCreateIpMapping = () => router.push("/ip-mapping/create");

    // Store Single IP Mapping Data in Redux & Navigate to Update IP Mapping Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleAdminIpMappingData(data));
            router.push("/ip-mapping/" + data?.uuid);
        } catch (err) {
            console.error("Store Single Admin IP Mapping =-=>", err);
        }
    };

    // Update IP Mapping Status & Fetching IP Mapping Data
    const onUpdateStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(
                adminIpMappingStatusUpdate(payload)
            ).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                setFilter({ ...filter });
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update IP Mapping Err =-=>", err);
        }
    };

    // Deleting Selected IP Mapping & Fetching IP Mapping Data
    const onDeleteIpMapping = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(adminIpMappingDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === adminIpMappingData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete IP Mapping->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteIpMapping = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="ip_mapping"
                createText="Create IP Mapping"
                search={filter?.search}
                onCreateClick={onCreateIpMapping}
                onDeleteClick={onMassDeleteIpMapping}
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
                    name="ip"
                    label="IP"
                    placeholder="Enter IP"
                    value={data.ip.val}
                    dropdownValue={data.ip.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("ip", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("ip", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="prefix"
                    label="Prefix"
                    placeholder="Enter Prefix"
                    value={data.prefix.val}
                    dropdownValue={data.prefix.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("prefix", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("prefix", e.target.value)}
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
                    title="IP Mapping"
                    name="ip_mapping"
                    navigate="/ip-mapping/create"
                    columns={columns}
                    data={adminIpMappingData?.data?.length ? adminIpMappingData.data : []}
                    page={filter.page}
                    totalCount={adminIpMappingData?.count || 0}
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
                onDoneClick={() => onDeleteIpMapping(deleteId)}
            />
        </div>
    );
};

export default IpMapping;
