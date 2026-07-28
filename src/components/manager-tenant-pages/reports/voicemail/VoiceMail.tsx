"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    useVoiceMail,
    voiceMailGet,
} from "@/redux/slice/tenant-admin/voiceMailSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { formatTime } from "@/helperFunctions";
import { AudioPlayer } from "@/components/players";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

const VoiceMail = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();
    const voiceMail = useVoiceMail();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
    });

    const [user_uuid, setUser_uuid] = useState<string>("");

    const columns: ColumnsType[] = [
        {
            name: "created_epoch",
            title: "Date & Time",
            sortable: true,
        },
        {
            name: "user",
            title: "User",
            sortable: true,
        },
        {
            name: "phoneNumber",
            title: "Receiver's Number",
            sortable: true,
        },
        {
            name: "duration",
            title: "Duration",
            sortable: true,
            action: (row: any) => {
                const duration = formatTime(parseInt(row?.duration), true);
                return (
                    <>
                        <span>{duration}</span>
                    </>
                );
            },
        },
        {
            name: "path",
            title: "Play/Download",
            sortable: true,
            action: (row: any) => {
                return (
                    <>
                        <AudioPlayer
                            src={`voicemail/download/voicemail?voicemail=${row?.path}`}
                            name={`${row?.user || ""}_${row?.created_epoch || ""}.wav`}
                            index={row?.index}
                        />
                    </>
                );
            },
        },
    ];

    useLayoutEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        setLoading(true);
        try {
            const res: any = await dispatch(userOptionsGet()).unwrap();
            if (res?.statusCode === 200) {
                const user_uuid = res?.data?.[0]?.uuid || "";
                setUser_uuid(user_uuid);
                onGetData({ ...filter, user_uuid });
            }
        } catch (err) {
            setLoading(false);
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Voice Mail Data
    const onGetData = useDebouncedCallback(async (param?: any) => {
        if (!user_uuid) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const params = param
                ? param
                : {
                    ...filter,
                    user_uuid,
                };
            await dispatch(voiceMailGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Voice Mail Err =-=>", err);
        }
    }, 500);

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                filterOpen={true}
                search={filter?.search}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        search: e.target.value,
                    });
                }}
                onSearchClick={() => {
                    setFilter({ ...filter, page: 1, limit: 10 });
                }}
            >
                <Select
                    name="user_uuid"
                    label="User"
                    placeholder="Select User"
                    value={user_uuid}
                    options={userOptions}
                    onChange={(e: any) => {
                        setUser_uuid(e.target.value);
                    }}
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    data={voiceMail?.data?.length ? voiceMail.data : []}
                    page={filter.page}
                    totalCount={voiceMail?.count || 0}
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
        </div>
    );
};

export default VoiceMail;
