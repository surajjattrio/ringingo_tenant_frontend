"use client";

// PROJECT IMPORT
import { Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { toast } from "react-toastify";

const CloseButtonSuccess = ({ closeToast }: { closeToast: any }) => (
  <div className="position-absolute top-0 end-0 me-1 mt-1">
  <Icon
    name="CloseWhite"
    width={24}
    height={24}
    alt="iconClose"
    onClick={closeToast}
  />
</div>
);

const CloseButtonError = ({ closeToast }: { closeToast: any }) => (
  <div className="position-absolute top-0 end-0 me-1 mt-1">
    <Icon
      name="CloseWhite"
      width={24}
      height={24}
      alt="iconClose"
      onClick={closeToast}
    />
  </div>
);

/* ============================== TOSTER SERVICES ============================== */

// SUCCESS TOSTER
export const Success = (msg: string) => {
  toast.success(
    <>
      <p className="text-sm font-bold text-white">Success</p>
      <p className="text-white text-xs mb-0">{msg}</p>
    </>,
    {
      className: "toaster-color-primary",
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: false,
      closeButton: CloseButtonSuccess,
      progressStyle: { background: "#ffffff" },
      icon: true,
      autoClose: 3000,
      theme: "colored",
    }
  );
};

// ERROR TOSTER
export const Danger = (msg: string) => {
  toast.error(
    <>
      <p className="text-sm font-bold text-white">Error</p>
      <p className="text-white text-xs mb-0">
        {msg ? msg : "Something Went Wrong!"}
      </p>
    </>,
    {
      className: "toaster-error-shadow",
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: false,
      closeButton: CloseButtonError,
      progressStyle: { background: "#ffffff" },
      icon: true,
      autoClose: 3000,
      theme: "colored",
    }
  );
};
