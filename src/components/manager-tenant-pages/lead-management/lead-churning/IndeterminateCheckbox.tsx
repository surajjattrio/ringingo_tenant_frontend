"use client";
import { useEffect, useRef } from "react";

interface Props {
    checked: boolean;
    indeterminate: boolean;
    onChange: (e: React.MouseEvent) => void;
    size?: "sm" | "md";
}

export const IndeterminateCheckbox = ({ checked, indeterminate, onChange, size = "md" }: Props) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            readOnly
            onClick={onChange}
            className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer ${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}`}
        />
    );
};
