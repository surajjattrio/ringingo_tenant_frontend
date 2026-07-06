"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
  useLead,
  leadDelete,
  leadSearch,
  leadGet,
  leadBatchUpdate,
  useAllLead,
  leadAllSearch,
  leadAllGet,
  getSingleLeadInfo,        // ✅ ADDED
} from "@/redux/slice/tenant-admin/leadManagementSlice";
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  leadGroupOptionsGet,
  useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Button, Input, InputSelect, Select } from "@/components/forms";
import { Filter, Icon, Table } from "@/components/ui-components";
import { useAuth } from "@/contexts/hooks/useAuth";
import { SearchBar, DatePicker } from "@/components/pickers";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
// import {
//   dispositionOptionsGet,
//   useDispositionOptions,
// } from "@/redux/slice/master-admin/dispositionSlice";
import LeadInformation from "@/components/tenant-admin/lead-management/LeadInformation";
import Note from "@/components/tenant-admin/lead-management/Note";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import { CSVLink } from "react-csv";
import { format } from "date-fns";

// TYPES IMPORT
import { LeadFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import DispositionTree from "@/components/tenant-admin/outbound-campaign/DispositionTree";
import { tenantDispositionOptionsGet, useTenantDispositionOptions } from "@/redux/slice/tenant-admin/tenantDispositionSlice";

const level: any = 1;
// NAME STATE
const initialValues: LeadFilterTypes = {
  first_name: { key: "first_name|1", val: "", dropdown: "1" },
  last_name: { key: "last_name|1", val: "", dropdown: "1" },
  phone_number: { key: "phone_number|1", val: "", dropdown: "1" },
  phone_code: { key: "phone_code|1", val: "", dropdown: "1" },
  user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
  lead_group_uuid: { key: "lead_group_uuid|4", val: "", dropdown: "4" },
  lead_status: { key: "lead_status|4", val: "", dropdown: "4" },
  lead_status_1: { key: "lead_status_1|4", val: "", dropdown: "4" },
  lead_status_2: { key: "lead_status_2|4", val: "", dropdown: "4" },
  date_filter_type: { key: "date_filter_type", val: "createdAt", dropdown: "" },
  start_date: { key: "start_date", val: "", dropdown: "" },
  end_date: { key: "end_date", val: "", dropdown: "" },
};

const initialBatchValues = {
  user_uuid: "",
  lead_group_uuid: "",
  lead_status: "",
};

// DATA
const headers: any = [
  { label: "Lead Group", key: "lead_group_name" },
  { label: "First Name", key: "first_name" },
  { label: "Last Name", key: "last_name" },
  { label: "Phone Code", key: "phone_code" },
  { label: "Phone Number", key: "phone_number" },
  { label: "User", key: "user_name" },
  // { label: "Product Name", key: "product1" },
  { label: "Campaign", key: "campaign_name" },
  { label: "Lead Group", key: "lead_group_name" },
  { label: "Gender", key: "genderValue" },
  { label: "Description", key: "description" },
  { label: "Lead Status 0", key: "leadStatus" },
  { label: "Lead Status 1", key: "leadStatus1" },
  { label: "Lead Status 2", key: "leadStatus2" },
  { label: "Country", key: "country" },
  { label: "Address", key: "address" },
  { label: "City", key: "city" },
  { label: "State", key: "state" },
  { label: "Province", key: "province" },
  { label: "Postal Code", key: "postal_code" },
  { label: "DOB", key: "dob" },
  { label: "Alternate Phone Number", key: "alternate_phone_number" },
  { label: "Email", key: "email" },
  { label: "User", key: "user_name" },
  { label: "Created Date", key: "createdAt" },
  { label: "Updated Date", key: "updatedAt" },
];

const LeadManagement = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lead = useLead();
  // console.log("leadd", lead);
  const userOptions = useUserOptions();
  const leadGroupOptions = useLeadGroupOptions();
  // const leadStatusOptions = useDispositionOptions();
  // console.log("leadStatusOptions", leadStatusOptions);
  const dispositionOptions = useTenantDispositionOptions();

  const allLeadData = useAllLead();
  const [showDispoModal, setShowDispoModal] = useState<boolean>(false);
  const [dispoName, setDispoName] = useState<string>();
  const modalRef: any = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDispoModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [noteData, setNoteData] = useState<any>(null);
  const [leadUuid, setLeadUuid] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewModalLoading, setViewModalLoading] = useState<boolean>(false); // ✅ ADDED
  const [showAllCdrs, setShowAllCdrs] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Timeline");

  // Safe date parsing helper for "YYYY-MM-DD HH:mm:ss"
  const toDateSafe = (v: any) => {
    if (!v) return null;
    try {
      const s = String(v);
      const normalized = s.includes(" ") && !s.includes("T") ? s.replace(" ", "T") : s;
      const d = new Date(normalized);
      if (isNaN(d.getTime())) return null;
      return d;
    } catch {
      return null;
    }
  };

  const addIST = (d: Date | null): Date | null => {
    if (!d) return null;
    return new Date(d.getTime() + 330 * 60 * 1000);
  };

  // ✅ UPDATED: fetch full lead data via getSingleLeadInfo before opening modal
  const handleView = async (row: any) => {
    setShowAllCdrs(false);
    setActiveTab("Timeline");
    setViewData(null);
    setOpenViewModal(true);
    setViewModalLoading(true);
    try {
      const res: any = await dispatch(getSingleLeadInfo(row?.lead_management_uuid)).unwrap();
      if (res && res?.statusCode === 200) {
        // Store the full API response so tabs can extract lead_information + cdrs_and_notes
        setViewData(res);
      } else {
        // Fallback: use the row data directly
        setViewData(row);
      }
    } catch (error: any) {
      console.log("Error fetching lead info for view modal:", error?.message);
      setViewData(row);
    }
    setViewModalLoading(false);
  };

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<any>("");
  const [data, setData] = useState<any>(initialValues);
  const [infoData, setInfoData] = useState<any>(null);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBatchUpdate, setIsBatchUpdate] = useState<boolean>(false);
  const [isBatchDelete, setIsBatchDelete] = useState<boolean>(false);
  const [batchDeleteScope, setBatchDeleteScope] = useState<"all_filtered" | "current_page">("all_filtered");
  const [batchDetails, setBatchDetails] = useState(initialBatchValues);
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

  const [allDispoOptions, setAllDispoOptions] = useState<any>([]);
  const [selectedDispositions, setSelectedDispositions] = useState<any[]>([]);

  const handleDispositionChange = (level: number, value: string) => {
    const updatedSelections = [...selectedDispositions];
    updatedSelections[level] = value;
    // Remove deeper levels after this one
    updatedSelections.splice(level + 1);
    setSelectedDispositions(updatedSelections);

    // Update your form `data` if needed
    handleChnage(level == 0 ? `lead_status` : `lead_status_${level}`, value);
  };

  const renderDispositionDropdowns = () => {
    const dropdowns = [];
    let currentOptions = allDispoOptions;

    for (let level = 0; level <= selectedDispositions.length; level++) {
      if (!currentOptions || currentOptions.length === 0) break;

      dropdowns.push(
        <Select
          key={`lead-status-${level}`}
          name={level == 0 ? `lead_status` : `lead_status_${level}`}
          label={`Level ${level} Lead Status`}
          placeholder={`Select Level ${level} Lead Status`}
          removable
          value={selectedDispositions[level] || ""}
          options={currentOptions.map((d: any) => ({
            label: d.name,
            value: d.disposition_uuid,
          }))}
          onChange={(e: any) => handleDispositionChange(level, e.target.value)}
          isInfo
        />
      );

      const selectedVal = selectedDispositions[level];
      if (!selectedVal) break;

      const selectedItem = currentOptions.find(
        (d: any) => d.disposition_uuid === selectedVal
      );
      currentOptions = selectedItem?.children || [];
    }

    return dropdowns;
  };

  useEffect(() => {
    const updatedData: any = {};
    selectedDispositions.forEach((val, idx) => {
      updatedData[`lead_status_${idx}`] = val;
    });
    // Merge with existing form state
    // setData(prev => ({ ...prev, ...updatedData }));
  }, [selectedDispositions]);

  const excelRef: any = useRef();

  useEffect(() => {
    if (isCsvDownload && !csvLoading) {
      console.log("innnnn");
      excelRef?.current.link?.click();
      setIsCsvDownload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCsvDownload]);

  const columns: ColumnsType[] = [
    {
      name: "first_name",
      title: "First Name",
      sortable: true,
    },
    {
      name: "last_name",
      title: "Last Name",
      sortable: true,
    },
    {
      name: "phone_code",
      title: "Phone Code",
      sortable: true,
    },
    {
      name: "phone_number",
      title: "Phone Number",
      sortable: true,
    },
    {
      name: "user_name",
      title: "User",
      sortable: true,
    },
    {
      name: "fullname",
      title: "Full Name",
      sortable: true,
    },
    // {
    //   name: "product1",
    //   title: "Product Name",
    //   sortable: true,
    // },
    {
      name: "leadStatus",
      title: "Lead Status 0",
      sortable: true,
    },
    {
      name: "leadStatus1",
      title: "Lead Status 1",
      sortable: true,
    },
    {
      name: "leadStatus2",
      title: "Lead Status 2",
      sortable: true,
    },
    {
      name: "campaign_name",
      title: "Campaign",
      sortable: true,
    },
    {
      name: "lead_group_name",
      title: "Lead Group",
      sortable: true,
    },
    {
      name: "createdAt",
      title: "Created Date",
      sortable: true,
      action: (row: any) => {
        return row?.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss") : "-";
      },
    },
    {
      name: "updatedAt",
      title: "Updated Date",
      sortable: true,
      action: (row: any) => {
        return row?.updatedAt ? format(new Date(row.updatedAt), "yyyy-MM-dd HH:mm:ss") : "-";
      },
    },
    {
      name: "actions",
      title: "Actions",
      action: (row: any) => {
        return (
          <>
            <div className="flex gap-2">
              <Icon
                className="cursor-pointer"
                tooltip="Lead Activity"
                name="Eye"
                width={20}
                height={20}
                alt="view"
                onClick={() => handleView(row)}
              />
              <Icon
                className="cursor-pointer"
                tooltip="Info"
                name="InfoCircle"
                width={20}
                height={20}
                alt="info"
                onClick={() => {
                  setInfoData(row?.lead_management_uuid);
                  setLeadUuid(row?.lead_management_uuid);
                  setNoteData(null);
                }}
              />
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
                onClick={() => setDeleteId(row.uuid)}
              />
            </div>
          </>
        );
      },
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

  useEffect(() => {
    onGetUserOptions();
    onGetLeadGroupOptions();
    onGetLeadStatusOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching User Options
  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet());
    } catch (err) {
      console.error("Get User Options Err =-=>", err);
    }
  };

  // Fetching Lead Group Options
  const onGetLeadGroupOptions = async () => {
    try {
      await dispatch(leadGroupOptionsGet());
    } catch (err) {
      console.error("Get Lead Group Options Err =-=>", err);
    }
  };

  // Fetching Lead Status Options
  const onGetLeadStatusOptions = async () => {
    try {
      const res: any = await dispatch(tenantDispositionOptionsGet());
      setAllDispoOptions(res?.payload?.data)
      // console.log("resss",res?.payload?.data);

    } catch (err) {
      console.error("Get Lead Status Options Err =-=>", err);
    }
  };

  // const prepareCsvProps = () => {
  //   const data = allLeadData?.data || [];
  //   return { headers, data, filename: `CDRs_${allLeadData?.count || 0}.csv` };
  // };

  const prepareCsvProps = () => {
    // Flatten custom_fields into normalized top-level keys and stringify arrays/objects so each custom field becomes its own CSV column
    const rows = (allLeadData?.data || []).map((item: any) => {
      const base: any = { ...item, product1: item?.product1 || item?.product?.name || item?.product_name || "" };
      if (item?.custom_fields && typeof item.custom_fields === "object") {
        Object.entries(item.custom_fields).forEach(([k, v]: any) => {
          const normalizedKey = `custom_${String(k).replace(/\s+/g, "_")}`;
          let value: any = v;
          if (Array.isArray(v)) {
            value = v
              .map((el: any) => {
                if (el && typeof el === "object") return el.label ?? el.value ?? JSON.stringify(el);
                return String(el);
              })
              .join(", ");
          } else if (v && typeof v === "object") {
            value = v.label ?? v.value ?? JSON.stringify(v);
          }
          base[normalizedKey] = value;
        });
      }
      return base;
    });

    // Collect all unique custom field normalized keys across all rows to build headers dynamically
    const customLabelMap: Map<string, string> = new Map();
    (allLeadData?.data || []).forEach((item: any) => {
      if (item?.custom_fields && typeof item.custom_fields === "object") {
        Object.keys(item.custom_fields).forEach((k: string) => {
          const normalized = `custom_${String(k).replace(/\s+/g, "_")}`;
          if (!customLabelMap.has(normalized)) customLabelMap.set(normalized, k);
        });
      }
    });

    // Build dynamic headers: keep existing headers except the generic `custom_fields` and append custom field headers (label kept as original key)
    const baseHeaders = headers.filter((h: any) => h.key !== "custom_fields");
    const customHeaders = Array.from(customLabelMap.entries()).map(([norm, label]) => ({ label, key: norm }));
    const finalHeaders = [...baseHeaders, ...customHeaders];

    return { headers: finalHeaders, data: rows, filename: `CDRs_${allLeadData?.count || 0}.csv` };
  };

  // Fetching Lead Management Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(leadGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Lead Management Err =-=>", err);
    }
  }, 500);

  // Fetching All Lead Data
  const onGetAllLead = async () => {
    setCsvLoading(true);
    try {
      if (filter?.isAdvance) {
        const payload: Record<string, any> = {
          [data["first_name"]["key"]]: data["first_name"]["val"],
          [data["last_name"]["key"]]: data["last_name"]["val"],
          [data["phone_number"]["key"]]: data["phone_number"]["val"],
          [data["phone_code"]["key"]]: data["phone_code"]["val"],
          [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
          // [data["product1"]["key"]]: data["product1"]["val"],
          [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
          [data["lead_status"]["key"]]: data["lead_status"]["val"],
          [data["lead_status_1"]["key"]]: data["lead_status_1"]["val"],
          [data["lead_status_2"]["key"]]: data["lead_status_2"]["val"],
          page: filter?.page,
          limit: lead?.count || 0,
        };

        // Add date range filter if provided
        if (data["start_date"]["val"] && data["end_date"]["val"]) {
          payload["date_filter_type"] = data.date_filter_type.val;
          payload["start_date"] = data.start_date.val
            ? format(new Date(data.start_date.val), "yyyy-MM-dd HH:mm:ss")
            : "";
          payload["end_date"] = data.end_date.val
            ? format(new Date(data.end_date.val), "yyyy-MM-dd HH:mm:ss")
            : "";
        }

        Object.entries(payload)?.forEach(([key, val]: any) => {
          if (!val) {
            delete payload[key];
          }
        });
        let res: any = await dispatch(leadAllSearch(payload)).unwrap();
        if (res && res?.statusCode === 200) {
          setIsCsvDownload(true);
          setCsvLoading(false);
        }
        setCsvLoading(false);
      } else {
        const params = { ...filter };
        params["limit"] = lead?.count || 0;
        delete params["isAdvance"];
        let res: any = await dispatch(leadAllGet(params)).unwrap();
        if (res && res?.statusCode === 200) {
          setIsCsvDownload(true);
          setCsvLoading(false);
        }
        setCsvLoading(false);
      }
    } catch (err) {
      setCsvLoading(false);
      console.error("Get All lead Err =-=>", err);
    }
  };

  // Advance Search - Trigger when left side Input or Select value change
  const handleChnage = (key: string, val: string) => {
    setData({
      ...data,
      [key]: { ...data[key], val: val },
    });
    console.log("data", key, val);
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
    if (
      !(
        data["first_name"]["val"] ||
        data["last_name"]["val"] ||
        data["phone_number"]["val"] ||
        data["phone_code"]["val"] ||
        data["user_uuid"]["val"] ||
        // data["product1"]["val"] ||
        data["lead_group_uuid"]["val"] ||
        data["lead_status"]["val"] ||
        data["lead_status_1"]["val"] ||
        data["lead_status_2"]["val"] ||
        data["start_date"]["val"] ||
        data["end_date"]["val"]
      )
    ) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        [data["first_name"]["key"]]: data["first_name"]["val"],
        [data["last_name"]["key"]]: data["last_name"]["val"],
        [data["phone_number"]["key"]]: data["phone_number"]["val"],
        [data["phone_code"]["key"]]: data["phone_code"]["val"],
        [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
        // [data["product1"]["key"]]: data["product1"]["val"],
        [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
        [data["lead_status"]["key"]]: data["lead_status"]["val"],
        [data["lead_status_1"]["key"]]: data["lead_status_1"]["val"],
        [data["lead_status_2"]["key"]]: data["lead_status_2"]["val"],
        page: filter?.page,
        limit: filter?.limit,
      };

      // Add date range filter if provided
      if (data["start_date"]["val"] && data["end_date"]["val"]) {
        payload["date_filter_type"] = data.date_filter_type.val;
        payload["start_date"] = data.start_date.val
          ? format(new Date(data.start_date.val), "yyyy-MM-dd HH:mm:ss")
          : "";
        payload["end_date"] = data.end_date.val
          ? format(new Date(data.end_date.val), "yyyy-MM-dd HH:mm:ss")
          : "";
      }

      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(leadSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Lead Management Data
  const onEmptySearch = () => {
    setIsOpen(false);
    setIsBatchUpdate(false);
    setBatchDetails(initialBatchValues);
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create Lead Management Page
  const onCreateLead = () => router.push("/tenant-leads/create");

  // Store Single Lead Management Data in Redux & Navigate to Update Lead Management Page
  const onEditClick = (data: any) => {
    try {
      router.push("/tenant-leads/" + data?.uuid);
    } catch (err) {
      console.error("Store Single Lead Management Err =-=>", err);
    }
  };

  // Deleting Selected Lead Management & Fetching Lead Management Data
  const onDeleteLead = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(leadDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === lead?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      setDeleteId("");
      Danger("");
      console.error("Delete Lead Management Err --->", e?.message);
    }
  };

  // // Mass Delete Click - Open Delete Modal
  // const onMassDeleteLead = () => {
  //   const selectedRows = [...selectedRow];
  //   setDeleteId(selectedRows.join(","));
  // };

  // Mass Delete — honoring the scope chosen in the Batch Delete panel
  const onBulkDeleteLeads = async () => {
    // Guard: "All Filtered Records" requires advance filter to be active
    if (batchDeleteScope === "all_filtered" && !filter.isAdvance) {
      Danger("Please apply a filter before deleting all records.");
      return;
    }

    if (batchDeleteScope === "all_filtered" && filter.isAdvance) {
      // Fetch ALL matching UUIDs using the current advanced-search filters
      const payload: Record<string, any> = {
        [data["first_name"]["key"]]: data["first_name"]["val"],
        [data["last_name"]["key"]]: data["last_name"]["val"],
        [data["phone_number"]["key"]]: data["phone_number"]["val"],
        [data["phone_code"]["key"]]: data["phone_code"]["val"],
        [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
        [data["lead_group_uuid"]["key"]]: data["lead_group_uuid"]["val"],
        [data["lead_status"]["key"]]: data["lead_status"]["val"],
        [data["lead_status_1"]["key"]]: data["lead_status_1"]["val"],
        [data["lead_status_2"]["key"]]: data["lead_status_2"]["val"],
        page: 1,
        limit: lead?.count || 0,
      };
      if (data["start_date"]["val"] && data["end_date"]["val"]) {
        payload["date_filter_type"] = data.date_filter_type.val;
        payload["start_date"] = data.start_date.val
          ? format(new Date(data.start_date.val), "yyyy-MM-dd HH:mm:ss")
          : "";
        payload["end_date"] = data.end_date.val
          ? format(new Date(data.end_date.val), "yyyy-MM-dd HH:mm:ss")
          : "";
      }
      Object.entries(payload).forEach(([key, val]: any) => {
        if (!val) delete payload[key];
      });
      try {
        setLoading(true);
        const res: any = await dispatch(leadAllSearch(payload)).unwrap();
        const allIds: string[] = (res?.data || [])
          .map((item: any) => item?.lead_management_uuid)
          .filter(Boolean);
        if (allIds.length === 0) {
          setLoading(false);
          Danger("No matching records found to delete.");
          return;
        }
        setLoading(false);
        setIsBatchDelete(false);
        setDeleteId(allIds.join(","));
      } catch (e: any) {
        setLoading(false);
        console.error("Fetch all leads for batch delete Err --->", e?.message);
        Danger("");
      }
    } else {
      // Current-page scope — use only the UUIDs that the user has selected
      const selectedRows = [...selectedRow];
      if (selectedRows.length === 0) {
        Danger("No records selected. Please select records to delete.");
        return;
      }
      setIsBatchDelete(false);
      setDeleteId(selectedRows.join(","));
    }
  };

  const isDisabled = () => {
    const data = user?.tenant_detail?.roles?.length
      ? user?.tenant_detail?.roles[0]
      : {};
    let allData: any = {};
    if (data?.module_permission?.lead_management)
      allData = { ...allData, ...data?.module_permission?.lead_management };

    if (
      allData?.["leads"] &&
      allData?.["leads"] <= (lead?.count || 0) &&
      allData?.["leads"] != 0
    ) {
      return true;
    }
    return false;
  };

  const handleBatchChange = (key: string, val: string) => {
    setBatchDetails({ ...batchDetails, [key]: val });
  };

  const onUpdateBatch = async () => {
    try {
      let payload: any = { ...batchDetails };
      console.log("datadata", data)
      data["first_name"]["val"] &&
        (payload["first_name"] = data["first_name"]["val"]);
      data["last_name"]["val"] &&
        (payload["last_name"] = data["last_name"]["val"]);
      data["phone_number"]["val"] &&
        (payload["phone_number"] = data["phone_number"]["val"]);
      data["phone_code"]["val"] &&
        (payload["phone_code"] = data["phone_code"]["val"]);
      data["user_uuid"]["val"] &&
        (payload["user_uuid_filter"] = data["user_uuid"]["val"]);
      // data["product1"]["val"] &&
      //   (payload["product1_filter"] = data["product1"]["val"]);
      data["lead_status"]["val"] &&
        (payload["lead_status_filter"] = data["lead_status"]["val"]);
      data["lead_group_uuid"]["val"] &&
        (payload["lead_group_uuid_filter"] = data["lead_group_uuid"]["val"]);

      data["first_name"]["val"] &&
        (payload["first_name_flag"] = data["first_name"]["key"]);
      data["last_name"]["val"] &&
        (payload["last_name_flag"] = data["last_name"]["key"]);
      data["phone_number"]["val"] &&
        (payload["phone_number_flag"] = data["phone_number"]["key"]);
      data["phone_code"]["val"] &&
        (payload["phone_code_flag"] = data["phone_code"]["key"]);

      let res: any = await dispatch(leadBatchUpdate(payload)).unwrap();
      if (res && res.statusCode === 200) {
        Success(res.data);
        setFilter({ ...filter });
      }
    } catch (error: any) {
      console.error("Lead Management batch update Err --->", error?.message);
    }
  };

  // ✅ Extract structured data from the API response for the view modal
  // viewData shape: { statusCode: 200, data: [ { lead_information: [...] }, { cdrs_and_notes: [...] } ] }
  const __apiArr = Array.isArray(viewData?.data) ? viewData.data : [];
  const __finalLeadInfo = __apiArr.find((x: any) => x?.lead_information)?.lead_information?.[0] || viewData || null;
  const __finalTimeline = __apiArr.find((x: any) => x?.cdrs_and_notes)?.cdrs_and_notes || viewData?.cdrs_details || [];
  const __finalNotes = (__finalTimeline || []).flatMap((x: any) => x?.notes_info || []);

  return (
    <>
      <div className="bg-white p-5 rounded-[25px]">
        <div className="relative z-[1] justify-between mb-3">
          <div className="flex gap-3 items-center bg-header-background ">
            {/* border rounded-md p-3 shadow-sm */}
            <Button
              className="flex items-center gap-1 rounded-[2px] text-white py-2 px-4 text-sm font-medium"
              style="primary"
              text="Create Lead"
              icon="PlusWhite"
              onClick={() => {
                isDisabled()
                  ? Danger(`Maximun limit is ${lead?.count || 0}`)
                  : onCreateLead();
              }}
            />
            <Button
              disabled={!filter.isAdvance}
              className={`${filter.isAdvance === false && "opacity-40"
                } flex items-center gap-1 rounded-[2px] bg-[#AAAAAA] text-white py-2 px-4 text-sm font-medium`}
              style="none"
              text="Batch Update"
              icon="Refresh2White"
              onClick={() => {
                setIsBatchUpdate(!isBatchUpdate);
              }}
            />
            {/* <Button
              className="flex items-center gap-1 rounded-[2px] text-white py-2 px-4 text-sm font-medium"
              style="error"
              text="Delete"
              icon="DeleteWhite"
              onClick={() => {
                onMassDeleteLead();
              }}
            /> */}
            <Button
              className="flex items-center gap-1 rounded-[2px] text-white py-2 px-4 text-sm font-medium"
              style="error"
              text="Batch Delete"
              icon="DeleteWhite"
              onClick={() => {
                setIsBatchDelete(!isBatchDelete);
                setIsBatchUpdate(false);
              }}
            />
            <div className="ml-auto flex gap-3 items-center">
              <SearchBar
                className="h-9 w-64 bg-white"
                placeholder="Search by Keyword"
                value={filter?.search}
                onChange={(e: any) =>
                  setFilter({
                    ...filter,
                    search: e.target.value,
                    isAdvance: false,
                    page: 1,
                    limit: 10,
                  })
                }
              />
              <Filter
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
              {csvLoading ? (
                <div
                  className={`mr-2 h-4 w-4 border-t-transparent border-spacing-1 animate-spin rounded-full border-heading border-2`}
                ></div>
              ) : (
                <>
                  <Button
                    className="p-2 border border-gray-200 rounded-[2px] hover:bg-gray-50 bg-white transition-colors"
                    style="none"
                    tooltip="Export"
                    icon="Export"
                    iconWidth={20}
                    iconHeight={20}
                    onClick={() => onGetAllLead()}
                  />
                  {isCsvDownload && (
                    <CSVLink
                      {...prepareCsvProps()}
                      ref={excelRef}
                      className="hiddenExcel"
                      target="_blank"
                    ></CSVLink>
                  )}
                </>
              )}
              <Button
                className="p-2 border border-gray-200 rounded-[2px] hover:bg-gray-50 bg-white transition-colors"
                style="none"
                tooltip="Import-Mapper"
                icon="Inbox"
                iconWidth={20}
                iconHeight={20}
                onClick={() => router.push("/tenant-leads/import-mapper")}
              />
              <Button
                className="p-2 border border-gray-200 rounded-[2px] hover:bg-gray-50 bg-white transition-colors"
                style="none"
                tooltip="Import"
                icon="Import"
                iconWidth={20}
                iconHeight={20}
                onClick={() => router.push("/tenant-leads/import")}
              />
              <Button
                className="p-2 border border-gray-200 rounded-[2px] bg-white hover:bg-gray-50 transition-colors"
                style="none"
                tooltip="Lead-Distribution"
                icon="Data2"
                iconWidth={20}
                iconHeight={20}
                onClick={() => router.push("/tenant-leads/lead-distribution")}
              />
            </div>
          </div>
        </div>
        <div
          className={`relative z-[1] flex flex-col mt-4 bg-white rounded-md drop-shadow-lg ${isOpen ? "" : "hidden"
            }`}
        >
          <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
            <span className="text-sm font-bold">Search</span>
            <Icon
              className="cursor-pointer"
              tooltip="Close"
              name="Close"
              width={20}
              height={20}
              alt="Close"
              onClick={onEmptySearch}
            />
          </div>
          <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
            <InputSelect
              name="first_name"
              label="First Name"
              placeholder="Enter First Name"
              value={data.first_name.val}
              dropdownValue={data.first_name.dropdown}
              options={advanceSearchOptions}
              onChange={(e: any) => handleChnage("first_name", e.target.value)}
              onDropdownChange={(e: any) =>
                handleSelect("first_name", e.target.value)
              }
              isInfo
            />
            <InputSelect
              name="last_name"
              label="Last Name"
              placeholder="Enter Last Name"
              value={data.last_name.val}
              dropdownValue={data.last_name.dropdown}
              options={advanceSearchOptions}
              onChange={(e: any) => handleChnage("last_name", e.target.value)}
              onDropdownChange={(e: any) =>
                handleSelect("last_name", e.target.value)
              }
              isInfo
            />
            <InputSelect
              name="phone_number"
              label="Phone Number"
              placeholder="Enter Phone Number"
              value={data.phone_number.val}
              dropdownValue={data.phone_number.dropdown}
              options={advanceSearchOptions}
              onChange={(e: any) => handleChnage("phone_number", e.target.value)}
              onDropdownChange={(e: any) =>
                handleSelect("phone_number", e.target.value)
              }
              isInfo
            />
            <InputSelect
              name="phone_code"
              label="Phone Code"
              placeholder="Enter Phone Code"
              value={data.phone_code.val}
              dropdownValue={data.phone_code.dropdown}
              options={advanceSearchOptions}
              onChange={(e: any) => handleChnage("phone_code", e.target.value)}
              onDropdownChange={(e: any) =>
                handleSelect("phone_code", e.target.value)
              }
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
            <Select
              name="lead_group_uuid"
              label="Lead Group"
              placeholder="Select Lead Group"
              removable
              value={data.lead_group_uuid.val}
              options={leadGroupOptions}
              onChange={(e: any) =>
                handleChnage("lead_group_uuid", e.target.value)
              }
              isInfo
            />
            {/* <Select
            name="lead_status"
            label="Lead Status"
            placeholder="Select Lead Status"
            removable
            value={data.lead_status.val}
            options={leadStatusOptions}
            onChange={(e: any) => handleChnage("lead_status", e.target.value)}
            isInfo
          /> */}

            {renderDispositionDropdowns()}

            {/* Date Range Filter */}
            <div className="col-span-3 border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold mb-3">Date Range Filter</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                  <label className="text-sm font-medium mb-2 block">Filter By</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="date_filter_type"
                        value="createdAt"
                        checked={data.date_filter_type.val === "createdAt"}
                        onChange={(e) => handleChnage("date_filter_type", e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Created At</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="date_filter_type"
                        value="updatedAt"
                        checked={data.date_filter_type.val === "updatedAt"}
                        onChange={(e) => handleChnage("date_filter_type", e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Updated At</span>
                    </label>
                  </div>
                </div>
                <DatePicker
                  name="start_date"
                  label="Start Date"
                  value={data.start_date.val}
                  onChange={(val: any) => handleChnage("start_date", val)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                />
                <DatePicker
                  name="end_date"
                  label="End Date"
                  value={data.end_date.val}
                  onChange={(val: any) => handleChnage("end_date", val)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                  minDate={data.start_date.val || undefined}
                />
              </div>
            </div>

            {/* {childDispositions.length > 0 && (
            <Select
              name="sub_lead_status"
              label="Level 1 Lead Status"
              placeholder="Select Sub Lead Status"
              removable
              value={data.sub_lead_status.val}
              options={childDispositions?.map((d: any) => ({
                label: d.name,
                value: d.disposition_uuid,
              }))}
              onChange={(e: any) =>
                handleChnage("sub_lead_status", e.target.value)
              }
              isInfo
            />
          )}

          {level2Dispositions.length > 0 && (
            <Select
              name="sub_sub_lead_status"
              label="Level 2 Lead Status"
              placeholder="Select Level 2 Lead Status"
              removable
              value={data.sub_sub_lead_status?.val}
              options={level2Dispositions.map((d: any) => ({
                label: d.name,
                value: d.disposition_uuid,
              }))}
              onChange={(e: any) =>
                handleChnage("sub_sub_lead_status", e.target.value)
              }
              isInfo
            />
          )} */}

          </div>
          <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
            <div className="flex gap-3 px-10">
              <Button
                className="px-3 py-2"
                text="Cancel"
                style="dark-outline"
                onClick={onEmptySearch}
              />
              <Button
                className="px-3 py-2"
                text="Search"
                style="primary"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 1,
                    limit: 10,
                    isAdvance: true,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div
          className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${isBatchUpdate ? "" : "hidden"
            }`}
        >
          <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
            <span className="text-sm font-bold">Batch Update</span>
            <Icon
              className="cursor-pointer"
              tooltip="Close"
              name="Close"
              width={20}
              height={20}
              alt="Close"
              onClick={() => setIsBatchUpdate(false)}
            />
          </div>
          <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
            <Select
              name="user_uuid"
              label="User"
              placeholder="Select User"
              removable
              value={batchDetails.user_uuid}
              options={userOptions}
              onChange={(e: any) =>
                handleBatchChange("user_uuid", e.target.value)
              }
              isInfo
            />
            <Select
              name="lead_group_uuid"
              label="Lead Group"
              placeholder="Select Lead Group"
              removable
              value={batchDetails.lead_group_uuid}
              options={leadGroupOptions}
              onChange={(e: any) =>
                handleBatchChange("lead_group_uuid", e.target.value)
              }
              isInfo
            />

            {/* <Select
            name="lead_status"
            label="Lead Status"
            placeholder="Select Lead Status"
            removable
            value={batchDetails.lead_status}
            options={leadStatusOptions}
            onChange={(e: any) =>
              handleBatchChange("lead_status", e.target.value)
            }
            isInfo
          /> */}
            <Input
              type="text"
              name="lead_status"
              label="Lead Status"
              icon="LeadManagement"
              placeholder="Select Lead Status"
              value={dispoName}
              // touched={touched}
              // errors={errors}
              onChange={(e: any) => {
                handleBatchChange("lead_status", e.target.value);
              }}
              onClick={() => setShowDispoModal(true)}
              // onBlur={handleBlur}
              isInfo
            />
            {showDispoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div
                  ref={modalRef}
                  className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto"
                >
                  <h2 className="text-lg font-semibold mb-4">Select Lead Status</h2>
                  <DispositionTree
                    items={dispositionOptions}
                    onSelect={(item: any) => {
                      setDispoName(item?.label || item?.name)
                      handleBatchChange("lead_status", item.value || item.disposition_uuid);
                      setShowDispoModal(false);
                    }}
                  />

                  {/* <div className="mt-4 text-right">
                                <button
                                  type="button"
                                  className="text-sm text-red-500"
                                  onClick={() => setShowDispoModal(false)}
                                >
                                  Cancel
                                </button>
                              </div> */}
                </div>
              </div>
            )}
          </div>
          <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
            <div className="flex gap-3 px-10">
              <Button
                className="px-3 py-2"
                text="Cancel"
                style="dark-outline"
                onClick={() => {
                  setIsBatchUpdate(false);
                  setBatchDetails(initialBatchValues);
                }}
              />
              <Button
                className={`${batchDetails?.user_uuid === "" &&
                  batchDetails?.lead_status === "" &&
                  batchDetails?.lead_group_uuid === "" &&
                  "opacity-60"
                  } px-3 py-2`}
                text="Batch Update"
                style="primary"
                disabled={
                  batchDetails?.user_uuid === "" &&
                  batchDetails?.lead_status === "" &&
                  batchDetails?.lead_group_uuid === ""
                }
                onClick={() => {
                  onUpdateBatch();
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Batch Delete Panel ─────────────────────────────────────────── */}
        <div
          className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${isBatchDelete ? "" : "hidden"
            }`}
        >
          <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
            <span className="text-sm font-bold">Batch Delete</span>
            <Icon
              className="cursor-pointer"
              tooltip="Close"
              name="Close"
              width={20}
              height={20}
              alt="Close"
              onClick={() => setIsBatchDelete(false)}
            />
          </div>
          <div className="px-10 pt-6 pb-8">
            <p className="text-sm font-medium text-gray-700 mb-4">Select which records to delete:</p>
            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="batchDeleteScope"
                  value="all_filtered"
                  checked={batchDeleteScope === "all_filtered"}
                  onChange={() => setBatchDeleteScope("all_filtered")}
                  className="mt-0.5 w-4 h-4 accent-red-600"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    All records matching the applied filters
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Deletes every record returned by the current search/filter across all pages.
                    {!filter.isAdvance && (
                      <span className="ml-1 text-amber-600 font-medium">
                        (Requires advanced filters to be active)
                      </span>
                    )}
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="batchDeleteScope"
                  value="current_page"
                  checked={batchDeleteScope === "current_page"}
                  onChange={() => setBatchDeleteScope("current_page")}
                  className="mt-0.5 w-4 h-4 accent-red-600"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    Records on the current page only
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Deletes only the {lead?.data?.length || 0} records visible on page {filter.page}.
                  </p>
                </div>
              </label>
            </div>
          </div>
          <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
            <div className="flex gap-3 px-10">
              <Button
                className="px-3 py-2"
                text="Cancel"
                style="dark-outline"
                onClick={() => setIsBatchDelete(false)}
              />
              <Button
                className="px-3 py-2"
                text="Delete"
                style="error"
                // disabled={batchDeleteScope === "all_filtered" && !filter.isAdvance}
                onClick={() => onBulkDeleteLeads()}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div
            className={`${infoData
              ? "grid grid-cols-3 gap-4 tsm:grid-cols-1 tsm:gap-y-4 tsm:gap-x-0"
              : ""
              }`}
          >
            <div className="col-span-2">
              <Table
                isLoading={loading}
                title="Lead"
                name="leads"
                navigate="/tenant-leads/create"
                columns={columns}
                data={lead?.data?.length ? lead.data : []}
                page={filter.page}
                totalCount={lead?.count || 0}
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
                onRefresh={() => setFilter({ ...filter })}
              />
            </div>
            <div className="col-span-1">
              {noteData ? (
                <Note
                  noteData={noteData}
                  setNoteData={setNoteData}
                  leadUuid={leadUuid}
                />
              ) : infoData ? (
                <LeadInformation
                  isLeadInfoID={infoData}
                  setIsLeadInfoID={setInfoData}
                  setNoteData={setNoteData}
                />
              ) : null}
            </div>
          </div>
        </div>
        <DeleteModal
          loading={loading}
          visible={!!deleteId}
          onCancelClick={() => setDeleteId("")}
          onDoneClick={() => onDeleteLead(deleteId)}
        />
      </div>

      {/* ✅ View Lead Modal */}
      {openViewModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3"
          onClick={() => setOpenViewModal(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
                  <Icon name="Eye" width={20} height={20} tooltip="Lead Activity" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Lead Details</h2>
                  <p className="text-xs text-gray-500">
                    {[__finalLeadInfo?.first_name, __finalLeadInfo?.last_name].filter(Boolean).join(" ") || __finalLeadInfo?.phone_number || ""}
                  </p>
                </div>
              </div>
              <Icon
                className="cursor-pointer hover:rotate-90 transition-transform duration-200"
                name="Close"
                width={28}
                height={28}
                alt="Close"
                onClick={() => setOpenViewModal(false)}
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white px-6 flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
              {["Timeline", "Lead Information"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">

              {/* ✅ Loading spinner while fetching */}
              {viewModalLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 border-t-transparent border-4 animate-spin rounded-full border-blue-500" />
                </div>
              ) : viewData ? (
                <div className="flex flex-col gap-6">

                  {/* TIMELINE TAB */}
                  {activeTab === "Timeline" && (() => {
                    const allEvents = __finalTimeline;
                    const PREVIEW = 3;
                    const visible = showAllCdrs ? allEvents : allEvents.slice(0, PREVIEW);

                    return (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-[15px] font-bold text-gray-900">Activity Timeline</span>
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                            {allEvents.length} events
                          </span>
                        </div>

                        {allEvents.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-6">No activity recorded yet.</p>
                        ) : (
                          <div className="flex flex-col gap-5 relative">
                            {visible.map((event: any, idx: number) => {
                              const cdr = event?.cdrs_info || event;
                              const notes = event?.notes_info ?? [];
                              const isLatest = idx === 0;
                              const callAt = addIST(toDateSafe(cdr?.callstart || cdr?.createdAt || null));
                              const timeStr = callAt ? format(callAt, "h:mm a") : "-";
                              const diffMs = callAt ? Date.now() - callAt.getTime() : 0;
                              const diffH = Math.floor(diffMs / 3600000);
                              const diffD = Math.floor(diffMs / 86400000);
                              const agoStr = diffD >= 1 ? `${diffD}d ago` : `${diffH}h ago`;
                              const dateLabelStr = callAt ? format(callAt, "EEE, MMM d") : "";
                              const callDateStr = callAt ? format(callAt, "yyyy-MM-dd HH:mm:ss") : "-";

                              return (
                                <div key={idx} className="flex items-start gap-0">
                                  <div className="w-[84px] shrink-0 text-right pr-4 pt-2 leading-none">
                                    <p className="text-[13px] font-semibold text-gray-800">{timeStr}</p>
                                    <p className="text-[11px] font-semibold text-blue-500 mt-1">{agoStr}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{dateLabelStr}</p>
                                  </div>
                                  <div className="relative flex flex-col items-center w-0 shrink-0">
                                    <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-blue-500 rounded-full" />
                                  </div>
                                  <div className="flex-1 ml-4 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden mb-2">
                                    <div className="p-4">
                                      <div className="flex items-start gap-3">
                                        <div
                                          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow"
                                          style={{ background: "linear-gradient(135deg, #60a5fa 0%, #1e40af 100%)" }}
                                        >
                                          <Icon name="CallingWhite" width={40} height={40} alt="call" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-[15px] font-bold text-gray-900 leading-tight">
                                              Call #{cdr?.custom_callid || idx + 1}
                                            </span>
                                            {isLatest && (
                                              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold text-white" style={{ background: "#22c55e" }}>
                                                Latest
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <Icon name="UserOutline" width={12} height={12} alt="call" />
                                            <span className="text-[11px] font-semibold text-blue-600">
                                              <span className="text-[11px] font-semibold text-blue-600">{notes[0]?.user[0]?.fullname || "Agent"}</span>
                                            </span>
                                            <span>|</span>
                                            <span className="text-[11px] capitalize">{"Mobile"}</span>
                                            <span>•</span>
                                            <span className="text-[11px] font-semibold text-blue-600">{__finalLeadInfo?.phone_number || "-"}</span>
                                            <span>|</span>
                                            <span className="text-[11px] capitalize">{"Disposition"}</span>
                                            <span>•</span>
                                            <span className="text-[11px] font-semibold text-blue-600">{cdr?.disposition || "-"}</span>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 text-gray-600 text-[10px] font-medium bg-white">
                                              <span className="text-[10px] text-gray-500 font-semibold">Campaign Name</span>
                                              <span className="text-[10px] text-gray-400"> • </span>
                                              <span className="text-[10px] text-gray-400 font-medium">{__finalLeadInfo?.campaign_details[0]?.name || "-"}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 text-gray-600 text-[10px] font-medium bg-white">
                                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                              </svg>
                                              {callDateStr}
                                            </span>
                                          </div>
                                          {notes.length > 0 && (
                                            <div className="mt-2 pl-3 border-l-2 border-gray-200 bg-gray-50 py-2 rounded-r-lg">
                                              {notes.map((note: any, nIdx: number) => (
                                                <div key={nIdx} className="mb-1 last:mb-0">
                                                  <p className="text-[11px] text-gray-500 leading-relaxed capitalize">{"Notes:"}</p>
                                                  <span className="text-[10px] text-gray-500 font-semibold">Comment</span>
                                                  <span className="text-[10px] text-gray-400"> • </span>
                                                  <span className="text-[10px] text-gray-400 font-medium">"{note.comment}"</span>
                                                  <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-[10px] text-gray-500 font-semibold">Agent</span>
                                                    <span className="text-[10px] text-gray-400"> • </span>
                                                    <span className="text-[10px] text-gray-400"> {note.user?.[0]?.fullname || note.user?.[0]?.username || "Agent"} </span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">|</span>
                                                    <span className="text-[10px] text-gray-500 font-semibold">Updated At:</span>
                                                    <span className="text-[10px] text-gray-400"> • </span>
                                                    <span className="text-[10px] text-gray-400"> {callDateStr} </span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">|</span>
                                                    <span className="text-[10px] text-gray-500 font-semibold">Direction:</span>
                                                    <span className="text-[10px] text-gray-400"> • </span>
                                                    <span className="text-[10px] text-gray-400 capitalize"> {cdr?.direction || "outbound"}... </span>
                                                  </div>
                                                  {/* <p className="text-[11px] text-gray-400 mt-1 leading-relaxed capitalize">
                                                    Call at: {callDateStr}{" | "}Direction: {cdr?.direction || "outbound"}...
                                                  </p> */}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {allEvents.length > PREVIEW && (
                          <div className="mt-5 self-start">
                            <button
                              onClick={() => setShowAllCdrs(!showAllCdrs)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-full px-5 py-1.5 bg-white transition-colors"
                            >
                              {showAllCdrs ? "View less" : "View more"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* LEAD INFORMATION TAB */}
                  {activeTab === "Lead Information" && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "First Name", value: __finalLeadInfo?.first_name || "-" },
                        { label: "Last Name", value: __finalLeadInfo?.last_name || "-" },
                        { label: "Phone Number", value: __finalLeadInfo?.custom_phone_number || __finalLeadInfo?.phone_number || "-" },
                        { label: "Email", value: __finalLeadInfo?.email || "-" },
                        { label: "Lead Group", value: __finalLeadInfo?.lead_group?.[0]?.name || __finalLeadInfo?.lead_group_name || "-" },
                        { label: "Campaign", value: __finalLeadInfo?.campaign_details?.[0]?.name || __finalLeadInfo?.campaign_name || "-" },
                        { label: "Lead Status 0", value: __finalLeadInfo?.disposition?.[0]?.name || __finalLeadInfo?.leadStatus || "-" },
                        { label: "Lead Status 1", value: __finalLeadInfo?.disposition_1?.[0]?.name || __finalLeadInfo?.leadStatus1 || "-" },
                        { label: "Lead Status 2", value: __finalLeadInfo?.disposition_2?.[0]?.name || __finalLeadInfo?.leadStatus2 || "-" },
                        { label: "Call Count", value: __finalLeadInfo?.call_count ?? "-" },
                        { label: "Address", value: __finalLeadInfo?.address || "-" },
                        { label: "City", value: __finalLeadInfo?.city || "-" },
                        { label: "State", value: __finalLeadInfo?.state || "-" },
                        { label: "Postal Code", value: __finalLeadInfo?.postal_code || "-" },
                        { label: "Assigned To", value: __finalLeadInfo?.user?.[0]?.fullname || __finalLeadInfo?.user?.[0]?.username || "-" },
                        { label: "Tenant", value: __finalLeadInfo?.tenant?.[0]?.tenant_name || "-" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="text-sm font-semibold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* NOTES TAB */}
                  {/* {activeTab === "Notes" && (
                    __finalNotes.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-sm">No notes available.</div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {__finalNotes.map((note: any, idx: number) => (
                          <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900">
                                {note?.user?.[0]?.fullname || note?.user?.[0]?.username || "Agent"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {note?.createdAt ? format(addIST(new Date(note.createdAt))!, "MMM d, yyyy h:mm a") : "-"}
                              </p>
                            </div>
                            <p className="mt-2 text-sm text-gray-700">{note?.comment || "-"}</p>
                            <p className="mt-2 text-[11px] text-gray-500">Call ID: {note?.cdrs_uuid || "-"}</p>
                          </div>
                        ))}
                      </div>
                    )
                  )} */}

                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-500">No data found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end bg-white">
              <button
                onClick={() => setOpenViewModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadManagement;
