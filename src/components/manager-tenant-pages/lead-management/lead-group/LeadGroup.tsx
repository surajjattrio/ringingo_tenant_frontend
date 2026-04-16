"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const baseUrl = process.env.BASE_URL;


// PROJECT IMPORT
import {
    useIsLoading,
    updateSingleLeadGroupData,
    leadGroupStatusUpdate,
    leadGroupDelete,
    leadGroupSearch,
    leadGroupGet,
    useLeadGroupData,
    leadGroupStatusRemove,
} from "@/redux/slice/tenant-admin/leadGroupSlice";

import { deleteAllLeadsFromLeadGroup, leadGroupExport } from "../../../../redux/slice/tenant-admin/leadGroupSlice";
import { downloadFile } from "../../../../helperFunctions";
import { LEAD_GROUP_DOWNLOAD_LEADS } from "../../../../API/constAPI";

import {
    useUserGroupsOptions,
    userGroupOptionsGet,
} from "@/redux/slice/tenant-admin/userGroupSlice";

import { outboundLeadReset, outboundOptionsGet } from "@/redux/slice/tenant-admin/outboundSlice";

import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
    Button,
    InputSelect,
    MultiDropdown,
    Switch,
    Toggle,
} from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { LeadGroupFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: LeadGroupFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    user_group_uuid: { key: "user_group_uuid|1", val: "", dropdown: "1" },
};

const LeadGroup = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const userGroupOptions = useUserGroupsOptions();
    const leadGroupData = useLeadGroupData();

    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");

    const exportLeads = async (leadGroupName: string, leadGroupUUID: string) => {
        try {
            let payload = {
                name: leadGroupName,
                id: leadGroupUUID
            }
            let res: any = await dispatch(leadGroupExport(payload)).unwrap();
            if (res.statusCode == 200) {
                downloadFile(`${baseUrl}/${LEAD_GROUP_DOWNLOAD_LEADS}?name=${leadGroupName}`, leadGroupName);
            } else {
                Danger(res?.data);
            }
        } catch (error) {
            console.log("Error in exportLeads", error);
        }
    }
    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "user_group_name",
            title: "User Group",
            sortable: true,
        },
        {
            name: "totalLeadCount",
            title: "Total Lead",
            sortable: true,
        },
        {
            name: "human_answer",
            title: "Human Answer",
            sortable: true,
        },
        {
            name: "sale",
            title: "Sale",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateLeadGroupStatus(row);
                            }}
                        />
                    </>
                );
            },
        },
        {
            name: "import_mapper",
            title: "Lead Import",
            sortable: false,
            action: (row: any) => {
                return (
                    <>
                        <Icon
                            name="Inbox"
                            height={20}
                            width={20}
                            tooltip="Import Mapper"
                            onClick={() =>
                                router.push(
                                    managerName
                                        ? "/manager-lead-group/import-mapper/" + row?.uuid
                                        : "/tenant-lead-group/import-mapper/" + row?.uuid
                                )
                            }
                        />
                    </>
                );
            },
        },
        {
            name: "lead_group_name",
            title: "Lead Export",
            sortable: false,
            action: (row: any) => {
                return (
                    <>
                        <Icon
                            name="Export"
                            height={20}
                            width={20}
                            tooltip="Export"
                            onClick={() => exportLeads(row.name, row.uuid)}
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
        onGetUserGroupOptions();
        onGetOutboundOptions;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetLeadGroupData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching User Group Options
    const onGetUserGroupOptions = async () => {
        try {
            await dispatch(userGroupOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get User Group Options Err =-=>", err);
        }
    };

    // Fetching Outbound Options
    const onGetOutboundOptions = async () => {
        try {
            await dispatch(outboundOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    // Fetching Lead Group Data
    const onGetLeadGroupData = useDebouncedCallback(async () => {
        try {
            const params = { ...filter };
            await dispatch(leadGroupGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Lead Group Err =-=>", err);
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
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["user_group_uuid"]["key"]]: data["user_group_uuid"]["val"],
                status,
            };
            await dispatch(leadGroupSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Lead Group Data
    const onEmptySearch = () => {
        setData(initialValues);
        onGetLeadGroupData();
    };

    // Navigate to Create Lead Group Page
    const onCreateLeadGroup = () =>
        router.push(
            managerName ? "/manager-lead-group/create" : "/tenant-lead-group/create"
        );

    // Navigate to Edit Lead Group Page
    //  const onEditClick = (data: any) => router.push("/tenant-lead-group/" + data?.uuid);

    // Store Single Lead Group Data in Redux & Navigate to Update Lead Group Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleLeadGroupData(data));
            router.push(
                managerName
                    ? "/manager-lead-group/" + data?.uuid
                    : "/tenant-lead-group/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Lead Group Err =-=>", err);
        }
    };

    const onReset = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                campaign_uuid: val?.campaign_uuid,
                lead_group_uuid: val?.uuid,
            };
            const res: any = await dispatch(outboundLeadReset(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                // onGetLeadGroup();
            } else {
                Danger(res?.data);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.error("Rseet Lead Group Err =-=>", err);
        }
    };

    // REMOVE LEAD
    const onRemoveLeadGroupStatus = async (data: any) => {
        try {
            const payload = {
                campaign_uuid: data?.campaign_uuid,
                lead_group_uuid: data?.uuid,
            };
            const res: any = await dispatch(leadGroupStatusRemove(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                // onGetLeadGroup();
            } else {
                Danger(res?.data);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.error("Remove Lead Group Status Err =-=>", err);
        }
    };

    // Update Lead Group Status & Fetching Lead Group Data
    const onUpdateLeadGroupStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(leadGroupStatusUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                data?.status === "0" ? onRemoveLeadGroupStatus(data) : onReset(data);
                onGetLeadGroupData();
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update Lead Group Status Err =-=>", err);
        }
    };

    // Deleting Selected Lead Group & Fetching Lead Group Data
    const onDeleteLeadGroup = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(leadGroupDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === leadGroupData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });

            Success("Successfully Deleted");
            await dispatch(deleteAllLeadsFromLeadGroup(id)).unwrap();

        } catch (e: any) {
            setLoading(false);
            console.error("Delete Lead Group Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteLeadGroup = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                managerName={managerName}
                name={name}
                length={leadGroupData?.count || 0}
                createText="Create Lead Group"
                onCreateClick={onCreateLeadGroup}
                onDeleteClick={onMassDeleteLeadGroup}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                    })
                }
                onSearchClick={onSearchData}
                onHide={onEmptySearch}
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

                <MultiDropdown
                    name="user_group_uuid"
                    label="User Group"
                    placeholder="Enter User Group"
                    value={data.user_group_uuid.val}
                    dropdownValue={data.user_group_uuid.dropdown}
                    options1={userGroupOptions}
                    options2={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("user_group_uuid", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("user_group_uuid", e.target.value)
                    }
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
                    isLoading={isLoading}
                    title="Lead Group"
                    name={name}
                    managerName={managerName}
                    navigate={managerName ? "/manager-lead-group/create" : "/tenant-lead-group/create"}
                    columns={columns}
                    data={leadGroupData?.data?.length ? leadGroupData.data : []}
                    page={filter.page}
                    totalCount={leadGroupData?.count || 0}
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
                    //onUpdateLeadGroupStatus={onUpdateLeadGroupStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteLeadGroup(deleteId)}
            />
        </div>
    );
};

export default LeadGroup;
