"use client";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { Danger } from "@/redux/services/toasterServices";
import {
  setActiveTab,
  setHeaderValue,
  useActiveTab,
} from "@/redux/slice/commonSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import Button from "../forms/Button";
import Icon from "./Icon";

// TYPES
interface CardFormProps {
  className?: string;
  name?: string;
  length?: number;
  children?: React.ReactNode;
  tabsData?: any;
  title: string;
  cancelText?: string;
  doneText?: string;
  scroll?: boolean;
  loading?: boolean;
  onTabChange?: any;
  handleSubmit?: any;
  onDoneClick?: any;
  onCancelClick?: any;
  id?: string;
  isCancelClick?: boolean;
  isDoneClick?: boolean;
  isCancelIcon?: boolean;
  managerName?: string;
}

/* ============================== CARD FORM ============================== */

const CardForm = (props: CardFormProps) => {
  const {
    id = null,
    className = "",
    name,
    length = 0,
    children,
    tabsData = [],
    title,
    cancelText = "Cancel",
    doneText = id ? "Save Changes" : "Save",
    scroll,
    loading,
    onTabChange,
    handleSubmit,
    onDoneClick,
    onCancelClick,
    isDoneClick = true,
    isCancelClick = true,
    isCancelIcon = true,
    managerName = "",
  } = props;

  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const activeTab = useActiveTab();
  dispatch(setHeaderValue(title));

  const isDisabled = () => {
    const data = user?.tenant_detail?.roles?.length
      ? user?.tenant_detail?.roles[0]
      : {};
    let allData: any = {};
    if (data?.default_permission)
      allData = { ...allData, ...data?.default_permission };
    if (data?.module_permission?.call_center)
      allData = { ...allData, ...data?.module_permission?.call_center };
    if (data?.module_permission?.pbx)
      allData = { ...allData, ...data?.module_permission?.pbx };

    return !!(
      name &&
      allData[name] &&
      allData[name] <= length &&
      allData[name] != 0
    );
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

  const Component =
    tabsData?.length && tabsData[activeTab] && tabsData[activeTab]?.component
      ? tabsData[activeTab]?.component
      : null;

  return (
    <div
      className={`${className} relative flex flex-col bg-white rounded-[30px] h-[calc(100vh-123px)] tsm:h-[calc(100vh-183px)]`}
    >
      {/* Tabs */}
      {tabsData?.length ? (
        <ul className="flex -mb-px text-xs font-medium px-4 text-center text-gray-50 overflow-x-scroll scrollbar-hide border-b border-dark-700">
          {tabsData?.map((val: any, idx: number) => {
            const active = idx === activeTab;
            return (
              <li
                className={`mr-2 cursor-pointer border-b-2 px-2 pb-3 ${
                  active ? "!border-primary" : "border-transparent"
                }`}
                key={idx}
                onClick={() => {
                  onTabChange && onTabChange(idx);
                  dispatch(setActiveTab(idx));
                }}
              >
                <p
                  className={`text-xs pt-3 pb-2 ${
                    active
                      ? "font-bold text-primary"
                      : "font-normal text-txt-primary"
                  } whitespace-nowrap`}
                >
                  {val?.title}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}

      {/* Scrollable form area */}
      <form
        className="flex-1 overflow-y-auto px-6 py-4 tsm:px-4"
        autoComplete="off"
        onSubmit={(e: any) => {
          e.preventDefault();
          if (managerName) {
            if (handleSubmit) {
              if (id) {
                isShowButton("edit")
                  ? handleSubmit(e, activeTab)
                  : Danger(`You don't have a permission of edit`);
              } else {
                isShowButton("create")
                  ? handleSubmit(e, activeTab)
                  : Danger(`You don't have a permission of create`);
              }
            }
          } else {
            handleSubmit
              ? isDisabled()
                ? Danger(`Maximum limit is ${length}`)
                : handleSubmit(e, activeTab)
              : null;
          }
        }}
      >
        {Component && !onTabChange ? <Component /> : children}
      </form>

      {/* Sticky Save/Cancel Button Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-10 tsm:px-4 py-5 z-30">
        <div className="flex justify-end gap-4">
          {isCancelClick && (
            <div className="flex items-center relative">
              <Button
                className="px-6 py-2.5 flex items-center bg-zinc-400 text-white gap-2 rounded-full pl-10"
                style="secondary"
                loading={loading}
                text={cancelText}
                onClick={onCancelClick}
              />
              <Icon
                name="CloseCircleWhite"
                className="absolute left-4 text-white"
                width={16}
                height={16}
              />
            </div>
          )}
          {isDoneClick && (
            <div className="flex items-center relative">
              <Button
                className="px-6 py-2.5 text-white flex items-center gap-2 rounded-full bg-indigo-600 pl-10"
                type="submit"
                style="primary"
                loading={loading}
                text={doneText}
                onClick={onDoneClick}
              />
              <Icon
                name="SaveWhite"
                className="absolute left-4 text-white"
                width={16}
                height={16}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
