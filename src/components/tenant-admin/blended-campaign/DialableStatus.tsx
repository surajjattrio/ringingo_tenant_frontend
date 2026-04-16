import React, { useLayoutEffect, useState } from "react";
import { useParams } from "next/navigation";

// PROJECT IMPORT
import {
  blendedSingleFeatureGet,
  blendedDialableTableGet,
  blendedDialableAdd,
  blendedDialableDelete,
} from "@/redux/slice/tenant-admin/blendedSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Select } from "@/components/forms";
import { Table } from "@/components/ui-components";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { Danger, Success } from "@/redux/services/toasterServices";
import { DeleteModal } from "@/components/modals";

const DialableStatus = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [statusOptions, setStatusOptions] = useState<any>([]);
  const [status, setStatus] = useState<string>("");
  const [deleteId, setDeleteId] = useState<any>("");
  const [tableData, setTableData] = useState<any>({});
  const [usedStatus, setUsedStatus] = useState<any>([]);
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
  });

  const columns: ColumnsType[] = [
    {
      name: "name",
      title: "Name",
      action: (row: any) => <span>{row?.disposition?.[0]?.name}</span>,
    },
    {
      name: "code",
      title: "Code",
      action: (row: any) => <span>{row?.disposition?.[0]?.code}</span>,
    },
    {
      name: "actions",
      title: "Actions",
      showEdit: false,
    },
  ];

  useLayoutEffect(() => {
    if (!id) return;
    onGetDialableTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useLayoutEffect(() => {
    if (!id) return;
    onGetDialable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, usedStatus]);

  // Fetching Single Dialable Status Data
  const onGetDialable = async () => {
    try {
      const params = {
        feature: "dialable",
        id,
      };
      const res: any = await dispatch(
        blendedSingleFeatureGet(params)
      ).unwrap();

      const newData = res?.length
        ? res?.map((val: any) => ({
          ...val,
          value: val?.disposition_uuid,
          label: val?.name,
        }))
        : [];
      if (usedStatus?.length) {
        let newStatus: any = [];
        newData.map((val: any) => {
          if (!usedStatus.includes(val.value)) {
            newStatus.push(val);
          }
        });
        setStatusOptions(newStatus || []);
        setStatus(newStatus[0]?.value || "");
      } else {
        setStatusOptions(newData || []);
        setStatus(newData[0]?.value || "");
      }
      // if(res?.statusCode === 200){
      // }
    } catch (err) {
      console.error("Get Single Dialable Status Data Err =-=>", err);
    }
  };

  // Fetching Single Dialable Status Table Data
  const onGetDialableTable = async () => {
    setLoading(true);
    try {
      const params = {
        campaign_uuid: id,
        ...filter,
      };
      const res: any = await dispatch(
        blendedDialableTableGet(params)
      ).unwrap();
      if (res?.data) {
        let ids: any = [];
        res?.data?.length &&
          res?.data?.map((x: any) => ids.push(x?.disposition_uuid));
        setUsedStatus(ids);
        setTableData(res || {});
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Single Dialable Status Table Data Err =-=>", err);
    }
  };

  // Add Disposition
  const onAdd = async () => {
    if (!status) {
      Danger("Please select a dialing status");
      return;
    }
    try {
      const payload = {
        disposition_uuid: status,
        blended_campaign_uuid: id,
      };
      await dispatch(blendedDialableAdd(payload)).unwrap();
      setStatus("");
      onGetDialableTable();
    } catch (err) {
      console.error("Add Dialable Status Err =-=>", err);
    }
  };

  // Delet Table Row
  const onDelete = async (val: any) => {
    try {
      await dispatch(blendedDialableDelete(val)).unwrap();
      setDeleteId("");
      setFilter({
        ...filter,
        page:
          tableData?.data?.length === 1 && filter?.page > 1
            ? filter?.page - 1
            : filter?.page,
      });
      Success("Successfully Deleted");
      onGetDialableTable();
    } catch (err) {
      console.error("Delete Dialable Status Err =-=>", err);
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="pb-3 grid grid-cols-2 tsm:grid-cols-1">
          <div className="flex items-end gap-4 mb-4">
            <Select
              className="min-w-[180px]"
              name="status"
              label="Dialing Status"
              placeholder="Select Dialing Status"
              removable
              options={statusOptions}
              value={status}
              onChange={(e: any) => {
                setStatus(e.target.value);
              }}
              isInfo
            />
            <Button
              className="px-3 py-1.5"
              icon="PlusWhite"
              text="Add"
              style="primary"
              onClick={() => onAdd()}
            />
          </div>
        </div>

        <Table
          headerClassName="!bg-dark-800 !text-heading"
          bodyClassName="!bg-dark-950"
          isLoading={loading}
          columns={columns}
          data={tableData?.data?.length ? tableData.data : []}
          page={filter.page}
          totalCount={tableData?.count || 0}
          limit={filter.limit}
          selectable={false}
          onPageClick={(page: number) => {
            setFilter({
              ...filter,
              page,
            });
          }}
          onDeleteClick={(data: any) => setDeleteId(data.uuid)}
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
        onDoneClick={() => onDelete(deleteId)}
      />
    </>
  );
};

export default DialableStatus;
