"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    useLeadReport,
    leadReportGet,
} from "@/redux/slice/tenant-admin/leadReportSlice";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

const LeadReport = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const leadGroupOptions = useLeadGroupOptions();
    const leadReport = useLeadReport();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
    });

    const [lead_uuid, setLead_uuid] = useState<string>();

    const columns: ColumnsType[] = [
        {
            name: "code",
            title: "Code",
            sortable: false,
        },
        {
            name: "disposition_name",
            title: "Name",
            sortable: false,
        },
        {
            name: "disposition_count",
            title: "0",
            sortable: false,
        },
        {
            name: "1",
            title: "1",
            sortable: false,
        },
        {
            name: "2",
            title: "2",
            sortable: false,
        },
        {
            name: "3",
            title: "3",
            sortable: false,
        },
        {
            name: "4",
            title: "4",
            sortable: false,
        },
        {
            name: "5",
            title: "5",
            sortable: false,
        },
        {
            name: "6",
            title: "6",
            sortable: false,
        },
        {
            name: "7",
            title: "7",
            sortable: false,
        },
        {
            name: "8",
            title: "8",
            sortable: false,
        },
        {
            name: "9",
            title: "9",
            sortable: false,
        },
        {
            name: "10",
            title: "10",
            sortable: false,
        },
        {
            name: "11",
            title: "11",
            sortable: false,
        },
        {
            name: "12",
            title: "12",
            sortable: false,
        },
        {
            name: "13",
            title: "13",
            sortable: false,
        },
        {
            name: "14",
            title: "14",
            sortable: false,
        },
        {
            name: "sub_total",
            title: "Subtotal",
            sortable: false,
            isBold: true,
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
            const res: any = await dispatch(leadGroupOptionsGet()).unwrap();
            if (res?.statusCode === 200) {
                const lead_uuid = res?.data?.[0]?.uuid || "";
                setLead_uuid(lead_uuid);
                onGetData({ ...filter, lead_uuid });
            }
        } catch (err) {
            setLoading(false);
            console.error("Get Leads Options Err =-=>", err);
        }
    };

    // Fetching Lead Report Data
    const onGetData = useDebouncedCallback(async (param?: any) => {
        setLoading(true);
        if (!lead_uuid) {
            setLoading(false);
            return;
        }
        try {
            const params = param
                ? param
                : {
                    ...filter,
                    lead_uuid,
                };
            await dispatch(leadReportGet(params)).unwrap();

            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Lead Report Err =-=>", err);
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
                    name="lead_uuid"
                    label="Lead Group"
                    placeholder="Lead Group"
                    value={lead_uuid}
                    options={leadGroupOptions}
                    onChange={(e: any) => {
                        setLead_uuid(e.target.value);
                    }}
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    data={leadReport?.length ? leadReport : []}
                    selectable={false}
                    pagination={false}
                />
            </div>
        </div>
    );
};

export default LeadReport;
