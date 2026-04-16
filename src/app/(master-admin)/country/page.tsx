"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
  countryDelete,
  countryGet,
  countrySearch,
  countryStatusUpdate,
  useCountryData,
} from "@/redux/slice/master-admin/countrySlice";
import {
  countryOptionsGet,
  useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { CountryAdvancedFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: CountryAdvancedFilterTypes = {
  country: { key: "country|1", val: "", dropdown: "1" },
  iso: { key: "iso|1", val: "", dropdown: "1" },
  iso3: { key: "iso3|1", val: "", dropdown: "1" },
  nicename: { key: "nicename|1", val: "", dropdown: "1" },
  vat: { key: "vat|1", val: "", dropdown: "1" },
  latitude: { key: "latitude|1", val: "", dropdown: "1" },
  longitude: { key: "longitude|1", val: "", dropdown: "1" },
  capital: { key: "capital|1", val: "", dropdown: "1" },
  countrycode: { key: "countrycode|1", val: "", dropdown: "1" },
};
/* ============================== COUNTRY PAGE ============================== */

const Country = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countryData = useCountryData();
  const countryOptions = useCountryOptions();

  const [loading, setLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<any>("");
  const [selectedRow, setSelectedRow] = useState<string[]>([]);
  const [data, setData] = useState<any>(initialValues);
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });

  const columns: ColumnsType[] = [
    {
      name: "country",
      title: "Country",
      sortable: true,
    },
    { name: "iso", title: "Iso", sortable: true },
    {
      name: "iso3",
      title: "Iso3",
      sortable: true,
    },
    //  { name: "nicename", title: "Nicename", sortable: true },
    {
      name: "vat",
      title: "Vat",
      sortable: true,
    },
    { name: "latitude", title: "Latitude", sortable: true },
    {
      name: "longitude",
      title: "Longitude",
      sortable: true,
    },
    { name: "capital", title: "Capital", sortable: true },
    {
      name: "countrycode",
      title: "Countrycode ",
      sortable: true,
    },
    {
      name: "actions",
      title: "Actions",
      sortable: false,
    },
  ];

  useEffect(() => {
    onGetCountryOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetCountryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Fetching Country Options
  const onGetCountryOptions = () => {
    try {
      dispatch(countryOptionsGet()).unwrap();
    } catch (e: any) {
      console.error("Get Country Options Err --->", e?.message);
    }
  };

  // Fetching Country Data
  const onGetCountryData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(countryGet(params)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Get Country Error --->", e.message);
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

  // Advance Search - Fetching Country Data
  const onSearchData = async () => {
    if (
      !(
        data["country"]["val"] ||
        data["iso"]["val"] ||
        data["iso3"]["val"] ||
        data["nicename"]["val"] ||
        data["vat"]["val"] ||
        data["latitude"]["val"] ||
        data["longitude"]["val"] ||
        data["capital"]["val"] ||
        data["countrycode"]["val"]
      )
    ) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }
    setLoading(true);
    try {
      const payload = {
        [data["country"]["key"]]: data["country"]["val"],
        [data["iso"]["key"]]: data["iso"]["val"],
        [data["iso3"]["key"]]: data["iso3"]["val"],
        [data["nicename"]["key"]]: data["nicename"]["val"],
        [data["vat"]["key"]]: data["vat"]["val"],
        [data["latitude"]["key"]]: data["latitude"]["val"],
        [data["longitude"]["key"]]: data["longitude"]["val"],
        [data["capital"]["key"]]: data["capital"]["val"],
        [data["countrycode"]["key"]]: data["countrycode"]["val"],
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(countrySearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Cancel Click - Advance Search Fields Empty & Fetching Country Data
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // Navigate to Create Country Page
  const onCreateCountry = () => router.push("/country/create");

  // Navigate to Edit Country Page
  const onEditClick = (data: any) => router.push("/country/" + data?.uuid);

  // Update Country Status & Fetching Country Data
  const onUpdateCountryStatus = async (val: any) => {
    try {
      const payload = {
        status: val.status === "1" ? "0" : "1",
        id: val.uuid,
      };
      const res: any = await dispatch(countryStatusUpdate(payload)).unwrap();
      if (res.statusCode === 200) {
        setFilter({ ...filter });
        Success(res.data);
      } else {
        Danger(res?.data);
      }
    } catch (e: any) {
      console.error("Update Country Status Err --->", e?.message);
    }
  };

  // Deleting SelectedCountry & Fetching Country Data
  const onDeleteCountry = async (id: string) => {
    setLoading(true);
    try {
      await dispatch(countryDelete(id)).unwrap();
      const ids = deleteId.split(",");
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          ids?.length === countryData?.data?.length && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      setSelectedRow([]);
      Success("Successfully Deleted");
    } catch (e: any) {
      setLoading(false);
      console.error("Delete Country Status Err --->", e?.message);
    }
  };

  // Mass Delete Click - Open Delete Modal
  const onMassDeleteCountry = () => {
    const selectedRows = [...selectedRow];
    setDeleteId(selectedRows.join(","));
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        createText="Create Country"
        onCreateClick={onCreateCountry}
        onDeleteClick={onMassDeleteCountry}
        onChange={(e: any) =>
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            search: e.target.value,
            isAdvance: false,
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
          name="country"
          label="Country"
          placeholder="Enter Country"
          value={data.country.val}
          dropdownValue={data.country.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("country", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("country", e.target.value)}
          isInfo
        />
        <InputSelect
          name="iso"
          label="Iso"
          placeholder="Enter Iso"
          value={data.iso.val}
          dropdownValue={data.iso.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("iso", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("iso", e.target.value)}
          isInfo
        />
        <InputSelect
          name="iso3"
          label="Iso3"
          placeholder="Enter iso3"
          value={data.iso3.val}
          dropdownValue={data.iso3.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("iso3", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("iso3", e.target.value)}
          isInfo
        />
        <InputSelect
          name="nicename"
          label="Nicename"
          placeholder="Enter Nicename"
          value={data.nicename.val}
          dropdownValue={data.nicename.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("nicename", e.target.value)}
          onDropdownChange={(e: any) =>
            handleSelect("nicename", e.target.value)
          }
          isInfo
        />
        <InputSelect
          name="vat"
          label="Vat"
          placeholder="Enter vat"
          value={data.vat.val}
          dropdownValue={data.vat.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("vat", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("vat", e.target.value)}
          isInfo
        />
        <InputSelect
          name="latitude"
          label="Latitude"
          placeholder="Enter latitude"
          value={data.latitude.val}
          dropdownValue={data.latitude.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("latitude", e.target.value)}
          onDropdownChange={(e: any) =>
            handleSelect("latitude", e.target.value)
          }
          isInfo
        />
        <InputSelect
          name="longitude"
          label="Longitude"
          placeholder="Enter longitude"
          value={data.longitude.val}
          dropdownValue={data.longitude.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("longitude", e.target.value)}
          onDropdownChange={(e: any) =>
            handleSelect("longitude", e.target.value)
          }
          isInfo
        />
        <InputSelect
          name="capital"
          label="Capital"
          placeholder="Enter capital"
          value={data.capital.val}
          dropdownValue={data.capital.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("capital", e.target.value)}
          onDropdownChange={(e: any) => handleSelect("capital", e.target.value)}
          isInfo
        />
        <InputSelect
          name="countrycode"
          label="Countrycode"
          placeholder="Enter countrycode"
          value={data.countrycode.val}
          dropdownValue={data.countrycode.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) => handleChnage("countrycode", e.target.value)}
          onDropdownChange={(e: any) =>
            handleSelect("countrycode", e.target.value)
          }
          isInfo
        />
      </Head>

      <div className="mt-5">
        <Table
          isLoading={loading}
          columns={columns}
          data={countryData?.data?.length ? countryData.data : []}
          page={filter.page}
          totalCount={countryData?.count || 0}
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
              search: "",
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
        onDoneClick={() => onDeleteCountry(deleteId)}
      />
    </div>
  );
};

export default Country;
