"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useVoiceBroadcastData,
    voiceBroadcastDelete,
    voiceBroadcastGet,
    voiceBroadcastStatusUpdate,
    voiceBroadcastSearch,
    voiceBroadcastFeature,
    setProcessedCount,
} from "@/redux/slice/tenant-admin/voiceBroadcastSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, InputSelect, Switch } from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { Danger, Success } from "@/redux/services/toasterServices";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { DatePicker } from "@/components/pickers";
import { advanceSearchOptions } from "@/config/options";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { voiceBroadcastFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { format } from "date-fns";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: voiceBroadcastFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    broadcast_start: { key: "broadcast_start", val: "", dropdown: "4" },
    broadcast_end: { key: "broadcast_end", val: "", dropdown: "4" },
};

const VoiceBroadcast = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const voiceBroadcastData = useVoiceBroadcastData();

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
    const [tableData, setTableData] = useState<any>({});
    const [status, setStatus] = useState<string>("0");

    useEffect(() => {
        setTableData(voiceBroadcastData);
    }, [voiceBroadcastData]);

    const onPlayBroadcast = async (feature: string, data: any) => {
        try {
            let payload = {
                feature: feature,
                start_date: data?.start_date,
                end_date: data?.end_date,
                voice_broadcast_uuid: data?.uuid,
            };
            const res: any = await dispatch(voiceBroadcastFeature(payload)).unwrap();
            if (feature === "fetch-count") {
                dispatch(setProcessedCount({ ...data, showCount: res.data || 0 }));
            } else {
                setFilter({ ...filter });
            }
        } catch (error: any) {
            console.log("play - pause change err--->", error?.message);
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "startDate",
            title: "Start Time",
            sortable: true,
        },
        {
            name: "endDate",
            title: "End Time",
            sortable: true,
        },
        {
            name: "processed",
            title: "Processed",
            action: (row: any) => {
                return (
                    <>
                        {row?.isShowButton ? (
                            <Button
                                className="px-1 py-0.5"
                                text="Show Count"
                                onClick={() => {
                                    onPlayBroadcast("fetch-count", row);
                                }}
                            />
                        ) : (
                            <span>{row?.showCount || 0}</span>
                        )}
                    </>
                );
            },
        },
        {
            name: "running_status",
            title: "Running Status",
            action: (row: any) => {
                return (
                    <>
                        {row?.broadcast_status === "1" || row?.broadcast_status === "2" ? (
                            <div className="flex gap-2">
                                <Icon
                                    className="cursor-pointer"
                                    name={"Pause"}
                                    width={20}
                                    height={20}
                                    alt="Pause"
                                    onClick={() => {
                                        onPlayBroadcast("stop", row);
                                    }}
                                />
                                <Icon
                                    className="cursor-pointer"
                                    name={"stopRed"}
                                    width={20}
                                    height={20}
                                    alt="stopRed"
                                    onClick={() => {
                                        onPlayBroadcast("stop", row);
                                    }}
                                />
                            </div>
                        ) : (
                            <Icon
                                className="cursor-pointer"
                                name={"Play"}
                                width={20}
                                height={20}
                                alt="Play"
                                onClick={() => {
                                    onPlayBroadcast("in-progress", row);
                                }}
                            />
                        )}
                    </>
                );
            },
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
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

    // Fetching Voice Broadcast Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(voiceBroadcastGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Voice Broadcast Err =-=>", err);
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
                [data["broadcast_start"]["key"]]: data["broadcast_start"]["val"]
                    ? format(
                        new Date(data["broadcast_start"]["val"]),
                        "yyyy-MM-dd HH:mm:ss"
                    )
                    : "",
                [data["broadcast_end"]["key"]]: data["broadcast_end"]["val"]
                    ? format(
                        new Date(data["broadcast_end"]["val"]),
                        "yyyy-MM-dd HH:mm:ss"
                    )
                    : data["broadcast_start"]["val"]
                        ? format(new Date().setHours(23, 59, 59), "yyyy-MM-dd HH:mm:ss")
                        : "",
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(voiceBroadcastSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Voice Broadcast Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create voice-broadcast Page
    const onCreateVoiceBroadcast = () =>
        router.push(
            managerName
                ? "/manager-voice-broadcast/create"
                : "/tenant-voice-broadcast/create"
        );

    // Store Single voice-broadcast Data in Redux & Navigate to Update voice-broadcast Page
    const onEditClick = (data: any) => {
        try {
            dispatch(setActiveTab(0));
            router.push(
                managerName
                    ? "/manager-voice-broadcast/" + data?.uuid
                    : "/tenant-voice-broadcast/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single voice-broadcast Err =-=>", err);
        }
    };

    // Update Voice Broadcast Status & Fetching Voice Broadcast Data
    const onUpdateVoiceBroadCastStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                voiceBroadcastStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update voice-broadcast Status Err --->", e?.message);
        }
    };

    // Deleting Selected Voice Broadcast & Fetching Voice Broadcast Data
    const onDeleteVoiceBroadcast = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(voiceBroadcastDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === tableData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete voice-broadcast Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteVoiceBroadcast = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={tableData?.count || 0}
                createText="Create Voice Broadcast"
                onCreateClick={onCreateVoiceBroadcast}
                onDeleteClick={onMassDeleteVoiceBroadcast}
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
                <DatePicker
                    name="broadcast_start"
                    label="Start Time"
                    placeholder="Enter Start Time"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.broadcast_start.val}
                    startDate={data.broadcast_start.val}
                    endDate={data.broadcast_end.val}
                    maxDate={data.broadcast_end.val || new Date()}
                    onChange={(e: any) => handleChnage("broadcast_start", e)}
                    showTimeSelect
                    selectsStart
                    isInfo
                />
                <DatePicker
                    name="broadcast_end"
                    label="End Time"
                    placeholder="Enter End Time"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.broadcast_end.val}
                    startDate={data.broadcast_start.val}
                    endDate={data.broadcast_end.val}
                    minDate={data.broadcast_start.val}
                    maxDate={new Date()}
                    onChange={(e: any) => handleChnage("broadcast_end", e)}
                    showTimeSelect
                    selectsEnd
                    isInfo
                />
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
                    title="Voice Broadcast"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-voice-broadcast/create"
                            : "/tenant-voice-broadcast/create"
                    }
                    columns={columns}
                    data={tableData?.data?.length ? tableData.data : []}
                    page={filter.page}
                    totalCount={tableData?.count || 0}
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
                    onUpdateStatus={onUpdateVoiceBroadCastStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteVoiceBroadcast(deleteId)}
            />
        </div>
    );
};

export default VoiceBroadcast;
