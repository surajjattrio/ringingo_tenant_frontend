// TYPES
interface ToggleProps {
    className?: string;
    loading?:boolean;
    disabled?:boolean;
    checked?: boolean;
    onChange?: any;
}

/* ============================== TOGGLE ============================== */

const Toggle = (props: ToggleProps) => {
    const { className,loading = false,disabled = false, checked, onChange } = props;
    
    return (
        <label
            className={`relative inline-flex items-center ${disabled || loading ? '' : 'cursor-pointer'} ${className}`}
        >
            <input
                type="checkbox"
                value=""
                className="sr-only peer"
                disabled={disabled || loading}
                checked={checked}
                onChange={onChange}
            />
            <div className={`w-11 h-6 ${disabled ? 'opacity-70': ''} bg-dark-800 rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:bg-primary-v10 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-600 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
        </label>
    );
};

export default Toggle;
