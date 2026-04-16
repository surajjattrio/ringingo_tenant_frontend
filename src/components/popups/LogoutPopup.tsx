import React from "react";

// PROJECT IMPORT
import { Icon } from "../ui-components";

// TYPES
interface LogoutPopupProps {
  visible: boolean;
  className?: string;
  onLogoutClick?: any;
  onProfileClick?: any;
  onCancelClick?: any;
}

/* ============================== LOGOUT POPUP ============================== */

const LogoutPopup = (props: LogoutPopupProps) => {
  const { visible, className, onLogoutClick, onProfileClick, onCancelClick } =
    props;

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-transparent ${
          !visible && "hidden"
        }`}
        onClick={onCancelClick}
      >
        <div className="w-full h-full relative flex justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${className} w-[230px] bg-white rounded-xl p-4 drop-shadow-xl ${
              !visible && "hidden"
            }`}
          >
            <div
              className="flex cursor-pointer items-center hover:text-primary"
              onClick={onProfileClick}
            >
              <Icon
                className="mr-[18px]"
                name="ProfileCircle"
                alt="profile-Icon"
                width={20}
                height={20}
              />
              <span className="text-xs font-semibold">Profile</span>
            </div>
            <div
              className="flex pt-4 cursor-pointer items-center hover:text-primary"
              onClick={onLogoutClick}
            >
              <Icon
                className="cursor-pointer mr-[18px]"
                name="Exit"
                alt="logout-Icon"
                width={20}
                height={20}
              />
              <span className="text-xs font-semibold">Sign out</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutPopup;
