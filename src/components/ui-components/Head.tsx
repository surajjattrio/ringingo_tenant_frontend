"use client";

// PROJECT IMPORT
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger } from "@/redux/services/toasterServices";
import { Button } from "../forms";
import { SearchBar } from "../pickers";
import Filter from "./Filter";
import Icon from "./Icon";

// THIRD - PARTY IMPORT
import { CSVLink } from "react-csv";
import { useEffect, useRef, useState } from "react";
import { downloadzipFile } from "@/helperFunctions";

// TYPES
interface HeadProps {
  children?: React.ReactNode;
  name?: string | null;
  length?: number;
  csvProps?: any;
  createText?: string;
  search?: string;
  filterOpen?: boolean;
  csvloader?: boolean;
  isCsvDownload?: boolean;
  onCreateClick?: () => void;
  onDeleteClick?: () => void;
  onStatusClick?: () => void;
  onBatchUpdateClick?: () => void;
  batchUpdateDisabled?: boolean;
  onChange?: (e: any) => any;
  onColumnClick?: () => void;
  onCsvClick?: () => void;
  onSearchClick?: () => void;
  onImportClick?: () => void;
  onHide?: () => void;
  setIsCsvDownload?: any;
  managerName?: string | null;
  onTodayClick?: () => void;
  bulkRecordingData?: any;
  isBulkRecording?: boolean;
  title?: string;
  submitText?: string;
  isAdvance?: boolean;
  onToggleAdvance?: () => void;
  filterText?: string;
  isLoading?: boolean;
}

const Head = (props: HeadProps) => {
  const {
    children,
    name,
    length = 0,
    csvProps,
    createText = "Create",
    search,
    filterOpen = false,
    onCreateClick,
    onDeleteClick,
    onStatusClick,
    onBatchUpdateClick,
    batchUpdateDisabled = false,
    onChange,
    onColumnClick,
    onSearchClick,
    onImportClick,
    onTodayClick,
    onHide,
    onCsvClick,
    setIsCsvDownload,
    csvloader = false,
    isCsvDownload = false,
    managerName = "",
    bulkRecordingData,
    isBulkRecording = false,
    title = "Search",
    submitText = "Search",
    isAdvance,
    onToggleAdvance,
    filterText,
    isLoading = false,
  } = props;
  const [isToday, setIsToday] = useState<boolean>(true);
  const handleButtonClick = () => {
    // alert(isToday);
    if (isToday == true) {
      setIsToday(false);
    } else {
      setIsToday(true);
    }
  };
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const excelRef: any = useRef();

  useEffect(() => {
    if (isCsvDownload && !csvloader) {
      excelRef?.current.link?.click();
      setIsCsvDownload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCsvDownload]);

  const isDisabled = () => {
    const data = user?.tenant_detail?.roles?.length
      ? user?.tenant_detail?.roles[0]
      : {};
    let allData: any = {};
    if (data?.module_permission?.users)
      allData = { ...allData, ...data?.module_permission?.users };
    if (data?.module_permission?.settings)
      allData = { ...allData, ...data?.module_permission?.settings };
    if (data?.module_permission?.reports)
      allData = { ...allData, ...data?.module_permission?.reports };
    if (data?.module_permission?.outgoing_rules)
      allData = { ...allData, ...data?.module_permission?.outgoing_rules };
    if (data?.module_permission?.lead_management)
      allData = { ...allData, ...data?.module_permission?.lead_management };
    if (data?.module_permission?.incoming_rules)
      allData = { ...allData, ...data?.module_permission?.incoming_rules };
    if (data?.module_permission?.call_center)
      allData = { ...allData, ...data?.module_permission?.call_center };
    if (data?.module_permission?.broadcasting)
      allData = { ...allData, ...data?.module_permission?.broadcasting };
    if (data?.module_permission?.api)
      allData = { ...allData, ...data?.module_permission?.api };

    if (
      name &&
      allData[name] &&
      allData[name] <= length &&
      allData[name] == 0
    ) {
      return true;
    }
    return false;
  };

  const onClose = () => {
    if (onToggleAdvance) {
      onToggleAdvance();
    } else {
      setIsOpen(false);
    }
    onHide?.();
    setSearched(false)
  };

  const isShowButton = (buttontype: string) => {
    const data = user?.manager_detail?.roles?.length
      ? user?.manager_detail?.roles[0]
      : {};

    if (
      managerName &&
      data?.module_permission[managerName]?.[buttontype] === "0"
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="bg-white rounded-xl items-cente mx-3 mt-5">
      <div className="flex gap-3 items-cente  bg-header-background ">
        {/* {"border rounded-md p-3 shadow-sm "} */}
        {/* <div className="relative z-[1] h-9 flex right-0 w-full"> */}
        <div className="relative z-[1] h-9 flex justify-end w-full">
          <div className="flex gap-4">


          </div>
          <div className="flex h-full gap-4 items-center">
            {onTodayClick && (
              <Button
                className="px-3 h-full"
                text={isToday ? "Today" : "All"}
                style="primary"
                responsive
                onClick={() => {
                  handleButtonClick();
                  onTodayClick();
                }}
              />
            )}
            {onChange && (
              <SearchBar
                className="h-full w-56 bg-blue-50"
                placeholder="Search by Keyword"
                value={search}
                onChange={onChange}
              />
            )}
            {onCreateClick &&
              (managerName ? (
                isShowButton("create") && (
                  <Button
                    className="px-3 h-full"
                    text={createText}
                    style="primary"
                    icon="PlusWhite"
                    responsive
                    onClick={onCreateClick}
                  />
                )
              ) : (
                <Button
                  className="px-3 h-full"
                  text={createText}
                  style="primary"
                  icon="PlusWhite"
                  responsive
                  onClick={() => {
                    onCreateClick
                      ? isDisabled()
                        ? Danger(`Maximun limit is ${length}`)
                        : onCreateClick()
                      : null;
                  }}
                />
              ))}
            {onBatchUpdateClick && (
              <Button
                disabled={batchUpdateDisabled}
                className={`px-3 h-full${batchUpdateDisabled ? " opacity-60" : ""}`}
                text="Batch Update"
                style="primary"
                icon="Refresh2White"
                responsive
                onClick={onBatchUpdateClick}
              />
            )}
            {isBulkRecording &&
              <button
                className=" px-4 py-2.5 text-xs font-bold rounded-full text-xs bg-[#322996] hover:opacity-0.5 text-white "
                onClick={() => {
                  const startOfDay = new Date();
                  startOfDay.setHours(0, 0, 0, 0);
                  type Filter = {
                    role: string;
                    tenant_uuid: string | undefined;
                    callstart?: string;
                    callend?: string;
                    caller_id_number?: string;
                    destination_number?: string;
                    billsecond?: string;
                    campaign_uuid?: string;
                    user_uuid?: string;
                  };
                  // BASIC FILTER ALWAYS INCLUDED
                  let filter: Filter = {
                    role: "tenant",
                    tenant_uuid: user?.tenant_detail?.uuid,
                    callstart: startOfDay.toISOString(),
                    callend: new Date(Date.now()).toISOString(),
                  };
                  if ((isOpen || isAdvance) && searched) {
                    if (bulkRecordingData?.callstart?.val)
                      filter.callstart = bulkRecordingData.callstart.val;

                    if (bulkRecordingData?.callend?.val)
                      filter.callend = bulkRecordingData.callend.val;

                    if (bulkRecordingData?.caller_id_number?.val)
                      filter.caller_id_number = bulkRecordingData.caller_id_number.val;

                    if (bulkRecordingData?.destination_number?.val)
                      filter.destination_number = bulkRecordingData.destination_number.val;

                    if (bulkRecordingData?.billsecond?.val)
                      filter.billsecond = bulkRecordingData.billsecond.val;

                    if (bulkRecordingData?.campaign_uuid?.val)
                      filter.campaign_uuid = bulkRecordingData.campaign_uuid.val;

                    if (bulkRecordingData?.user_uuid?.val)
                      filter.user_uuid = bulkRecordingData.user_uuid.val;
                  }
                  downloadzipFile(
                    "/recordings/download/advanced-search",
                    "recordings.zip",
                    "POST",
                    filter
                  );
                }}
              >
                Bulk download
              </button>
            }
            {children && !filterOpen && (
              <Filter
                text={filterText}
                onClick={() => {
                  if (onToggleAdvance) {
                    onToggleAdvance();
                  } else {
                    {
                      isOpen && onClose();
                    }
                    setIsOpen(!isOpen);
                  }
                }}
              />
            )}

            {onDeleteClick &&
              (managerName ? (
                isShowButton("delete") && (
                  <Button
                    className="px-3 h-full"
                    text="Delete"
                    style="error"
                    icon="DeleteWhite"
                    responsive
                    onClick={onDeleteClick}
                  />
                )
              ) : (
                <Button
                  className="px-3 h-full"
                  text="Delete"
                  style="error"
                  icon="DeleteWhite"
                  responsive
                  onClick={onDeleteClick}
                />
              ))}
            {onStatusClick &&
              (managerName ? (
                isShowButton("delete") && (
                  <Button
                    className="opacity-60 px-3 h-full hover:opacity-60 flex items-center font-bold gap-1 rounded-md justify-center bg-secondary text-white border-2 border-secondary"
                    text="Status"
                    style="error"
                    responsive
                    onClick={onStatusClick}
                  />
                )
              ) : (
                <Button
                  className="opacity-60 px-3 h-full hover:opacity-60 flex items-center font-bold gap-1 rounded-md justify-center bg-secondary text-white border-2 border-secondary"
                  text="Status"
                  style="error"
                  responsive
                  onClick={onStatusClick}
                />
              ))}
            {csvProps ? (
              csvloader ? (
                <div
                  className={`mr-2 h-4 w-4 border-t-transparent border-spacing-1 animate-spin rounded-full border-heading border-2`}
                ></div>
              ) : (
                <>
                  <Button
                    className="px-5 py-[5px] border border-gray-200 bg-white"
                    style="none"
                    icon="Export"
                    tooltip="Export"
                    iconWidth={24}
                    iconHeight={24}
                    onClick={onCsvClick}
                  />
                  {/* changed icon component to button for export  */}
                  {/* <div
                    className={`flex items-center justify-center px-5 py-[5px] border border-gray-200 rounded-[2px]  cursor-pointer  bg-white hover:bg-gray-50 transition-colors `}
                    onClick={onCsvClick}
                  >
                    <Icon
                      name="Export"
                      width={24}
                      height={24}
                      tooltip="Export"
                      alt="Export"
                    />
                  </div> */}
                  {isCsvDownload && (
                    <CSVLink
                      {...csvProps}
                      ref={excelRef}
                      className="hiddenExcel"
                      target="_blank"
                    ></CSVLink>
                  )}
                </>
              )
            ) : null}
            {onImportClick && (
              <Button
                className="px-5 py-[5px] border border-gray-200 bg-white"
                style="none"
                icon="Import"
                tooltip="Import"
                iconWidth={24}
                iconHeight={24}
                onClick={onImportClick}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${isAdvance !== undefined ? (isAdvance ? "" : "hidden") : (isOpen || filterOpen ? "" : "hidden")
          }`}
      >
        <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
          <span className="text-sm font-bold">{title}</span>
          {(onHide || onToggleAdvance) && (
            <Icon
              className="cursor-pointer"
              tooltip="Close"
              name="Close"
              width={20}
              height={20}
              alt="Close"
              onClick={onClose}
            />
          )}
        </div>
        <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-4 tsm:grid-cols-1 gap-x-4">
          {children}
        </div>
        <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
          <div className="flex gap-3 px-10">
            {(onHide || onToggleAdvance) ? (
              <Button
                className="px-3 py-2"
                text="Cancel"
                style="dark-outline"
                onClick={onClose}
              />
            ) : null}
            <Button
              className="px-3 py-2"
              text={submitText}
              style="primary"
              loading={isLoading}
              onClick={() => {
                setSearched?.(true);
                onSearchClick?.();
              }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Head;
