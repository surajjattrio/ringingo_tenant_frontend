"use client";
import React, { useState } from "react";

// TYPES

interface LabelSwitchProps {
    checked?: boolean;
    onChange?: any;
    trueName?: string;
    falseName?: string;
}

/* ============================== LABEL SWITCH ============================== */

const LabelSwitch = (props: LabelSwitchProps) => {
    const {
        checked,
        onChange,
        trueName = "Enable",
        falseName = "Disable",
    } = props;

    return (
        <div className="relative flex flex-col items-center justify-center overflow-visible">
            <label className="inline-flex relative items-center justify-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={onChange}
                />
                <div className="items-center w-[90px] h-[32px] bg-dark-800 rounded-full peer peer-focus:ring-primary peer-checked:after:bg-primary-v10  peer-checked:after:translate-x-[58px] peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-dark-600 after:border-dark-800 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                {checked ? (
                    <span className="absolute text-white font-normal text-xs left-3">
                        {trueName}
                    </span>
                ) : (
                    <span className="absolute text-txt-primary font-normal text-xs right-2">
                        {falseName}
                    </span>
                )}
            </label>
        </div>
    );
};

export default LabelSwitch;
