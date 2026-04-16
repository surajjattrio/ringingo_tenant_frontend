import Icon from "./Icon";

// TYPES
interface TabsProps {
    children?: React.ReactNode;
    data: any;
    active?: string;
    onChange?: any;
}

const Tabs = (props: TabsProps) => {
    const { children, data, active, onChange } = props;
    return (
        <>
            <div>
                <ul className="flex -mb-px text-xs font-medium text-center text-gray-50 overflow-x-scroll scrollbar-hide">
                    {data?.map((val: any, idx: number) => {
                        const isActive = active === val?.id;
                        const width = val?.width || 20;
                        const height = val?.height || 20;
                        return (
                            <div key={idx} className="border-b border-dark-700">
                                <li
                                    className="mr-2 cursor-pointer"
                                    key={idx}
                                    onClick={() => {
                                        onChange(val?.id);
                                    }}
                                >
                                    <span
                                        className={`flex justify-center items-center p-2.5 gap-2 border-b-2 rounded-t-l group ${isActive ? "border-primary" : "border-transparent"
                                            }`}
                                    >
                                        <Icon
                                            name={isActive ? val.activeIcon : val.icon}
                                            width={width}
                                            height={height}
                                        />
                                        <p
                                            className={`text-xs ${isActive
                                                    ? "font-bold text-primary"
                                                    : "font-normal text-txt-primary"
                                                } whitespace-nowrap`}
                                        >
                                            {val?.title}
                                        </p>
                                    </span>
                                </li>
                            </div>
                        );
                    })}
                </ul>
            </div>
            <div className="px-7 py-5">
                {data?.map((val: any) => {
                    const { component: Component } = val;
                    if (val?.id === active && Component) {
                        return (
                            <>
                                <Component />
                            </>
                        );
                    }
                })}
            </div>
        </>
    );
};

export default Tabs;
