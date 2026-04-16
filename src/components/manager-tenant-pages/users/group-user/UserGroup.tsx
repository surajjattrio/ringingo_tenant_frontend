"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleUserGroupData,
    useUserGroup,
    userGroupDelete,
    userGroupGet,
    userGroupSearch,
    userGroupStatusUpdate,
} from "@/redux/slice/tenant-admin/userGroupSlice";
import {
    tenantOutgoingOptionsGet,
    useTenantOutgoingOptions,
} from "@/redux/slice/tenant-admin/tenantOutgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { UserGroupFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: UserGroupFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    outbound_rule: { key: "outbound_rule|4", val: "", dropdown: "4" },
};

const UserGroup = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const outgoingOptions = useTenantOutgoingOptions();
    const userGroup = useUserGroup();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [status, setStatus] = useState<string>("0");

    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "outbound_rule_name",
            title: "Outgoing Rule",
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

    useEffect(() => {
        onGetOutgoingOptions();
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

    // Fetching Outgoing Rules Options
    const onGetOutgoingOptions = async () => {
        try {
            await dispatch(tenantOutgoingOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outgoing Rules Options Err =-=>", err);
        }
    };

    // Fetching User Group Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(userGroupGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get User Group Err =-=>", err);
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

    // Advance Search - Fetching User Group Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["outbound_rule"]["key"]]: data["outbound_rule"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(userGroupSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching User Group Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create User Group Page
    const onCreateUserGroup = () =>
        router.push(
            managerName ? "/manager-group-user/create" : "/tenant-group-user/create"
        );

    // Store Single in Redux & Navigate to Update User Group Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleUserGroupData(data));
            router.push(
                managerName
                    ? "/manager-group-user/" + data?.uuid
                    : "/tenant-group-user/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single User Group Err =-=>", err);
        }
    };

    // Update User Group Status & Fetching User Group Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(userGroupStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update User Group Status Err --->", e?.message);
        }
    };

    // Deleting Selected User Group & Fetching User Group Data
    const onDeleteUserGroup = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(userGroupDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === userGroup?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete User Group Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteUserGroup = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={userGroup?.count}
                createText="Create User Group"
                search={filter?.search}
                onCreateClick={onCreateUserGroup}
                onDeleteClick={onMassDeleteUserGroup}
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
                    placeholder="Enter Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />
                <Select
                    name="outbound_rule"
                    label="Outbound Rule"
                    placeholder="Select Outbound Rule"
                    removable
                    value={data.outbound_rule.val}
                    options={outgoingOptions}
                    onChange={(e: any) => handleChnage("outbound_rule", e.target.value)}
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
                    isLoading={loading}
                    title="User Group"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-group-user/create"
                            : "/tenant-group-user/create"
                    }
                    columns={columns}
                    data={userGroup?.data?.length ? userGroup.data : []}
                    page={filter.page}
                    totalCount={userGroup?.count || 0}
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
                onDoneClick={() => onDeleteUserGroup(deleteId)}
            />
        </div>
    );
};

export default UserGroup;
