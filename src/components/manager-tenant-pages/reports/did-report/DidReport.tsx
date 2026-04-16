"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

// PROJECT IMPORT
import { InputSelect, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { useTenantAllDids, useTenantDids, didReportGet, didReportSearchGet } from "@/redux/slice/tenant-admin/didReportSlice";
import { AppDispatch } from "@/redux/store";

// NAME STATE
const initialValues = {
  created_at: { key: "created_at", val: new Date().setHours(0, 0, 1), dropdown: "4" },
  updated_at: { key: "updated_at", val: new Date().setHours(23, 59, 59), dropdown: "4" },
  number: { key: "number|1", val: "", dropdown: "1" },
  timeout: { key: "timeout|1", val: "", dropdown: "1" },
  user_name: { key: "user_name|1", val: "", dropdown: "1" },
};

const columns: ColumnsType[] = [
  {
    name: "created_at",
    title: "Created Date",
    sortable: true,
    action: (row: any) => (row.created_at ? formatDate(row.created_at) : "-"),
  },
  {
    name: "updated_at",
    title: "Updated Date",
    sortable: true,
    action: (row: any) => (row.updated_at ? formatDate(row.updated_at) : "-"),
  },
  { name: "number", title: "DID Number", sortable: true },
  { name: "timeout", title: "Timeout", sortable: true },
  { name: "user_name", title: "Tenant Name", sortable: true },
];

const DidReport = (props: ManagerPageTypes) => {
  const dispatch = useDispatch<AppDispatch>();
  const { managerName = null, name = null } = props;
  const dids = useTenantDids();
  const allDids = useTenantAllDids();
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
  const [data, setData] = useState<any>(initialValues);
  const [appliedFilter, setAppliedFilter] = useState<any>(initialValues);

  /* ============================== API CALL ============================== */

  useEffect(() => {
    if (!filter.isAdvance) {
      dispatch(didReportGet(filter));
    }
  }, [filter.page, filter.limit, filter.search]);

  /* ============================== DATA MAPPING ============================== */

  const didList = useMemo(() => {
    if (!dids?.data || !Array.isArray(dids.data)) return [];
    return dids.data.map((item: any) => ({
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      number: item.number,
      timeout: item.timeout,
      user_name: item?.tenant?.[0]?.tenant_name || "",
    }));
  }, [dids]);

  const filteredData = useMemo(() => {
    return didList.filter((row: any) => {
      let createdFrom = appliedFilter.created_at.val ? new Date(appliedFilter.created_at.val) : null;
      let createdTo = appliedFilter.updated_at.val ? new Date(appliedFilter.updated_at.val) : null;
      let rowCreated = new Date(row.created_at);

      if (createdFrom && rowCreated < createdFrom) return false;
      if (createdTo && rowCreated > createdTo) return false;

      if (appliedFilter.number.val && !row.number.includes(appliedFilter.number.val)) return false;
      if (appliedFilter.timeout.val && !row.timeout.includes(appliedFilter.timeout.val)) return false;
      if (appliedFilter.user_name.val && !row.user_name.toLowerCase().includes(appliedFilter.user_name.val.toLowerCase())) return false;

      return true;
    });
  }, [appliedFilter, didList]);

  const prepareExportProps = () => ({
    headers: columns.map((col) => ({ label: col.title, key: col.name })),
    data: filteredData,
    filename: "DID_Report.csv",
    // sheetName: "DID Report",
  });

  const handlechange = (key: string, val: any) => {
    setData((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], val },
    }));
  };

  const handleSelect = (key: string, val: any) => {
    setData((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], val },
    }));
  };

  const onEmptySearch = () => {
    setData(initialValues);
    setFilter((prev) => ({
      ...prev,
      search: "",
      isAdvance: false,
    }));
  };

  const handleSearch = (value: string) => {
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleLimitChange = (limit: number) => {
    setFilter((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handleAdvanceSearch = () => {
    setFilter((prev) => ({
      ...prev,
      isAdvance: !prev.isAdvance,
    }));
  };
  const getUniqueOptions = (key: keyof typeof didList[0]) => {
    const seen: Record<string, boolean> = {};
    const uniqueOptions: { label: string; value: string }[] = [];

    didList.forEach((item: typeof didList[0]) => {
      const val = item[key];
      if (!seen[val]) {
        seen[val] = true;
        uniqueOptions.push({ label: val, value: val });
      }
    });

    return uniqueOptions;
  };
  const dropdownOptions = useMemo(() => ({
    number: getUniqueOptions("number"),
    timeout: getUniqueOptions("timeout"),
    user_name: getUniqueOptions("user_name"),
  }), [didList]);

  const onGetAllDids = async () => {
    setCsvLoading(true);
    try {
      const payload: Record<string, any> = {};

      if (filter?.isAdvance) {
        Object.entries(data).forEach(([key, obj]: any) => {
          if (obj.val) {
            if (key === "created_at" || key === "updated_at") {
              payload[obj.key] = formatDate(obj.val, true);
            } else {
              payload[obj.key] = obj.val;
            }
          }
        });

        payload.page = filter.page;
        payload.limit = dids?.count || 0;
      } else {
        Object.assign(payload, {
          ...filter,
          limit: dids?.count || 0,
        });
        delete payload["isAdvance"];
      }

      console.log("DID Payload =>", payload);

      setIsCsvDownload(true);
    } catch (err) {
      console.error("Get All DIDs Error =>", err);
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        search={filter?.search}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => onGetAllDids()}
        onChange={(e: any) => {
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            search: e.target.value,
            isAdvance: false,
          });
        }}
        onSearchClick={() => {
          const payload: any = {};
          Object.entries(data).forEach(([key, obj]: any) => {
            if (obj.val) {
              payload[obj.key] = key === "created_at" || key === "updated_at" ? formatDate(obj.val, true) : obj.val;
            }
          });
          payload.page = 1;
          payload.limit = filter.limit;
          dispatch(didReportSearchGet(payload));
          setAppliedFilter(data);
          setFilter({ ...filter, page: 1, isAdvance: true });
        }}
        onHide={onEmptySearch}
      >
        <DatePicker name="created_at" label="Created Date From" value={data.created_at.val} onChange={(val: any) => handlechange("created_at", val)} />
        <DatePicker name="updated_at" label="Created Date To" value={data.updated_at.val} onChange={(val: any) => handlechange("updated_at", val)} />
        <Select name="number" label="DID Number" placeholder="Select DID Number" removable value={data.number.val} options={dropdownOptions.number} onChange={(e: any) => handlechange("number", e.target.value)} />
        <Select name="timeout" label="Timeout" placeholder="Select Timeout" removable value={data.timeout.val} options={dropdownOptions.timeout} onChange={(e: any) => handlechange("timeout", e.target.value)} />
        <Select name="user_name" label="Tenant Name" placeholder="Select Tenant Name" removable value={data.user_name.val} options={dropdownOptions.user_name} onChange={(e: any) => handlechange("user_name", e.target.value)} isInfo />
      </Head>
      <div className="mt-5">
        <Table
          managerName={managerName}
          isLoading={false}
          columns={columns}
          data={filteredData}
          page={filter.page}
          totalCount={dids?.count || 0}
          limit={filter.limit}
          selectable={false}
          onPageClick={(page: number) => setFilter({ ...filter, page })}
          onLimitChange={(limit: number) => setFilter({ ...filter, limit, page: 1 })}
          onRefresh={() => setFilter({ ...filter })}
        />
      </div>
    </div>
  );
};

export default DidReport;