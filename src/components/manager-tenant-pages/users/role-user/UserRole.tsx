"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleUserRoleData,
    useUserRole,
    userRoleDelete,
    userRoleGet,
    userRoleSearch,
    userRoleStatusUpdate,
} from "@/redux/slice/tenant-admin/userRoleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { UserRoleFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: UserRoleFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
};

const UserRole = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const userRole = useUserRole();

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
            name: "name",
            title: "Role Name",
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

    // Fetching User Role Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(userRoleGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get User Role Err =-=>", err);
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
                [data["name"]["key"]]: data["name"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(userRoleSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching User Role Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create User Role Page
    const onCreateUserRole = () =>
        router.push(
            managerName ? "/manager-role-user/create" : "/tenant-role-user/create"
        );

    // Store User Role Data in Redux and Navigate to Edit Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleUserRoleData(data));
            router.push(
                managerName
                    ? "/manager-role-user/" + data?.uuid
                    : "/tenant-role-user/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single User Role Err =-=>", err);
        }
    };

    // Update User Role Status & User Role Normal data fetching
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(userRoleStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update User Role Status Err --->", e?.message);
        }
    };

    // Deleting Selected User Role
    const onDeleteUserRole = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(userRoleDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === userRole?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete User Role Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteUserRole = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                managerName={managerName}
                name={name}
                length={userRole?.count}
                search={filter?.search}
                createText="Create User Role"
                onCreateClick={onCreateUserRole}
                onDeleteClick={onMassDeleteUserRole}
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
                    label="Role Name"
                    placeholder="Enter Role Name"
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
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="User Role"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-role-user/create"
                            : "/tenant-role-user/create"
                    }
                    columns={columns}
                    data={userRole?.data?.length ? userRole.data : []}
                    page={filter.page}
                    totalCount={userRole?.count || 0}
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
                onDoneClick={() => onDeleteUserRole(deleteId)}
            />
        </div>
    );
};

export default UserRole;
