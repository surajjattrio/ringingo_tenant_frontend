"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECTS IMPORT
import {
  msgQueuesGet,
  msgQueueSearch,
  msgQueueCreate,
  msgQueueUpdate,
  useMsgQueue,
  useSingleMsgQueue,
  updateSingleQueueData,
} from "@/redux/slice/tenant-admin/messagingQueueSlice";

import {
  msgChannelsGet,
  msgChannelSearch,
  useMsgChannel,
} from "@/redux/slice/tenant-admin/messagingChannelSlice";

import {
  useSipDevicesData,
  sipOptionsGet,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";

// OPTIONS IMPORT
import { msgQueueTypeOptions, msgChannelTypeOptions } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

import { useAuth } from "@/contexts/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Icon, Loader } from "@/components/ui-components";
import { SearchBar } from "@/components/pickers";
import { Input, Select, Switch, CheckBox } from "@/components/forms";
// TYPES IMPORT
import { InitialQueueValueType } from "@/types/tenant-admin/channelTypes";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ExtensionDnd from "./ExtensionDnd";

const CreateEditMessagingQueueForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;
  const { id } = useParams();
  const { user } = useAuth();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const queueData = useSingleMsgQueue();
  const queues = useMsgQueue();
  const channels = useMsgChannel();
  // const sipDevices = useSipDevicesData();

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [sipDevices, setSipDevices] = useState<any>([]);
  const [extensions, setExtensions] = useState<any>([]);

  const [checkedChannels, setCheckedChannels] = useState<any>([]);
  const [assignedChannels, setAssignedChannels] = useState<any>([]);

  const [checkedExtensions, setCheckedExtensions] = useState<any>([]);
  const [assignedExtensions, setAssignedExtensions] = useState<any>([]);

  const [searchQueue, setSearchQueue] = useState<string>("");
  const [searchExtension, setSearchExtension] = useState<string>("");

  const [channelType, setChannelType] = useState<string>("Select Type");

  const initialValues: InitialQueueValueType = {
    name: "",
    user_uuid: "",
    type: "0",
    status: "0",
  };

  const validationSchema = Yup.object<InitialQueueValueType>({
    name: Yup.string().required("Please Enter Queue Name"),
    type: Yup.string().required("Please Select Type"),
  });

  // Create or Update Channel
  const onSubmit = (values: any) => {
    const payload = { ...values };

    const extensionsAllowed: any = [];
    const channelsAllowed: any = { WhatsApp: [], SMS: [] };

    console.log("extensions", items);
    if (values.type === "1") {
      extensions?.map((val: any) => {
        if (val.selected === true) {
          extensionsAllowed.push(val.uuid);
        }
      });
    }

    items?.map((val: any) => {
      if (val.selected === true) {
        if (val?.type?.toLowerCase() === "sms") {
          channelsAllowed?.SMS.push(val.uuid);
        } else if (val?.type?.toLowerCase() === "whatsapp") {
          channelsAllowed?.WhatsApp.push(val.uuid);
        }else if (val?.type?.toLowerCase() === "instagram") {
          channelsAllowed?.WhatsApp.push(val.uuid);
        }else if (val?.type?.toLowerCase() === "facebook") {
          channelsAllowed?.WhatsApp.push(val.uuid);
        }
      }
    });
    console.log("channelsAllowed", channelsAllowed);

    payload["tenant_uuid"] = user?.tenant_detail?.uuid;
    payload["messaging_queue_channel"] = channelsAllowed;
    payload["messaging_queue_extensions"] = extensionsAllowed;
    if (id) {
      onUpdateQueue(payload);
    } else {
      onCreateQueue(payload);
    }
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useLayoutEffect(() => {
    if (!id) return;
    setValues({
      ...values,
      name: queueData?.name,
      type: queueData?.type,
      status: queueData?.status || "0",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueData, id]);

  // PREPARE DATA
  const prepareData = () => {
    const newData: any = [];
    const extensionsData: any = [];
    console.log(sipDevices);

    channels?.data?.map((val: any) => {
      newData.push({
        ...val,
        selected: queueData
          ? queueData?.messaging_queue_channel?.WhatsApp?.includes(val.uuid) ||
            queueData?.messaging_queue_channel?.SMS?.includes(val.uuid)
            ? true
            : false
          : false,
        badge: 0,
        view: true,
        show: channelType === val.type ? true : false,
      });
    });

    sipDevices?.map((val: any) => {
      extensionsData.push({
        ...val,
        selected: queueData
          ? queueData?.messaging_queue_extensions?.includes(val.uuid)
            ? true
            : false
          : false,
        badge: 0,
        view: true,
        searchable: false,
      });
    });

    setExtensions(extensionsData || []);
    setItems(newData || []);
  };


  useEffect(() => {
    onGetSipOptions();
  }, [channels]);

  useEffect(() => {
    prepareData();
  }, [sipDevices]);

  // Fetching Lead Group Options
  const onGetSipOptions = async () => {
    // console.log("res");
    try {
      const res: any = await dispatch(sipOptionsGet()).unwrap();
      if (res?.statusCode === 200) {
        setSipDevices(res?.data);
      }
      // console.log(res);
    } catch (err) {
      console.error("Get Sip Devices Err =-=>", err);
    }
  };

  // Create Queue Group & Navigate to Queue Group
  const onCreateQueue = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(msgQueueCreate(payload)).unwrap();
      if (res?.statusCode === 201) {
        router.back();
        Success(res.data);
        resetForm();
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Create Queue Err --->", e?.message);
    }
  };

  // Update Queue Group & Navigate to Queue Group
  const onUpdateQueue = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(msgQueueUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        router.back();
        Success(res.data);
        resetForm();
        dispatch(updateSingleQueueData({}));
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Update Queue Err --->", e?.message);
    }
  };

  // Trigger - When Start of Dragging any Element
  const onDragStart = (result: any) => {
    // console.log(result);

    const dragId = result.draggableId;
    if (
      !(
        checkedChannels?.includes(dragId) ||
        assignedChannels?.includes(dragId) ||
        checkedExtensions?.includes(dragId) ||
        assignedExtensions?.includes(dragId)
      )
    )
      return;
    const dragName = result.source.droppableId;

    if (dragName === "channels" || dragName === "assignedchannels") {
      const newItem = items?.map((val: any) => ({
        ...val,
        badge:
          dragName === "channels"
            ? val?.uuid == dragId
              ? checkedChannels?.length
              : val?.badge
            : val?.uuid == dragId
            ? assignedChannels?.length
            : val?.badge,
        view:
          dragName === "channels"
            ? checkedChannels?.includes(val?.uuid) && val?.uuid != dragId
              ? false
              : val?.view
            : assignedChannels?.includes(val?.uuid) && val?.uuid != dragId
            ? false
            : val?.view,
      }));
      setItems(newItem);
    }

    if (dragName === "extensions" || dragName === "assignedextensions") {
      const newItem = extensions?.map((val: any) => ({
        ...val,
        badge:
          dragName === "extensions"
            ? val?.uuid == dragId
              ? checkedExtensions?.length
              : val?.badge
            : val?.uuid == dragId
            ? assignedExtensions?.length
            : val?.badge,
        view:
          dragName === "extensions"
            ? checkedExtensions?.includes(val?.uuid) && val?.uuid != dragId
              ? false
              : val?.view
            : assignedExtensions?.includes(val?.uuid) && val?.uuid != dragId
            ? false
            : val?.view,
      }));
      setExtensions(newItem);
    }
  };

  // Trigger - When End of Dragging any Element
  const onDragEnd = (result: any) => {
    const dragId = result?.draggableId;
    const dropName = result?.destination?.droppableId;

    // console.log(result);
    // console.log(dropName);

    if (dropName === "channels" || dropName === "assignedchannels") {
      if (
        checkedChannels?.includes(dragId) ||
        assignedChannels?.includes(dragId)
      ) {
        const newItems = items.map((val: any) => ({
          ...val,
          selected:
            dropName === "assignedchannels"
              ? checkedChannels?.includes(val?.uuid)
                ? true
                : val?.selected
              : assignedChannels?.includes(val?.uuid)
              ? false
              : val?.selected,
          badge: 0,
          view: true,
        }));
        if (dropName === "assignedchannels") {
          setAssignedChannels([]);
        } else {
          setCheckedChannels([]);
        }

        setItems(newItems);
      } else {
        if (dropName === "assignedchannels") {
          let newItems = items.map((val: any) => ({
            ...val,
            selected:
              val?.uuid == dragId
                ? dropName === "assignedchannels"
                  ? true
                  : false
                : val?.selected,
            badge: 0,
          }));
          setItems(newItems);
        } else {
          let newItems = items.map((val: any) => ({
            ...val,
            selected:
              val?.uuid == dragId
                ? dropName === "assignedchannels"
                  ? true
                  : false
                : val?.selected,
            badge: 0,
          }));
          setItems(newItems);
        }
      }
    }

    if (dropName === "extensions" || dropName === "assignedextensions") {
      if (
        checkedExtensions?.includes(dragId) ||
        assignedExtensions?.includes(dragId)
      ) {
        const newItems = extensions.map((val: any) => ({
          ...val,
          selected:
            dropName === "assignedextensions"
              ? checkedExtensions?.includes(val?.uuid)
                ? true
                : val?.selected
              : assignedExtensions?.includes(val?.uuid)
              ? false
              : val?.selected,
          badge: 0,
          view: true,
        }));

        if (dropName === "assignedextensions") {
          setAssignedExtensions([]);
        } else {
          setCheckedExtensions([]);
        }
        setExtensions(newItems);
      } else {
        if (dropName === "assignedextensions") {
          let newItems = extensions.map((val: any) => ({
            ...val,
            selected:
              val?.uuid == dragId
                ? dropName === "assignedextensions"
                  ? true
                  : false
                : val?.selected,
            badge: 0,
            searchable: true,
          }));
          setExtensions(newItems);
        } else {
          let newItems = extensions.map((val: any) => ({
            ...val,
            selected:
              val?.uuid == dragId
                ? dropName === "assignedextensions"
                  ? true
                  : false
                : val?.selected,
            badge: 0,
          }));
          setExtensions(newItems);
        }
      }
    }
  };

  const handleChannelChange = (value: any) => {
    setChannelType(value);

    const newData: any = [];

    items?.map((val: any) => {
      newData.push({
        ...val,
        selected: queueData
          ? (queueData?.messaging_queue_channel?.WhatsApp?.includes(val.uuid) &&
              val?.selected === true) ||
            (queueData?.messaging_queue_channel?.SMS?.includes(val.uuid) &&
              val?.selected === true) ||
            val?.selected === true
            ? true
            : false
          : false,
        badge: 0,
        view: true,
        show: value?.toLowerCase() === val.type?.toLowerCase() || items.selected === true ? true : false,
      });
    });

    setItems(newData || []);
  };
  const setChannelSelected = (uuid: string, selected: boolean) => {
    setItems((prev: any[]) =>
      prev.map((v) => (v.uuid === uuid ? { ...v, selected } : v))
    );
  };
  const renderChannelName = (item: any) => {
    return (
      <p className="text-xs ml-1 flex items-center">
        <Icon
          className="mr-2"
          name={item.type === "WhatsApp" ? "whatsapp" : "sms"}
          alt="moreIcon"
          width={18}
          height={18}
        />
        <span className="ml-1 mr-3">{item.name}</span>
        <span>{item.from_number}</span>
      </p>
    );
  };

  return (
    <>
      <CardForm
        id={id}
        name="mc"
        managerName={managerName}
        length={id ? 0 : queues?.count}
        title={id ? "Edit Messaging Queue" : "Create Messaging Queue"}
        loading={loading}
        handleSubmit={handleSubmit}
        onDoneClick={handleSubmit}
        onCancelClick={() => {
          resetForm();
          router.back();
          id && dispatch(updateSingleQueueData({}));
        }}
      >
        <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
          <Input
            name="name"
            label={
              <>
                Name <span className="text-red-500">*</span>
              </>
            }
            icon="UserOutline"
            placeholder="Enter Queue Name"
            value={values.name}
            touched={touched}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            isInfo
          />
          <Select
            name="type"
            label={
              <>
                Type <span className="text-red-500">*</span>
              </>
            }
            icon="Type"
            placeholder="Select Type"
            removable
            options={msgQueueTypeOptions}
            value={values.type}
            touched={touched}
            errors={errors}
            onChange={(e: any) => {
              setFieldValue("type", e.target.value);
            }}
            onBlur={handleBlur}
            isInfo
          />
          <Switch
            className="pt-[2px]"
            switchButtonClass="py-1.5"
            label="Status"
            value={values.status}
            onClick={(value: string) => setFieldValue("status", value)}
          />
        </div>

        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {/* Extensions start */}
          {values.type === "1" ? (
            <ExtensionDnd
              isLoading={isLoading}
              searchExtension={searchExtension}
              setSearchExtension={setSearchExtension}
              extensions={extensions}
              checkedExtensions={checkedExtensions}
              setCheckedExtensions={setCheckedExtensions}
              setAssignedExtensions={setAssignedExtensions}
              assignedExtensions={assignedExtensions}
            />
          ) : (
            ""
          )}
          {/* Extension end */}

          <div className="flex justify-between pt-6 pb-16">
            <div className="max-w-[768px] w-full mr-10">
              <div>
                <div className="py-3 px-10 bg-heading-yellow rounded-t-md">
                  <p className="text-sm font-bold text-heading">Channels</p>
                </div>
                {isLoading ? (
                  <div className="bg-dark-950 py-6 h-[200px]">
                    <Loader background="transperent" />
                  </div>
                ) : (
                  <div className="bg-dark-950 py-6 rounded-b-md min-h-[200px]">
                    <div className="grid grid-cols-2 px-3">
                      <Select
                        name="channel_type"
                        placeholder="Select Type"
                        removable
                        options={msgChannelTypeOptions}
                        value={channelType}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                          handleChannelChange(e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                        isShowLabel={false}
                      />
                    </div>
                    <Droppable droppableId="channels">
                      {(provided) => (
                        <div
                          className="grid grid-cols-2 pt-6"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {items
                            ?.filter(
                              (val: any) =>
                                // searchQueue
                                //     ? !val?.selected &&
                                //     val?.number
                                //         ?.toLowerCase()
                                //         ?.includes(searchQueue?.toLowerCase())
                                //     : !val?.selected
                                !val?.selected
                            )
                            ?.map((item: any, index: number, array: any[]) => {
                              if (item?.show === true) {
                                return (
                                  <Draggable
                                    key={item.uuid}
                                    draggableId={item.uuid}
                                    index={index}
                                  >
                                    {(provide: any, snapshot: any) => (
                                      <div
                                        className={`${
                                          index % 2 === 0
                                            ? "pl-3 pr-6 mb-2"
                                            : "pl-3 pr-6 mb-2"
                                        }`}
                                        ref={provide.innerRef}
                                        snapshot={snapshot}
                                        {...provide.draggableProps}
                                        {...provide.dragHandleProps}
                                      >
                                        {item?.badge > 1 &&
                                        checkedChannels.includes(item.uuid) ? (
                                          <div className="w-72 relative">
                                            {checkedChannels?.map(
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
                                                    {/* <CheckBox defaultChecked /> */}
                                                    {renderChannelName(item)}
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
                                            {item.view && (
                                              <div
                                                className={`${
                                                  (index === 0 ||
                                                    index === 1) &&
                                                  "border-y-2 rounded-t-md"
                                                } ${
                                                  (array?.length - 1 ===
                                                    index ||
                                                    array?.length - 2 ===
                                                      index) &&
                                                  "rounded-b-md"
                                                } bg-white border-x-2 border-y-2 border-dark-700 px-4 py-2.5 flex items-center justify-between`}
                                              >
                                                <div className="flex items-center">
                                                  <Icon
                                                    className="mr-2"
                                                    name="MoreGray"
                                                    alt="moreIcon"
                                                    width={24}
                                                    height={24}
                                                  />
                                                  {renderChannelName(item)}
                                                </div>
                                                <CheckBox
                                                  checked={checkedChannels?.includes(
                                                    item?.uuid
                                                  )}
                                                  onChange={(
                                                    checked: boolean
                                                  ) => {
                                                    if (checked) {
                                                      setCheckedChannels([
                                                        ...checkedChannels,
                                                        item?.uuid,
                                                      ]);
                                                    } else {
                                                      const ids = [
                                                        ...checkedChannels,
                                                      ];
                                                      const idx =
                                                        checkedChannels?.indexOf(
                                                          item?.uuid
                                                        );
                                                      if (idx > -1) {
                                                        ids?.splice(idx, 1);
                                                      }
                                                      setCheckedChannels(ids);
                                                    }
                                                    setChannelSelected(
                                                      item.uuid,
                                                      checked
                                                    );
                                                  }}
                                                />
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              }
                            })}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-[386px] w-full">
              <div>
                <div className="py-3 px-10 bg-secondary-v10 rounded-t-md">
                  <p className="text-sm font-bold text-heading">
                    Messaging Queue
                  </p>
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
                        placeholder="Search Channel"
                        value={searchQueue}
                        onChange={(e: any) => setSearchQueue(e.target.value)}
                      />
                      <div>
                        <Droppable droppableId="assignedchannels">
                          {(provided) => (
                            <div
                              className="pt-6"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {items
                                ?.filter(
                                  (val: any) =>
                                    // searchQueue
                                    //     ? val?.selected &&
                                    //     val?.name
                                    //         ?.includes(searchQueue)
                                    //     : val?.selected
                                    val?.selected
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
                                          assignedChannels.includes(
                                            item.uuid
                                          ) ? (
                                            <div className="w-72 relative">
                                              {assignedChannels?.map(
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
                                                      {renderChannelName(item)}
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
                                              {searchQueue !== "" ? (
                                                item.name?.includes(
                                                  searchQueue
                                                ) ? (
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
                                                      {renderChannelName(item)}
                                                    </div>
                                                    <CheckBox
                                                      checked={assignedChannels?.includes(
                                                        item?.uuid
                                                      )}
                                                      onChange={(
                                                        checked: any
                                                      ) => {
                                                        if (checked) {
                                                          setAssignedChannels([
                                                            ...assignedChannels,
                                                            item?.uuid,
                                                          ]);
                                                        } else {
                                                          const ids = [
                                                            ...assignedChannels,
                                                          ];
                                                          const idx =
                                                            assignedChannels?.indexOf(
                                                              item?.uuid
                                                            );
                                                          if (idx > -1) {
                                                            ids?.splice(idx, 1);
                                                          }
                                                          setAssignedChannels(
                                                            ids
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                ) : (
                                                  ""
                                                )
                                              ) : (
                                                item?.view && (
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
                                                      {renderChannelName(item)}
                                                    </div>
                                                    <CheckBox
                                                      checked={assignedChannels?.includes(
                                                        item?.uuid
                                                      )}
                                                      onChange={(
                                                        checked: any
                                                      ) => {
                                                        if (checked) {
                                                          setAssignedChannels([
                                                            ...assignedChannels,
                                                            item?.uuid,
                                                          ]);
                                                        } else {
                                                          const ids = [
                                                            ...assignedChannels,
                                                          ];
                                                          const idx =
                                                            assignedChannels?.indexOf(
                                                              item?.uuid
                                                            );
                                                          if (idx > -1) {
                                                            ids?.splice(idx, 1);
                                                          }
                                                          setAssignedChannels(
                                                            ids
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                )
                                              )}

                                              {/* {item?.view && (
                                                                                            <div
                                                                                                className={`${index === 0 &&
                                                                                                    "border-y-2 rounded-t-md"
                                                                                                    } ${array?.length - 1 ===
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
                                                                                                        {item.name}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <CheckBox
                                                                                                    checked={assignedChannels?.includes(
                                                                                                        item?.uuid
                                                                                                    )}
                                                                                                    onChange={(
                                                                                                        checked: any
                                                                                                    ) => {
                                                                                                        if (checked) {
                                                                                                            setAssignedChannels([
                                                                                                                ...assignedChannels,
                                                                                                                item?.uuid,
                                                                                                            ]);
                                                                                                        } else {
                                                                                                            const ids = [
                                                                                                                ...assignedChannels,
                                                                                                            ];
                                                                                                            const idx =
                                                                                                                assignedChannels?.indexOf(
                                                                                                                    item?.uuid
                                                                                                                );
                                                                                                            if (idx > -1) {
                                                                                                                ids?.splice(idx, 1);
                                                                                                            }
                                                                                                            setAssignedChannels(ids);
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        )} */}
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

export default CreateEditMessagingQueueForm;
