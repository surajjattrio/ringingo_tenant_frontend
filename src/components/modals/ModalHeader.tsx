// PROJECT IMPORTS

import { Button } from "../forms";
import { Icon } from "../ui-components";

// TYPES
interface ModalHeaderProps {
    title?: string;
    content?: string;
    doneText?: string;
    cancelText?: string;
    children?: React.ReactNode;
    visible: boolean;
    onCancelClick?: any;
    onDoneClick?: any;
    isShowClose?: boolean; 
    isShowDone?: boolean; 
    isLoading?: boolean;
    form?: string;
    type?: "submit" | "button" | "reset" | undefined;
}

/* ============================== DELETE MODEL ============================== */

const ModalHeader = (props: ModalHeaderProps) => {
    const {
        title,
        content,
        doneText = "Done",
        cancelText = "Cancel",
        children,
        visible = false,
        onCancelClick,
        onDoneClick,
        isShowClose = true,
        isShowDone = true,
        form,
        type = "button",
        isLoading = false,
    } = props;

    return (
        <>
            <div
                id="popup-modal"
                tabIndex={-1}
                className={`fixed top-0 left-0 right-0 z-[60] px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-black bg-opacity-40 ${!visible && "hidden"
                    }`}
                onClick={onCancelClick}
            >
                <div className="w-full h-full relative flex justify-center">
                    <div className="absolute max-w-[650px] top-[80px] w-full max-h-full">
                        <div
                            className="bg-white rounded-lg shadow"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            <div className="flex items-start drop-shadow bg-white rounded-t-lg">
                                <div className="px-4 py-2 w-full flex justify-between">
                                    <p className="font-bold text-sm">{title}</p>
                                    <Icon className="cursor-pointer" name="CloseCircle" height={16} width={16} alt="close" onClick={onCancelClick}/>
                                </div>
                            </div>
                            <div className="w-full p-4">
                                {children ? (
                                    children
                                ) : (
                                    <p className="mb-10 text-lg font-normal text-txt-primary">
                                        {content}
                                    </p>
                                )}
                            </div>
                            <div className="py-3 w-full flex items-center justify-end border-t-2 border-dark-700 px-5 shadow-box">
                                <div className="flex gap-4">
                                    {isShowClose ? (
                                        <Button
                                            className="py-1.5 px-4"
                                            text={cancelText}
                                            style="dark-outline"
                                            onClick={onCancelClick}
                                        />
                                    ) : null}
                                    {isShowDone ? (
                                        <Button
                                            type={type}
                                            form={form}
                                            loading={isLoading}
                                            className="py-2 px-4"
                                            text={doneText}
                                            style="primary"
                                            onClick={onDoneClick}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalHeader;
