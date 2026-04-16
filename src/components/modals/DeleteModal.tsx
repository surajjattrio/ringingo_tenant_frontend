// PROJECT IMPORTS
import Modal from "./Modal";
import { Icon } from "../ui-components";
import { CheckBox } from "../forms";
import { useState } from "react";
import Image from "next/image";

// TYPES
interface DeleteProps {
  visible: boolean;
  loading?: boolean;
  onCancelClick?: any;
  onDoneClick?: any;
}

/* ============================== DELETE MODEL ============================== */

const DeleteModal = (props: DeleteProps) => {
  const {
    visible = false,
    loading = false,
    onCancelClick,
    onDoneClick,
  } = props;

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDoneClick = () => {
    onDoneClick?.(dontShowAgain);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        visible ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" onClick={onCancelClick} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-[500px] mx-4">
        {/* Close Button */}
        <button
          onClick={onCancelClick}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <Icon name="Close" width={16} height={16} />
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <Image
              src="/assets/icons/red/delete.svg"
              alt="Delete Warning"
              width={150}
              height={100}
            />
          </div>

          {/* Title */}
          <h2 className="text-lg font-medium text-center mb-2">Delete Entries</h2>

          {/* Message */}
          <p className="text-center text-gray-600 text-sm mb-6">
            Are you sure you want to delete selected entries ?
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mb-4">
            {/* <button
              onClick={onCancelClick}
              disabled={loading}
              className="px-6 py-1.5 bg-[#4f46e5] text-white text-sm rounded-full font-medium hover:bg-[#4338ca] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Icon name="Download" width={16} height={16} className="text-white" />
              Save
            </button> */}
            <button
              onClick={handleDoneClick}
              disabled={loading}
              className="px-6 py-1.5 bg-error-delete text-error-darkdelete text-sm rounded-full font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2 border border-error-border"
            >
              <Icon name="DeleteRed" width={16} height={16} className=" text-error-darkdelete " />
              Delete
            </button>
          </div>

          {/* Don't show again */}
          {/* <div className="flex justify-center">
            <CheckBox
              label="Don't show again"
              checked={dontShowAgain}
              onChange={(checked: boolean) => setDontShowAgain(checked)}
              className="text-xs text-gray-500"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
