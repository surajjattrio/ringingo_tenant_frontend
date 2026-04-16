"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    stickyAgentReportDelete,
    stickyAgentReportGet,
    stickyAgentReportSearch,
    useStickyAgentReport,
} from "@/redux/slice/tenant-admin/stickyAgentReportSlice";
import {
    userOptionsGet,
    useUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { StickyAgentReportFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: StickyAgentReportFilterTypes = {
    phone_number: { key: "phone_number|4", val: "", dropdown: "4" },
    user_uuid: { key: "user_uuid", val: [], dropdown: "4" },
};


const StickyAgentReport = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const userOptions = useUserOptions();
    const stickyAgentReport = useStickyAgentReport();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    //const [status, setStatus] = useState<string>("0");

    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "phone_number",
            title: "DID",
            sortable: true,
        },
        {
            name: "username",
            title: "User",
            sortable: true,
        },
        {
            showEdit: false,
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

    // Fetching Outgoing Rules Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet()).unwrap();
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
            await dispatch(stickyAgentReportGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Sticky Agent Report Err =-=>", err);
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
        console.log("Searching with data:", data);
        setLoading(true);
        try {
            const payload = {
                [data["phone_number"]["key"]]: data["phone_number"]["val"],
                [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(stickyAgentReportSearch(payload)).unwrap();
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

    // Deleting Selected User Group & Fetching User Group Data
    const onDeleteStickyAgentReport = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(stickyAgentReportDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === stickyAgentReport?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Sticky Agent Report Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteStickyAgentReport = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="sticky_agent_report"
                managerName={managerName}
                length={stickyAgentReport?.count}
                search={filter?.search}
                onDeleteClick={onMassDeleteStickyAgentReport}
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
                    name="phone_number"
                    label="DID"
                    placeholder="Enter DID"
                    value={data.phone_number.val}
                    dropdownValue={data.phone_number.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("phone_number", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("phone_number", e.target.value)}
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

            </Head>
            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="Sticky Agent Report"
                    managerName={managerName}
                    columns={columns}
                    data={stickyAgentReport?.data?.length ? stickyAgentReport.data : []}
                    page={filter.page}
                    totalCount={stickyAgentReport?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
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
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteStickyAgentReport(deleteId)}
            />
        </div>
    );
};

export default StickyAgentReport;
