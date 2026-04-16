"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
  adminDidGetAll,
  useAdminDidAll,
  useAllAdminDid,
} from "@/redux/slice/master-admin/adminDidSlice";
import {
  didAssign,
  tenantSingleGet,
} from "@/redux/slice/master-admin/tenantSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon, Loader } from "@/components/ui-components";
import { SearchBar } from "@/components/pickers";
import { CheckBox } from "@/components/forms";

// THIRD - PARTY IMPORT
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

/* ============================== ASSIGN DID ============================== */

const AssignDid = () => {
  const { id }: any = useParams();

  const router = useRouter();
  const dispatch = useAppDispatch();
  //const allAdminDidData = useAdminDidAll();
  const allAdminDidData = useAllAdminDid();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tenantData, setTenantData] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const [checkedDids, setCheckedDids] = useState<any>([]);
  const [checkedTenants, setCheckedTenants] = useState<any>([]);
  const [searchDid, setSearchDid] = useState<string>("");
  const [searchTenant, setSearchTenant] = useState<string>("");

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleTenantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // PREPARE DATA
  const prepareData = () => {
    const newData: any = [];
    allAdminDidData?.data?.map((val: any) => {
      if (
        tenantData?.uuid === val.assign_tenant_uuid ||
        val.assign_tenant_uuid === ""
      ) {
        newData.push({
          ...val,
          selected: tenantData?.uuid === val.assign_tenant_uuid ? true : false,
          badge: 0,
          view: true,
        });
      }
    });
    setItems(newData || []);
  };

  useEffect(() => {
    prepareData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAdminDidData]);

  // Fetching All Did Data
  const onGetAllDid = async () => {
    try {
      await dispatch(adminDidGetAll()).unwrap();
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.error("Get did Data Err --->", e?.message);
    }
  };

  // Fetching Single Tenant Data
  const onGetSingleTenantData = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(tenantSingleGet(id)).unwrap();
      if (res?.statusCode === 200) {
        setTenantData(res?.data);
        onGetAllDid();
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Get Single tenant Data Err =-=>", err);
    }
  };

  // Trigger - When Start of Dragging any Element
  const onDragStart = (result: any) => {
    const dragId = result.draggableId;
    if (!(checkedDids?.includes(dragId) || checkedTenants?.includes(dragId)))
      return;
    const dragName = result.source.droppableId;
    const newItem = items?.map((val: any) => ({
      ...val,
      badge:
        dragName === "dids"
          ? val?.uuid == dragId
            ? checkedDids?.length
            : val?.badge
          : val?.uuid == dragId
          ? checkedTenants?.length
          : val?.badge,
      view:
        dragName === "dids"
          ? checkedDids?.includes(val?.uuid) && val?.uuid != dragId
            ? false
            : val?.view
          : checkedTenants?.includes(val?.uuid) && val?.uuid != dragId
          ? false
          : val?.view,
    }));
    setItems(newItem);
  };

  // Trigger - When End of Dragging any Element
  const onDragEnd = (result: any) => {
    const dragId = result?.draggableId;
    const dropName = result?.destination?.droppableId;

    if (checkedDids?.includes(dragId) || checkedTenants?.includes(dragId)) {
      const newItems = items.map((val: any) => ({
        ...val,
        selected:
          dropName === "tenants"
            ? checkedDids?.includes(val?.uuid)
              ? true
              : val?.selected
            : checkedTenants?.includes(val?.uuid)
            ? false
            : val?.selected,
        badge: 0,
        view: true,
      }));
      if (dropName === "tenants") setCheckedDids([]);
      else setCheckedTenants([]);
      setItems(newItems);
    } else {
      let newItems = items.map((val: any) => ({
        ...val,
        selected:
          val?.uuid == result?.draggableId
            ? dropName === "tenants"
              ? true
              : false
            : val?.selected,
        badge: 0,
      }));
      setItems(newItems);
    }
  };

  // Assign All Trunks & Navigate to Trunk Page
  const onSubmit = async (e: any) => {
    setLoading(true);
    try {
      let dids: any = [];
      items.forEach((val: any) => {
        if (val.selected === true) {
          dids.push(val.uuid);
        }
      });
      const params = {
        id,
        admin_did_uuid: dids.join(","),
      };
      const res: any = await dispatch(didAssign(params)).unwrap();
      if (res?.statusCode === 200) {
        router.back();
        Success(res?.data);
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Get tenet Data Err --->", e?.message);
    }
  };

  const getAvailableDid = () => {
    return items?.filter((val: any) =>
      searchDid
        ? !val?.selected &&
          val?.number?.toLowerCase()?.includes(searchDid?.toLowerCase())
        : !val?.selected
    );
  };

  return (
    <>
      <CardForm
        loading={loading}
        title="Assign DID"
        handleSubmit={(e: any) => onSubmit(e)}
        onCancelClick={() => {
          router.back();
        }}
      >
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className="flex justify-between pt-6 pb-16">
            <div className="max-w-[768px] w-full mr-10">
              <div>
                <div className="py-3 px-10 bg-heading-yellow rounded-t-md">
                  <p className="text-sm font-bold text-heading">
                    Available DID
                  </p>
                </div>
                {isLoading ? (
                  <div className="bg-dark-950 py-6 h-[200px]">
                    <Loader background="transperent" />
                  </div>
                ) : (
                  <div className="bg-dark-950 py-6 rounded-b-md min-h-[200px]">
                    <div className="grid grid-cols-2 px-6">
                      <SearchBar
                        className="w-full py-2.5"
                        placeholder="Search Tenant"
                        value={searchDid}
                        onChange={(e: any) => setSearchDid(e.target.value)}
                      />
                    </div>
                    <Droppable droppableId="dids">
                      {(provided) => (
                        <div
                          className="grid grid-cols-2 pt-6"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {getAvailableDid()?.map(
                            (item: any, index: number, array: any[]) => (
                              <Draggable
                                key={item.uuid}
                                draggableId={item.uuid}
                                index={index}
                              >
                                {(provide: any, snapshot: any) => (
                                  <div
                                    className={`${
                                      index % 2 === 0
                                        ? "pl-6 pr-3"
                                        : "pl-3 pr-6"
                                    }`}
                                    ref={provide.innerRef}
                                    snapshot={snapshot}
                                    {...provide.draggableProps}
                                    {...provide.dragHandleProps}
                                  >
                                    {item?.badge > 1 &&
                                    checkedDids.includes(item.uuid) ? (
                                      <div className="w-72 relative">
                                        {checkedDids?.map(
                                          (_: any, idx: number, array: any) => (
                                            <div
                                              key={idx}
                                              style={{
                                                transform: `rotate(-${
                                                  (array?.length - (idx + 1)) *
                                                  2
                                                }deg)`,
                                              }}
                                              className={`w-full absolute transition-transform bg-primary-v10 border rounded-md border-primary p-4 flex justify-between`}
                                            >
                                              <div className="flex">
                                                <CheckBox defaultChecked />
                                                <p className="text-xs ml-2">
                                                  {item.number}
                                                </p>
                                              </div>
                                              {idx === array?.length - 1 && (
                                                <div className="relative bottom-2 left-1 h-4 w-4 bg-primary rounded-full flex justify-center">
                                                  <p className="text-white text-[11px]">
                                                    {item.badge}
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <>
                                        {item.view && (
                                          <div
                                            className={`${
                                              (index === 0 || index === 1) &&
                                              "border-y-2 rounded-t-md"
                                            } ${
                                              (array?.length - 1 === index ||
                                                array?.length - 2 === index) &&
                                              "rounded-b-md"
                                            } bg-white border-x-2 border-b-2 border-dark-700 px-4 py-2.5 flex items-center justify-between`}
                                          >
                                            <div className="flex items-center">
                                              <Icon
                                                className="mr-2"
                                                name="MoreGray"
                                                alt="moreIcon"
                                                width={24}
                                                height={24}
                                              />
                                              <p className="text-xs items-center">
                                                {item.number}
                                              </p>
                                            </div>
                                            <CheckBox
                                              checked={checkedDids?.includes(
                                                item?.uuid
                                              )}
                                              onChange={(checked: boolean) => {
                                                if (checked) {
                                                  setCheckedDids([
                                                    ...checkedDids,
                                                    item?.uuid,
                                                  ]);
                                                } else {
                                                  const ids = [...checkedDids];
                                                  const idx =
                                                    checkedDids?.indexOf(
                                                      item?.uuid
                                                    );
                                                  if (idx > -1) {
                                                    ids?.splice(idx, 1);
                                                  }
                                                  setCheckedDids(ids);
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                        </div>
                      )}
                    </Droppable>
                    {getAvailableDid()?.length === 0 ? (
                      <div>
                        <p className="text-txt-secondary text-center text-xs p-5">
                          No Available DID
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-[386px] w-full">
              <div>
                <div className="py-3 px-10 bg-secondary-v10 rounded-t-md">
                  <p className="text-sm font-bold text-heading">Assign DID</p>
                </div>
                {isLoading ? (
                  <div className="bg-dark-950 py-6 h-[200px]">
                    <Loader background="transperent" />
                  </div>
                ) : (
                  <div className="rounded-b-md bg-dark-950 p-6 min-h-[200px]">
                    <div>
                      <SearchBar
                        className="w-full py-2.5"
                        placeholder="Search Tenant"
                        value={searchTenant}
                        onChange={(e: any) => setSearchTenant(e.target.value)}
                      />
                      <div>
                        <Droppable droppableId="tenants">
                          {(provided) => (
                            <div
                              className="pt-6"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {items
                                ?.filter((val: any) =>
                                  searchTenant
                                    ? val?.selected &&
                                      val?.number
                                        ?.toLowerCase()
                                        ?.includes(searchTenant?.toLowerCase())
                                    : val?.selected
                                )
                                ?.map(
                                  (item: any, index: number, array: any[]) => (
                                    <Draggable
                                      key={item.uuid}
                                      draggableId={item.uuid}
                                      index={index}
                                    >
                                      {(provide: any, snapshot: any) => (
                                        <div
                                          ref={provide.innerRef}
                                          snapshot={snapshot}
                                          {...provide.draggableProps}
                                          {...provide.dragHandleProps}
                                        >
                                          {item?.badge > 1 &&
                                          checkedTenants.includes(item.uuid) ? (
                                            <div className="w-72 relative">
                                              {checkedTenants?.map(
                                                (
                                                  _: any,
                                                  idx: number,
                                                  array: any
                                                ) => (
                                                  <div
                                                    key={idx}
                                                    style={{
                                                      transform: `rotate(-${
                                                        (array?.length -
                                                          (idx + 1)) *
                                                        2
                                                      }deg)`,
                                                    }}
                                                    className={`w-full absolute transition-transform bg-primary-v10 border rounded-md border-primary p-4 flex justify-between`}
                                                  >
                                                    <div className="flex">
                                                      <CheckBox
                                                        defaultChecked
                                                      />
                                                      <p className="text-xs ml-2">
                                                        {item.number}
                                                      </p>
                                                    </div>
                                                    {idx ===
                                                      array?.length - 1 && (
                                                      <div className="relative bottom-2 left-1 h-4 w-4 bg-primary rounded-full flex justify-center">
                                                        <p className="text-white text-[11px]">
                                                          {item.badge}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <>
                                              {item?.view && (
                                                <div
                                                  className={`${
                                                    index === 0 &&
                                                    "border-y-2 rounded-t-md"
                                                  } ${
                                                    array?.length - 1 ===
                                                      index && "rounded-b-md"
                                                  } bg-white border-x-2 border-b-2 border-dark-700 px-4 py-2.5 flex items-center justify-between`}
                                                >
                                                  <div className="flex items-center">
                                                    <Icon
                                                      className="mr-2"
                                                      name="MoreGray"
                                                      alt="moreIcon"
                                                      width={24}
                                                      height={24}
                                                    />
                                                    <p className="text-xs items-center">
                                                      {item.number}
                                                    </p>
                                                  </div>
                                                  <CheckBox
                                                    checked={checkedTenants?.includes(
                                                      item?.uuid
                                                    )}
                                                    onChange={(
                                                      checked: any
                                                    ) => {
                                                      if (checked) {
                                                        setCheckedTenants([
                                                          ...checkedTenants,
                                                          item?.uuid,
                                                        ]);
                                                      } else {
                                                        const ids = [
                                                          ...checkedTenants,
                                                        ];
                                                        const idx =
                                                          checkedTenants?.indexOf(
                                                            item?.uuid
                                                          );
                                                        if (idx > -1) {
                                                          ids?.splice(idx, 1);
                                                        }
                                                        setCheckedTenants(ids);
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      </CardForm>
    </>
  );
};

export default AssignDid;
