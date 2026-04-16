"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    ivrDelete,
    ivrGet,
    ivrSearch,
    ivrStatusUpdate,
    updateSingleIvrData,
    useIvr,
} from "@/redux/slice/tenant-admin/ivrSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { IvrFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, timeoutOptions2 } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: IvrFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    timeout: { key: "timeout|4", val: "", dropdown: "4" },
    invalid_retries: { key: "invalid_retries|1", val: "", dropdown: "1" },
};

const Ivr = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const ivr = useIvr();

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
            title: "Name",
            sortable: true,
        },
        {
            name: "timeout_value",
            title: "Timeout",
            sortable: true,
        },
        {
            name: "invalid_retries",
            title: "Invalid Retries",
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

    // Fetching IVR Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(ivrGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get IVR Err =-=>", err);
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
                [data["timeout"]["key"]]: data["timeout"]["val"],
                [data["invalid_retries"]["key"]]: data["invalid_retries"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(ivrSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching IVR Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create IVR Page
    const onCreateIvr = () =>
        router.push(managerName ? "/manager-ivr/create" : "/tenant-ivr/create");

    // Store Single IVR Data in Redux & Navigate to Update IVR Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleIvrData(data));
            router.push(
                managerName ? "/manager-ivr/" + data?.uuid : "/tenant-ivr/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single IVR Err =-=>", err);
        }
    };

    // Update IVR Status & Fetching IVR Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(ivrStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update IVR Status Err --->", e?.message);
        }
    };

    // Deleting Selected IVR & Fetching IVR Data
    const onDeleteIvr = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(ivrDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === ivr?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete IVR Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteIvr = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={ivr?.count || 0}
                createText="Create IVR"
                onCreateClick={onCreateIvr}
                onDeleteClick={onMassDeleteIvr}
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
                    name="timeout"
                    label="Timeout"
                    placeholder="Select Timeout"
                    removable
                    value={data.timeout.val}
                    options={timeoutOptions2}
                    onChange={(e: any) => handleChnage("timeout", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="invalid_retries"
                    type="number"
                    label="Invalid Retries"
                    placeholder="Select Invalid Retries"
                    value={data.invalid_retries.val}
                    dropdownValue={data.invalid_retries.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("invalid_retries", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("invalid_retries", e.target.value)
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
                    isLoading={loading}
                    title="IVR"
                    name={name}
                    managerName={managerName}
                    navigate={managerName ? "/manager-ivr/create" : "/tenant-ivr/create"}
                    columns={columns}
                    data={ivr?.data?.length ? ivr.data : []}
                    page={filter.page}
                    totalCount={ivr?.count || 0}
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
                onDoneClick={() => onDeleteIvr(deleteId)}
            />
        </div>
    );
};

export default Ivr;
