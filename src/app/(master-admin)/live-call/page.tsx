"use client";
import { useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
  useLiveCall,
  liveCallGet,
} from "@/redux/slice/master-admin/liveCallSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Head, Table } from "@/components/ui-components";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

const LiveCall = () => {
  const dispatch = useAppDispatch();
  const liveCall = useLiveCall();
  const [loading, setLoading] = useState<boolean>(true);

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
  });

  const columns: ColumnsType[] = [
    {
      name: "date",
      title: "Date",
      sortable: true,
    },
    {
      name: "tenant",
      title: "Tenant",
      sortable: true,
    },
    {
      name: "user",
      title: "User",
      sortable: true,
    },
    {
      name: "caller_id_name_number",
      title: "Caller-ID",
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
      await dispatch(liveCallGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Live Call Err =-=>", err);
    }
  }, 500);

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
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
    </div>
  );
};

export default LiveCall;
