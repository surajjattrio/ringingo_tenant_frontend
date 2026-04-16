"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useUsers,
    userDelete,
    userGet,
    userReset,
    userSearch,
    userUpdateStatus,
} from "@/redux/slice/tenant-admin/userSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal, Modal } from "@/components/modals";
import { io } from "socket.io-client";
import { apiInstance } from "@/redux/axiosApi";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { UserAdvanceFilterTypes } from "@/types/advancedFilterTypes";

// THIRD - PARTY
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import {
    useUserGroupsOptions,
    userGroupOptionsGet,
} from "@/redux/slice/tenant-admin/userGroupSlice";
import { useAuth } from "@/contexts/hooks/useAuth";

// NAME STATE
const initialValues: UserAdvanceFilterTypes = {
    username: { key: "username|1", val: "", dropdown: "1" },
    user_group_uuid: { key: "user_group_uuid|4", val: "", dropdown: "4" },
    email: { key: "email|1", val: "", dropdown: "1" },
};

const User = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const users = useUsers();
    const userGroupOptions = useUserGroupsOptions();
    const baseUrl = `${process.env.BASE_URL}`;

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [resetId, setResetId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");
    const [recording, setRecording] = useState<string>("0");
    const [logoutId, setLogoutId] = useState<any>("");

    const columns: ColumnsType[] = [
        {
            name: "username",
            title: "Username",
            sortable: true,
        },
        {
            name: "fullname",
            title: "Full Name",
            sortable: true,
        },
        {
            name: "user_group_name",
            title: "User Group",
            sortable: true,
        },
        {
            name: "email",
            title: "Email",
            sortable: true,
        },
        {
            name: "sip_device",
            title: "Default SIP Device",
            sortable: true,
        },
        {
            name: "recording",
            title: "Call Recording",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
            action: (row: any) => {
                return (
                    <>
                        {managerName ? (
                            row?.manager_uuid ? (
                                <div className="flex gap-2">
                                    {isShowButton("edit") && (
                                        <Icon
                                            tooltip="Edit"
                                            name="Edit"
                                            width={20}
                                            height={20}
                                            alt="Edit"
                                            onClick={() => onEditClick(row)}
                                        />
                                    )}
                                    {isShowButton("delete") && (
                                        <Icon
                                            tooltip="Delete"
                                            name="DeleteRed"
                                            width={20}
                                            height={20}
                                            alt="Delete"
                                            onClick={() => setDeleteId(row.uuid)}
                                        />
                                    )}
                                    {/* <Icon
                                        tooltip="Reset"
                                        name="Refresh2"
                                        width={20}
                                        height={20}
                                        alt="Reset"
                                        onClick={() => setResetId(row?.uuid)}
                                    />

                                    <Icon
                                        tooltip="Logout"
                                        name="Exit"
                                        width={20}
                                        height={20}
                                        alt="Exit"
                                        onClick={() => setLogoutId(row?.uuid)}
                                    /> */}

                                </div>
                            ) : null
                        ) : (
                            <div className="flex gap-2">
                                <Icon
                                    tooltip="Edit"
                                    name="Edit"
                                    width={20}
                                    height={20}
                                    alt="Edit"
                                    onClick={() => onEditClick(row)}
                                />
                                <Icon
                                    tooltip="Delete"
                                    name="DeleteRed"
                                    width={20}
                                    height={20}
                                    alt="Delete"
                                    onClick={() => setDeleteId(row?.uuid)}
                                />
                                {/* <Icon
                                    tooltip="Reset"
                                    name="Refresh2"
                                    width={20}
                                    height={20}
                                    alt="Reset"
                                    onClick={() => setResetId(row?.uuid)}
                                />
                                <Icon
                                    tooltip="Logout"
                                    name="Exit"
                                    width={20}
                                    height={20}
                                    alt="Exit"
                                    onClick={() => setLogoutId(row?.uuid)}
                                /> */}

                            </div>
                        )}
                    </>
                );
            },
        },
    ];

    const isShowButton = (buttontype: string) => {
        const data = user?.manager_detail?.roles?.length
            ? user?.manager_detail?.roles[0]
            : {};

        if (data?.module_permission["lead-management"]?.[buttontype] === "0") {
            return true;
        }

        return false;
    };

    const onLogoutUser = async (id: string) => {
        try {
            // const res: any = await apiInstance.patch(
            //     UPDATE_AUTH_STATUS + `/${id}`,
            //     { is_logged_in: "1" }
            //   );

            const newdata: any = await apiInstance.get(`user` + `/${id}`);
            if (newdata && newdata?.statusCode === 200) {
                const socket = io(baseUrl, {
                    query: {
                        token: newdata.data.browserToken,
                        uuid: id,
                        new_token: "force",
                    },
                });
                console.log(socket);
                //Success(res?.data);
            }
            // } else {
            //     //Danger(res?.data);
            // }
            setLogoutId("");
        } catch (err) {
            setLogoutId("");
            console.error("Logout User Err =-=>", err);
        }
    };

    // Fetching User Group Options
    const onGetUserGroupOptions = () => {
        try {
            dispatch(userGroupOptionsGet());
        } catch (err) {
            console.error("Get User Group Options Err =-=>", err);
        }
    };

    useEffect(() => {
        onGetUserGroupOptions();
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

    // Fetching Users Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(userGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Users Err =-=>", err);
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

    // Advance Search - Fetching Users Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["username"]["key"]]: data["username"]["val"],
                [data["user_group_uuid"]["key"]]: data["user_group_uuid"]["val"],
                [data["email"]["key"]]: data["email"]["val"],
                recording,
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(userSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching User Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create User Page
    const onCreateUser = () =>
        router.push(managerName ? "/manager-user/create" : "/tenant-user/create");

    // Navigate to Edit User Page
    const onEditClick = (data: any) =>
        router.push(
            managerName ? "/manager-user/" + data?.uuid : "/tenant-user/" + data?.uuid
        );

    // Update User Status & Fetching User Data
    const onUpdateStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(userUpdateStatus(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                setFilter({ ...filter });
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update User Status Err =-=>", err);
        }
    };

    // Reset User
    const onResetUser = async (id: string) => {
        try {
            const payload = {
                id,
                is_logged_in: "1",
            };
            const res: any = await dispatch(userReset(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
            } else {
                Danger(res?.data);
            }
            setResetId("");
        } catch (err) {
            setResetId("");
            console.error("Reset User Err =-=>", err);
        }
    };

    // Deleting Selected User & Fetching User Data
    const onDeleteUsers = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(userDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === users?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete User Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteUser = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={users?.count || 0}
                createText="Create User"
                search={filter?.search}
                onCreateClick={onCreateUser}
                onDeleteClick={onMassDeleteUser}
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
                    name="user_group_uuid"
                    label="User Group"
                    placeholder="Select User Group"
                    removable
                    value={data.user_group_uuid.val}
                    options={userGroupOptions}
                    onChange={(e: any) => handleChnage("user_group_uuid", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    value={data.email.val}
                    dropdownValue={data.email.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("email", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("email", e.target.value)}
                    isInfo
                />
                <Switch
                    trueName="Yes"
                    falseName="No"
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    label="Call Recording"
                    value={recording}
                    onClick={(value: string) => setRecording(value)}
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
                    title="User"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName ? "/manager-user/create" : "/tenant-user/create"
                    }
                    columns={columns}
                    data={users?.data?.length ? users.data : []}
                    page={filter.page}
                    totalCount={users?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
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
                onDoneClick={() => onDeleteUsers(deleteId)}
            />
            {/* <Modal
                visible={!!resetId}
                doneStyle="error"
                title="Reset User"
                content="Are you sure you want to reset User Login?"
                doneText="Reset"
                onDoneClick={() => onResetUser(resetId)}
                onCancelClick={() => setResetId("")}
            />
            <Modal
                visible={!!logoutId}
                doneStyle="error"
                title="Logout User"
                content="Are you sure you want to Logout User?"
                doneText="Logout"
                onDoneClick={() => onLogoutUser(logoutId)}
                onCancelClick={() => setLogoutId("")}
            /> */}
        </div>
    );
};

export default User;
