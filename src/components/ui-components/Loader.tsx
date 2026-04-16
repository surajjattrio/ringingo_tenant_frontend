/* ============================== LOADER ============================== */

interface LoaderProps {
    className?: string;
    background?: string;
    height?: number | string;
    width?: number | string;
}

const Loader = (props: LoaderProps) => {
    const { className = '', background = "white", height, width } = props;
    return (
        <div
            style={{ backgroundColor: background, height: height,width:width }}
            className={`${className} flex ${!height ? "h-full" : ""} ${!width ? "w-full" : ""
                } z-10 items-center justify-center`}
        >
            <div
                className="flex justify-center self-center h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-primary align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
            >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
        </div>
    );
};

export default Loader;
