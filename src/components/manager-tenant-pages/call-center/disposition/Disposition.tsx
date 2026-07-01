"use client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleTenantDispositionData,
    useIsLoading,
    tenantDispositionDelete,
    tenantDispositionGet,
    tenantDispositionSearch,
    tenantDispositionStatusUpdate,
    useTenantDispositionData,
    tenantDispositionUpdate,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Button, InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TenantDispositionFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: TenantDispositionFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    code: { key: "code|1", val: "", dropdown: "1" },
};

const TenantDisposition = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const dispositionData = useTenantDispositionData();
    const campaignOptions = useCampaignOptions();
    console.log(" dispositionData", dispositionData);


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
    const [isBatchUpdate, setIsBatchUpdate] = useState<boolean>(false);
    const [batchCampaign, setBatchCampaign] = useState<any[]>([]);
    const [batchLoading, setBatchLoading] = useState<boolean>(false);

    const [status, setStatus] = useState<string>("0");

    // Build a flat map of campaign UUID -> label from grouped options
    const campaignMap = useMemo(() => {
        const map: Record<string, string> = {};
        campaignOptions?.forEach((group: any) => {
            group?.options?.forEach((opt: any) => {
                if (opt?.value) map[opt.value] = opt.label;
            });
        });
        return map;
    }, [campaignOptions]);

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "code",
            title: "Code",
            sortable: true,
        },
        {
            name: "campaign",
            title: "Campaign",
            sortable: false,
            action: (row: any) => {
                const uuids: string[] = Array.isArray(row?.campaign_uuid) ? row.campaign_uuid : [];
                const names = uuids
                    .map((uuid: string) => campaignMap[uuid])
                    .filter(Boolean);
                if (!names.length) return <span className="text-gray-400">—</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {names.map((name: string, i: number) => (
                            <span
                                key={i}
                                className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            disabled={!!row?.disabled}
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateDispositionStatus(row);
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

    useEffect(() => {
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(campaignOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Campaign Options Err =-=>", err);
        }
    };

    useEffect(() => {
        // onGetTennatDispositionOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetDispositionData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
    // // Fetching disposition Options
    // const onGetTennatDispositionOptions = async () => {
    //     try {
    //         await dispatch(tennatDispositionOptionsGet()).unwrap();
    //     } catch (err) {
    //         console.error("Get Disposition Options Err =-=>", err);
    //     }
    // };

    // Fetching Disposition Data
    const onGetDispositionData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(tenantDispositionGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Disposition Err =-=>", err);
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

    // Advance Search - Fetching Disposition Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["code"]["key"]]: data["code"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(tenantDispositionSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Disposition Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
        onGetDispositionData();
    };

    // Navigate to Create Disposition Page
    const onCreateDisposition = () =>
        router.push(
            managerName ? "/manager-disposition/create" : "/tenant-disposition/create"
        );

    // Navigate to Edit Disposition Page
    //   const onEditClick = (data: any) => router.push("/manager-disposition/" + data?.uuid);

    // Store Single Outgoing Rules Data in Redux & Navigate to Update Outgoing Rules Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleTenantDispositionData(data));
            const editUuid = data?.disposition_uuid || data?.uuid;
            router.push(
                managerName
                    ? "/manager-disposition/" + editUuid
                    : "/tenant-disposition/" + editUuid
            );
        } catch (err) {
            console.error("Store Single Disposition Err =-=>", err);
        }
    };

    // Update Disposition Status & Fetching Disposition Data
    const onUpdateDispositionStatus = async (data: any) => {
        setLoading(true);
        try {
            const statusUuid = data?.disposition_uuid || data?.uuid;
            const payload = {
                status: data.status === "1" ? "0" : "1",
                id: statusUuid,
            };
            const res: any = await dispatch(
                tenantDispositionStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                // onGetDispositionData();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update Disposition Status Err =-=>", err);
        }
    };

    // Deleting Selected Disposition & Fetching Disposition Data
    const onDeleteDisposition = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(tenantDispositionDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === dispositionData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("Failed to delete");
            console.error("Delete Disposition Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteDisposition = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };
    // Batch Update - Update campaign for all selected dispositions
    const onBatchUpdateDisposition = async () => {
        if (!selectedRow.length) {
            Danger("Please select at least one disposition");
            return;
        }
        if (!batchCampaign.length) {
            Danger("Please select at least one campaign");
            return;
        }
        setBatchLoading(true);
        try {
            // Find the full disposition objects for the selected UUIDs
            const selectedDispositions = (dispositionData?.data || []).filter(
                (d: any) => selectedRow.includes(d.disposition_uuid || d.uuid)
            );
            const promises = selectedDispositions.map((d: any) => {
                const id = d.disposition_uuid || d.uuid;
                return dispatch(
                    tenantDispositionUpdate({
                        id,
                        name: d.name?.replace(" (admin)", "") || d.name,
                        code: d.code,
                        status: d.status,
                        level: d.level ?? 0,
                        parent_disposition: d.parent_disposition || "",
                        has_children: d.has_children ?? false,
                        campaign_uuid: batchCampaign.map((c: any) => c.value ?? c),
                        human_answer: d.human_answer === "1" || d.human_answer === 1 ? "1" : "0",
                        sale: d.sale === "1" || d.sale === 1 ? "1" : "0",
                        callback: d.callback === "0" || d.callback === 0 ? "0" : "1",
                    })
                ).unwrap();
            });
            const results: any[] = await Promise.all(promises);
            const allOk = results.every((r) => r?.statusCode === 200);
            if (allOk) {
                Success(`Campaign updated for ${selectedDispositions.length} disposition(s)`);
            } else {
                Danger("Some updates failed. Please try again.");
            }
            setBatchCampaign([]);
            setIsBatchUpdate(false);
            setSelectedRow([]);
            setFilter({ ...filter });
        } catch (err: any) {
            Danger("Batch update failed");
            console.error("Batch Update Disposition Err ==>", err?.message);
        } finally {
            setBatchLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={dispositionData?.count || ""}
                createText="Create Disposition"
                onCreateClick={onCreateDisposition}
                onDeleteClick={onMassDeleteDisposition}
                onBatchUpdateClick={() => setIsBatchUpdate(!isBatchUpdate)}
                batchUpdateDisabled={!selectedRow.length}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        isAdvance: false,
                        page: 1,
                        limit: 10,
                    })
                }
                //onFilterClick={() => setFilterOpen(!filterOpen)}
                onSearchClick={() =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    })
                }
                onHide={() => {
                    onEmptySearch();
                    setIsBatchUpdate(false);
                    setBatchCampaign([]);
                }}
            >
                <InputSelect
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />

                <InputSelect
                    name="code"
                    label="Code"
                    placeholder="Enter Code"
                    value={data.code.val}
                    dropdownValue={data.code.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("code", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("code", e.target.value)}
                    isInfo
                />

                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
            </Head>
            {/* ── Batch Update Panel ── */}
            <div
                className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg border border-slate-200 ${
                    isBatchUpdate ? "" : "hidden"
                }`}
            >
                <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
                    <span className="text-sm font-bold">Batch Update — Campaign</span>
                    <Icon
                        className="cursor-pointer"
                        tooltip="Close"
                        name="Close"
                        width={20}
                        height={20}
                        alt="Close"
                        onClick={() => {
                            setIsBatchUpdate(false);
                            setBatchCampaign([]);
                        }}
                    />
                </div>
                <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 gap-x-4">
                    <Select
                        name="batch_campaign_uuid"
                        isMulti
                        isGroup
                        icon="Group"
                        label="Campaign"
                        placeholder="Select campaigns to assign"
                        options={campaignOptions}
                        value={batchCampaign}
                        onChange={(e: any) => setBatchCampaign(e)}
                        isInfo
                    />
                    <div className="col-span-2 flex items-start pt-6">
                        <p className="text-sm text-gray-500">
                            {selectedRow.length
                                ? `${selectedRow.length} disposition(s) selected. Campaign will be replaced for all of them.`
                                : "Select rows in the table first, then choose a campaign above."}
                        </p>
                    </div>
                </div>
                <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
                    <div className="flex gap-3 px-10">
                        <Button
                            className="px-3 py-2"
                            text="Cancel"
                            style="dark-outline"
                            onClick={() => {
                                setIsBatchUpdate(false);
                                setBatchCampaign([]);
                            }}
                        />
                        <Button
                            className={`px-3 py-2${
                                !batchCampaign.length || !selectedRow.length ? " opacity-60" : ""
                            }`}
                            text={batchLoading ? "Updating..." : "Batch Update"}
                            style="primary"
                            disabled={!batchCampaign.length || !selectedRow.length || batchLoading}
                            onClick={onBatchUpdateDisposition}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={isLoading}
                    title="Disposition"
                    navigate={managerName ? "/manager-disposition/create" : "/tenant-disposition/create"}
                    columns={columns}
                    data={dispositionData?.data?.length ? dispositionData.data : []}
                    page={filter.page}
                    totalCount={dispositionData?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => setFilter({ ...filter, page })}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) => {
                        const deleteUuid = data?.disposition_uuid || data?.uuid;
                        setDeleteId(deleteUuid);
                    }}
                    onSelectRow={(e: any, data: any, array: string[]) => setSelectedRow(array)}
                    onLimitChange={(limit: number) => setFilter({ page: 1, limit })}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteDisposition(deleteId)}
            />
        </div>
    );
};

export default TenantDisposition;
