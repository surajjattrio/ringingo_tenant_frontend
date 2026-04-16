"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
  trunkAssign,
  trunkSingleGet,
} from "@/redux/slice/master-admin/trunkSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  tenantGetAll,
  useAllTenantData,
} from "@/redux/slice/master-admin/tenantSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon } from "@/components/ui-components";
import { SearchBar } from "@/components/pickers";
import { CheckBox } from "@/components/forms";

// THIRD - PARTY IMPORT
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

/* ============================== ASSIGN TRUNK ============================== */

const AssignTrunk = () => {
  const { id }: any = useParams();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const allTenantData = useAllTenantData();

  const [loading, setLoading] = useState<boolean>(false);
  const [trunkData, setTrunkData] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const [checkedTenants, setCheckedTenants] = useState<any>([]);
  const [checkedTrunks, setCheckedTrunks] = useState<any>([]);
  const [searchTenant, setSearchTenant] = useState<string>("");
  const [searchTrunk, setSearchTrunk] = useState<string>("");

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleTrunkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    onGetAllTenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newData = allTenantData?.map((val: any) => ({
      ...val,
      selected: trunkData?.tenant_uuid?.includes(val.uuid) ? true : false,
      badge: 0,
      view: true,
    }));
    setItems(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTenantData, trunkData]);

  // Fetching All Tenant Data
  const onGetAllTenant = async () => {
    try {
      await dispatch(tenantGetAll()).unwrap();
    } catch (e: any) {
      console.error("Get tenet Data Err --->", e?.message);
    }
  };

  // Fetching Single Trunk Data
  const onGetSingleTrunkData = async () => {
    try {
      const res: any = await dispatch(trunkSingleGet(id)).unwrap();
      if (res?.statusCode === 200) {
        setTrunkData(res?.data);
      }
    } catch (err) {
      console.error("Get Single Trunk Data Err =-=>", err);
    }
  };

  // Trigger - When Start of Dragging any Element
  const onDragStart = (result: any) => {
    const dragId = result.draggableId;
    if (!(checkedTenants?.includes(dragId) || checkedTrunks?.includes(dragId)))
      return;
    const dragName = result.source.droppableId;
    const newItem = items?.map((val: any) => ({
      ...val,
      badge:
        dragName === "tenants"
          ? val?.uuid == dragId
            ? checkedTenants?.length
            : val?.badge
          : val?.uuid == dragId
          ? checkedTrunks?.length
          : val?.badge,
      view:
        dragName === "tenants"
          ? checkedTenants?.includes(val?.uuid) && val?.uuid != dragId
            ? false
            : val?.view
          : checkedTrunks?.includes(val?.uuid) && val?.uuid != dragId
          ? false
          : val?.view,
    }));
    setItems(newItem);
  };

  // Trigger - When End of Dragging any Element
  const onDragEnd = (result: any) => {
    const dragId = result?.draggableId;
    const dropName = result?.destination?.droppableId;

    if (checkedTenants?.includes(dragId) || checkedTrunks?.includes(dragId)) {
      const newItems = items.map((val: any) => ({
        ...val,
        selected:
          dropName === "trunk"
            ? checkedTenants?.includes(val?.uuid)
              ? true
              : val?.selected
            : checkedTrunks?.includes(val?.uuid)
            ? false
            : val?.selected,
        badge: 0,
        view: true,
      }));
      if (dropName === "trunk") setCheckedTenants([]);
      else setCheckedTrunks([]);
      setItems(newItems);
    } else {
      let newItems = items.map((val: any) => ({
        ...val,
        selected:
          val?.uuid == result?.draggableId
            ? dropName === "trunk"
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
      let tenetIDs: any = [];
      items.forEach((val: any) => {
        if (val.selected === true) {
          tenetIDs.push(val.uuid);
        }
      });
      const params = {
        id,
        tenant_uuid: tenetIDs.join(","),
      };
      const res: any = await dispatch(trunkAssign(params)).unwrap();
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

  return (
    <>
      <CardForm
        loading={loading}
        title="Assign SIP Trunks"
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
                    Available Tenant
                  </p>
                </div>
                <div className="bg-dark-950 py-6 rounded-b-md">
                  <div className="grid grid-cols-2 px-6">
                    <SearchBar
                      className="w-full py-2.5"
                      placeholder="Search Tenant"
                      value={searchTenant}
                      onChange={(e: any) => setSearchTenant(e.target.value)}
                    />
                  </div>
                  <Droppable droppableId="tenants">
                    {(provided) => (
                      <div
                        className="grid grid-cols-2 pt-6"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {items
                          ?.filter((val: any) =>
                            searchTenant
                              ? !val?.selected &&
                                val?.tenant_name
                                  ?.toLowerCase()
                                  ?.includes(searchTenant?.toLowerCase())
                              : !val?.selected
                          )
                          ?.map((item: any, index: number, array: any[]) => (
                            <Draggable
                              key={item.uuid}
                              draggableId={item.uuid}
                              index={index}
                            >
                              {(provide: any, snapshot: any) => (
                                <div
                                  className={`${
                                    index % 2 === 0 ? "pl-6 pr-3" : "pl-3 pr-6"
                                  }`}
                                  ref={provide.innerRef}
                                  snapshot={snapshot}
                                  {...provide.draggableProps}
                                  {...provide.dragHandleProps}
                                >
                                  {item?.badge > 1 &&
                                  checkedTenants.includes(item.uuid) ? (
                                    <div className="w-72 relative">
                                      {checkedTenants?.map(
                                        (_: any, idx: number, array: any) => (
                                          <div
                                            key={idx}
                                            style={{
                                              transform: `rotate(-${
                                                (array?.length - (idx + 1)) * 2
                                              }deg)`,
                                            }}
                                            className={`w-full absolute transition-transform bg-primary-v10 border rounded-md border-primary p-4 flex justify-between`}
                                          >
                                            <div className="flex">
                                              <CheckBox defaultChecked />
                                              <p className="text-xs ml-2">
                                                {item.tenant_name}
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
                                              {item.tenant_name}
                                            </p>
                                          </div>
                                          <CheckBox
                                            checked={checkedTenants?.includes(
                                              item?.uuid
                                            )}
                                            onChange={(checked: boolean) => {
                                              if (checked) {
                                                setCheckedTenants([
                                                  ...checkedTenants,
                                                  item?.uuid,
                                                ]);
                                              } else {
                                                const ids = [...checkedTenants];
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
                          ))}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>

            <div className="max-w-[386px] w-full">
              <div>
                <div className="py-3 px-10 bg-secondary-v10 rounded-t-md">
                  <p className="text-sm font-bold text-heading">
                    Assign Tenant
                  </p>
                </div>
                <div className="rounded-b-md bg-dark-950 p-6">
                  <div>
                    <SearchBar
                      className="w-full py-2.5"
                      placeholder="Search Tenant"
                      value={searchTrunk}
                      onChange={(e: any) => setSearchTrunk(e.target.value)}
                    />
                    <div>
                      <Droppable droppableId="trunk">
                        {(provided) => (
                          <div
                            className="pt-6"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {items
                              ?.filter((val: any) =>
                                searchTrunk
                                  ? val?.selected &&
                                    val?.tenant_name
                                      ?.toLowerCase()
                                      ?.includes(searchTrunk?.toLowerCase())
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
                                        checkedTrunks.includes(item.uuid) ? (
                                          <div className="w-72 relative">
                                            {checkedTrunks?.map(
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
                                                    <CheckBox defaultChecked />
                                                    <p className="text-xs ml-2">
                                                      {item.tenant_name}
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
                                                  array?.length - 1 === index &&
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
                                                    {item.tenant_name}
                                                  </p>
                                                </div>
                                                <CheckBox
                                                  checked={checkedTrunks?.includes(
                                                    item?.uuid
                                                  )}
                                                  onChange={(checked: any) => {
                                                    if (checked) {
                                                      setCheckedTrunks([
                                                        ...checkedTrunks,
                                                        item?.uuid,
                                                      ]);
                                                    } else {
                                                      const ids = [
                                                        ...checkedTrunks,
                                                      ];
                                                      const idx =
                                                        checkedTrunks?.indexOf(
                                                          item?.uuid
                                                        );
                                                      if (idx > -1) {
                                                        ids?.splice(idx, 1);
                                                      }
                                                      setCheckedTrunks(ids);
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
              </div>
            </div>
          </div>
        </DragDropContext>
      </CardForm>
    </>
  );
};

export default AssignTrunk;
