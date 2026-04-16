import React from "react";

interface PopupProps {
    className?: string;
    visible?: boolean;
    children?: React.ReactNode;
    togglePopup?: () => void;
}
const Popup = (props: PopupProps) => {
    const { className = "", children, visible, togglePopup } = props;
    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-transparent ${visible ? "" : "hidden"
                }`}
            onClick={togglePopup}
        >
            <div className="w-full h-full relative flex justify-center">
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`${className} z-10 absolute w-[278px] bg-white rounded-xl pb-6 drop-shadow-xl ${visible ? "" : "hidden"
                        }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
