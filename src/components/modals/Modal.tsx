// PROJECT IMPORTS
import Button, { ButtonStyles } from "../forms/Button";

// TYPES
interface ModalProps {
    doneClassName?:string;
    cancelClassName?:string;
    doneStyle?:ButtonStyles;
    cancelStyle?:ButtonStyles;
    title?: string;
    content?: string;
    doneText?: string;
    cancelText?: string;
    loading?:boolean;
    children?: React.ReactNode;
    visible: boolean;
    onCancelClick?: any;
    onDoneClick?: any;
}

/* ============================== MODEL ============================== */

const Modal = (props: ModalProps) => {
    const {
        doneClassName = '',
        cancelClassName = '',
        doneStyle = "primary",
        cancelStyle = "dark-outline",
        title,
        content,
        doneText = "Done",
        cancelText = "Cancel",
        loading = false,
        children,
        visible = false,
        onCancelClick,
        onDoneClick,
    } = props;

    return (
        <>
            <div
                id="popup-modal"
                tabIndex={-1}
                className={`fixed top-0 left-0 right-0 z-50 px-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full bg-black bg-opacity-40 ${!visible && "hidden"
                    }`}
                onClick={onCancelClick}
            >
                <div className="w-full h-full relative flex justify-center">
                    <div className="absolute max-w-[650px] top-[calc(50%-88px)] w-full max-h-full">
                        <div
                            className="bg-white rounded-lg shadow"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            <div className="pt-7 flex flex-col items-start">
                                <div className="pl-7">
                                    <p className="font-bold text-sm pb-2">
                                        {title}
                                    </p>
                                    {children ? (
                                        children
                                    ) : (
                                        <p className="mb-10 text-xs font-normal text-txt-primary">
                                            {content}
                                        </p>
                                    )}
                                </div>
                                <div className="py-5 w-full flex items-center justify-end border-t-2 border-dark-700 pr-10">
                                    <div className="flex gap-4">
                                        <Button
                                            className={`${cancelClassName} px-4 py-2`}
                                            text={cancelText}
                                            style={cancelStyle}
                                            onClick={onCancelClick}
                                        />
                                        <Button
                                            loading={loading}
                                            className={`${doneClassName} px-4 py-2`}
                                            text={doneText}
                                            style={doneStyle}
                                            onClick={onDoneClick}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
