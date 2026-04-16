// PROJECT IMPORTS
import { ModalHeader } from "@/components/modals";

// TYPES
interface LeadDistributionModalProps {
    data?: any;
    onHide?: any;
}

const LeadDistributionModal = (props: LeadDistributionModalProps) => {
    const { data, onHide } = props;

    return (
        <>
            <ModalHeader
                visible={!!data}
                title="Lead Distribution"
                onDoneClick={onHide}
                doneText="Finish"
                isShowClose={false}
            >
                <>
                    <div className="grid grid-cols-10 items-center">
                        <label className="text-heading font-bold text-xs col-span-3">
                            Upload Lead Count
                        </label>
                        <label className="text-heading font-bold text-xs">
                            :
                        </label>
                        <label className="text-heading text-xs col-span-6">
                            {data?.totalCount}
                        </label>
                    </div>
                    <div className="grid grid-cols-10 items-center">
                        <label className="text-heading font-bold text-xs col-span-3">
                            Total User Selected
                        </label>
                        <label className="text-heading font-bold text-xs">
                            :
                        </label>
                        <label className="text-heading text-xs col-span-6">
                            {data?.totalUserSelected}
                        </label>
                    </div>
                    <div className="grid grid-cols-10 items-center">
                        <label className="text-heading font-bold text-xs col-span-3">
                            Lead Distributed
                        </label>
                        <label className="text-heading font-bold text-xs">
                            :
                        </label>
                        <div className="col-span-6">
                            {Object.entries(data?.leadDistribution || {})?.map(
                                ([key, val]: any, index: number) => {
                                    return (
                                        <div
                                            className="grid grid-cols-7 pb-1 items-center"
                                            key={index}
                                        >
                                            <label className="text-heading text-xs col-span-3">
                                                {key}
                                            </label>
                                            <label className="text-heading text-xs">:</label>
                                            <label className="text-heading text-xs col-span-3">
                                                {val}
                                            </label>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </>
            </ModalHeader>
        </>
    );
};

export default LeadDistributionModal;
