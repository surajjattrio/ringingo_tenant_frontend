"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

//PROJECT IMPORT
import Head from "@/components/ui-components/Head";
// PROJECT IMPORTS
import {
    rolesGet,
    roleDelete,
    roleSearch,
    roleStatusUpdate,
    useRoleData,
    updateSingleRoleData,
} from "@/redux/slice/tenant-admin/managerRoleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { RolesdvancedFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";

// THIRD-PARTY IMPORTS
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: RolesdvancedFilterTypes = {
    role_name: { key: "role_name|1", val: "", dropdown: "1" },
};

const ManagerRole = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const roleData = useRoleData();
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
            name: "role_name",
            title: "Name",
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

    // Fetching Manager Roles Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(rolesGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get Roles Error --->", e.message);
        }
    }, 500)

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);


    // Navigate to Create Manager Roles Page
    const onCreateRole = () => router.push("/tenant-role-manager/create");

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteRole = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    // Deleting Selected Manager Roles & Fetching Roles Data
    const onDeleteRole = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(roleDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === roleData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Role Delete Err --->", e?.message);
        }
    };

    // Store Single Role Data in Redux & Navigate to Edit Roles Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleRoleData(data));
            router.push("/tenant-role-manager/" + data?.uuid);
        } catch (e: any) {
            console.error("Store Single role data Err --->", e?.message);
        }
    };

    // Advance Search - Trigger when right side Select value change
    const handleSelect = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
        });
    };

    // Advance Search - Trigger when left side Input or Select value change
    const handleChange = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    // Advance Search - Fetching Roles Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["role_name"]["key"]]: data["role_name"]["val"],
                status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(roleSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Roles Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Update Roles Status & Fetching Roles Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(roleStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Role Status Err --->", e?.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                createText="Create Manager Role"
                onCreateClick={onCreateRole}
                onDeleteClick={onMassDeleteRole}
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
                    name="role_name"
                    label={
                        <>
                            Role Name <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter role name"
                    value={data.role_name.val}
                    dropdownValue={data.role_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChange("role_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("role_name", e.target.value)
                    }
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
                    title="Manager Roles"
                    navigate="/tenant-role-manager/create"
                    columns={columns}
                    data={roleData?.data?.length ? roleData.data : []}
                    page={filter.page}
                    totalCount={roleData?.count || 0}
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
                onDoneClick={() => onDeleteRole(deleteId)}
            />
        </div>
    );
}
export default ManagerRole
