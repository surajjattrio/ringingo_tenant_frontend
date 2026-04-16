"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useDnc,
    dncGet,
    dncSearch,
    updateSingleDncData,
    dncStatusUpdate,
    dncDelete,
} from "@/redux/slice/tenant-admin/dncSlice";
import {
    useOutboundOptions,
    outboundOptionsGet,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { advanceSearchOptions } from "@/config/options";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { DncFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: DncFilterTypes = {
    phone_number: { key: "phone_number|1", val: "", dropdown: "1" },
    campaign_uuid: { key: "campaign_uuid|4", val: "", dropdown: "4" },
};

const Dnc = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const dnc = useDnc();
    const outboundOptions = useOutboundOptions();

    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
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
            name: "phone_number",
            title: "Phone Number",
            sortable: true,
        },
        {
            name: "campaign_uuid",
            title: "Campaign",
            sortable: true,
            action: (row: any) => (
                <>
                    <span>{row?.campaign?.[0]?.name || ""}</span>
                </>
            ),
        },

        {
            name: "status",
            title: "Status",
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateDncStatus(row);
                            }}
                        />
                    </>
                );
            },
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

    useEffect(() => {
        onGetOutboundOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Outbound Options
    const onGetOutboundOptions = async () => {
        try {
            await dispatch(outboundOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    // Fetching Dnc Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(dncGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Dnc Err =-=>", err);
        }
    }, 500);

    // Fetching All Telecom Circle Data
    const onGetAllDnc = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["phone_number"]["key"]]: data["phone_number"]["val"],
                    page: filter?.page,
                    limit: dnc?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(dncSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = dnc?.count || 0;
                delete params["isAdvance"];
                await dispatch(dncGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err: any) {
            console.error("Get All DNC Err =-=>", err);
        }
    };

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
        try {
            const payload = {
                [data["phone_number"]["key"]]: data["phone_number"]["val"],
                [data["campaign_uuid"]["key"]]: data["campaign_uuid"]["val"],

                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(dncSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Dnc Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Dnc Page
    const onCreateDnc = () =>
        router.push(managerName ? "/manager-dnc/create" : "/tenant-dnc/create");

    // Store Single Dnc Data in Redux & Navigate to Update Dnc Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleDncData(data));
            router.push(
                managerName ? "/manager-dnc/" + data?.uuid : "/tenant-dnc/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Dnc Err =-=>", err);
        }
    };

    // Update Dnc Status & Fetching Dnc Data
    const onUpdateDncStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(dncStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Dnc Status Err --->", e?.message);
        }
    };

    // Deleting Selected Dnc & Fetching Dnc Data
    const onDeleteDnc = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(dncDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === dnc?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete Dnc Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteDnc = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="dnc"
                length={dnc?.count || 0}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllDnc()}
                onImportClick={() =>
                    router.push(managerName ? "manager-dnc/import" : "tenant-dnc/import")
                }
                createText="Create DNC"
                onCreateClick={onCreateDnc}
                onDeleteClick={onMassDeleteDnc}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: false,
                        search: e.target.value,
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
                    name="phone_number"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    value={data.phone_number.val}
                    dropdownValue={data.phone_number.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("phone_number", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("phone_number", e.target.value)
                    }
                    isInfo
                />
                <Select
                    name="campaign_uuid"
                    label="Campaign"
                    placeholder="Select Campaign"
                    removable
                    options={outboundOptions}
                    value={data.campaign_uuid.val}
                    // onChange={(e: any) => {
                    //  setFieldValue("campaign", e.target.value);
                    // }}
                    onChange={(e: any) => handleChnage("campaign_uuid", e.target.value)}
                    isInfo
                />

                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="DNC"
                    navigate={managerName ? "/manager-dnc/create" : "/tenant-dnc/create"}
                    columns={columns}
                    data={dnc?.data?.length ? dnc.data : []}
                    page={filter.page}
                    totalCount={dnc?.count || 0}
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
                            limit,
                        });
                    }}
                    //  onUpdateDncStatus={onUpdateDncStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteDnc(deleteId)}
            />
        </div>
    );
};

export default Dnc;
