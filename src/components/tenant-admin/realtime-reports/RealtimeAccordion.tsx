import { useState } from "react";

// PROJECT IMPORT
import { Icon } from "@/components/ui-components";

interface RealtimeAccordionProps {
    children: React.ReactNode;
    title: string;
}

const RealtimeAccordion = (props: RealtimeAccordionProps) => {
    const { title, children } = props;
    const [visible, setVisible] = useState<boolean>(true);

    return (
        <div className="drop-shadow-lg mb-4 rounded-md">
            <div
                className={`${visible ? "bg-primary-v10 text-primary rounded-t-md" : "bg-white rounded-md"
                    } font-bold text-sm py-4 px-6 flex justify-between items-center`}
            >
                <span>{title}</span>
                {/* <div>
                    <Icon
                       name={visible ? "MinusCircleGreen" : "PlusCircle"}
                        className="cursor-pointer"
                        width={20}
                       height={20}
                        alt={visible ? "iconMinusCircle" : "iconPluseCircle"}
                       onClick={() => setVisible(!visible)}
                    />
                </div> */}
            </div>

            {visible ? (
                <div className="px-4 py-3 bg-white rounded-b-md">{children}</div>
            ) : null}
        </div>
    );
};

export default RealtimeAccordion;
