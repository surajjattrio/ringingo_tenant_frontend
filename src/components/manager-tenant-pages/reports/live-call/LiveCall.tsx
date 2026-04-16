"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    useTenantLiveCall,
    tenantLiveCallGet,
} from "@/redux/slice/tenant-admin/tenantLiveCallSlice";
import { sipNameOptionsGet } from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useAppDispatch } from "@/redux/hooks";
import LiveCallActionModal from "@/components/tenant-admin/tenant-live-call/LiveCallActionModal";
import { Head, Icon, Table } from "@/components/ui-components";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

const LiveCall = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const liveCall = useTenantLiveCall();

    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);
    const [title, setTitle] = useState<string>("");
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
    });

    useEffect(() => {
        onGetSipNameOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching SIP Devices Options
    const onGetSipNameOptions = async () => {
        try {
            await dispatch(sipNameOptionsGet());
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "date",
            title: "Date",
            sortable: true,
        },
        {
            name: "user",
            title: "User",
            sortable: true,
        },
        {
            name: "caller_id_name_number",
            title: "Caller-Id",
            sortable: true,
        },
        {
            name: "destinationNumber",
            title: "Phone Number",
            sortable: true,
        },
        {
            name: "duration",
            title: "Duration",
            sortable: true,
        },
        {
            name: "type",
            title: "Type",
            sortable: true,
        },
        {
            name: "trunk",
            title: "Trunk",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
            action: (row: any) => {
                return (
                    <>
                        <div className="flex gap-2">
                            <Icon
                                name="UserCalling"
                                width={20}
                                height={20}
                                alt="User"
                                onClick={() => {
                                    setShowModal(true);
                                    setTitle("Monitor");
                                    setData(row);
                                }}
                            />
                            <Icon
                                width={20}
                                name="Eye"
                                height={20}
                                alt="Eye"
                                onClick={() => {
                                    setShowModal(true);
                                    setTitle("Barge");
                                    setData(row);
                                }}
                            />
                            <Icon
                                width={20}
                                name="Ear"
                                height={20}
                                alt="Ear"
                                onClick={() => {
                                    setShowModal(true);
                                    setTitle("Whisper");
                                    setData(row);
                                }}
                            />
                        </div>
                    </>
                );
            },
        },
    ];

    useLayoutEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Live Call Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            await dispatch(tenantLiveCallGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Live Call Err =-=>", err);
        }
    }, 500);

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                search={filter?.search}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        page: 1,
                        limit: 10,
                    })
                }
            />
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    data={liveCall?.data?.length ? liveCall.data : []}
                    page={filter.page}
                    totalCount={liveCall?.count || 0}
                    limit={filter.limit}
                    selectable={false}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
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
            <LiveCallActionModal
                visible={showModal}
                title={title}
                data={data}
                onCancelClick={() => {
                    setShowModal(false);
                    setTitle("");
                    setData(null);
                }}
            />
        </div>
    );
};

export default LiveCall;
