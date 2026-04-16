"use client";

// PROJECT IMPORTS
import { useAllHeaderTenantData } from "@/redux/slice/master-admin/tenantSlice";
import SearchBar from "../pickers/SearchBar";

// TYPES
interface loginToPopupProps {
  className?: string;
  visible?: boolean;
  filter: any;
  onClick?: any;
  setFilter: any;
  onSelectUser?: any;
}

/* ============================== LOGIN TO POPUP ============================== */

const LoginToPopup = (props: loginToPopupProps) => {
  const {
    className,
    visible = false,
    filter,
    setFilter,
    onClick,
    onSelectUser,
  } = props;

  const tenantData = useAllHeaderTenantData();

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-transparent ${
          !visible && "hidden"
        }`}
        onClick={onClick}
      >
        <div className="w-full h-full relative flex justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${className} w-[257px] max-h-[342px] bg-white rounded-xl pb-6 drop-shadow-xl ${
              !visible && "hidden"
            }`}
          >
            <div className="bg-secondary font-bold text-sm py-2 px-4 rounded-t-xl">
              <span className="text-white ">Login to</span>
            </div>
            <div className="px-4 h-8 mb-2 mt-3">
              <SearchBar
                className="h-full w-full px-3"
                placeholder="Search by name"
                iconWidth={16}
                iconHeight={16}
                onChange={(e: any) =>
                  setFilter({
                    ...filter,
                    search: e.target.value,
                  })
                }
              />
            </div>
            <div className="overflow-scroll max-h-[240px]">
              <div>
                <span className="font-bold text-xs text-heading pb-2 px-4">
                  Active
                </span>
                {tenantData?.length
                  ? tenantData
                      ?.filter((val: any) => val.status === "0")
                      ?.map((val: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`flex items-center px-6 py-2 cursor-pointer text-txt-primary font-normal hover:text-primary hover:bg-primary-v10`}
                            onClick={() => {
                              onSelectUser(val?.uuid, val?.tenant_name);
                            }}
                          >
                            <div className="h-2.5 w-2.5 bg-primary-success rounded-full mr-2"></div>
                            <p className={`text-xs `}>{val.tenant_name}</p>
                          </div>
                        );
                      })
                  : null}
              </div>
              <div>
                <span className="font-bold text-xs text-heading pb-2 px-4">
                  Inactive
                </span>
                {tenantData?.length
                  ? tenantData
                      ?.filter((val: any) => val.status === "1")
                      ?.map((val: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`flex items-center px-6 py-2 cursor-pointer text-txt-primary font-normal hover:text-error hover:bg-[#e74c3c69] `}
                            onClick={() => {
                              onSelectUser(val?.uuid, val?.tenant_name);
                            }}
                          >
                            <div className="h-2.5 w-2.5 bg-error rounded-full mr-2"></div>
                            <p className={`text-xs`}>{val.tenant_name}</p>
                          </div>
                        );
                      })
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginToPopup;
