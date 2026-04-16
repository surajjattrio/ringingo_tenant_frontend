import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createIvr,
    deleteIvr,
    ivr,
    searchIvr,
    updateIvr,
    updateIvrStatus,
    allIvr,
} from "@/redux/services/tenant-admin/ivrServices";

// TYPES IMPORT
import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";
import { timeoutOptions2 } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    ivrData: any;
    singleIvrData: any;
    ivrOptions: OptionTypes[];
    allowedIvrOptions: ObjectOptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    ivrData: {},
    singleIvrData: {},
    ivrOptions: [],
    allowedIvrOptions: [],
};

export const ivrGet = createAsyncThunk("ivr/get", async (params: any) => {
    return await ivr(params);
});

export const ivrSearch = createAsyncThunk("ivr/search", async (params: any) => {
    return await searchIvr(params);
});

export const ivrCreate = createAsyncThunk(
    "ivr/create",
    async (payload: any) => {
        return await createIvr(payload);
    }
);

export const ivrUpdate = createAsyncThunk(
    "ivr/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateIvr(id, rest);
    }
);

export const ivrStatusUpdate = createAsyncThunk(
    "ivr-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateIvrStatus(id, rest);
    }
);
export const ivrDelete = createAsyncThunk("ivr/delete", async (id: string) => {
    return await deleteIvr(id);
});

export const ivrOptionsGet = createAsyncThunk("ivr-options/get", async () => {
    return await allIvr();
});

export const allowedIvrOptionsGet = createAsyncThunk(
    "allowed-ivr-options/get",
    async () => {
        return await allIvr();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        const timeout = timeoutOptions2?.find(
            (option: any) => option?.value === val?.timeout
        );

        return {
            ...val,
            timeout_value: timeout?.label || "",
        };
    });

    return { data: newData, count };
};

const ivrSlice = createSlice({
    name: "ivr",
    initialState,
    reducers: {
        updateSingleIvrData: (state, action) => {
            state.singleIvrData = action.payload ? action.payload : {};
        },
        clearIvr: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(ivrGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ivrGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.ivrData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(ivrGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(ivrSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(ivrSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.ivrData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(ivrSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            ivrOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.ivrOptions =
                    data?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    })) || [];
            }
        );

        builder.addCase(
            allowedIvrOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.allowedIvrOptions =
                    data?.map((val: any) => ({
                        value: {
                            name: val?.name,
                            uuid: val?.uuid,
                        },
                        label: val?.name,
                    })) || [];
            }
        );
    },
});

export default ivrSlice.reducer;
export const { updateSingleIvrData, clearIvr } = ivrSlice.actions;

export const selectIsLoading = (state: RootState) => state.ivr.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectIvr = (state: RootState) => state.ivr.ivrData;
export const useIvr = () => {
    const ivr = useAppSelector(selectIvr);
    return useMemo(() => ivr, [ivr]);
};

export const selectSingleIvr = (state: RootState) => state.ivr.singleIvrData;
export const useSingleIvr = () => {
    const ivr = useAppSelector(selectSingleIvr);
    return useMemo(() => ivr, [ivr]);
};

export const selectIvrOptions = (state: RootState) => state.ivr.ivrOptions;
export const useIvrOptions = () => {
    const options = useAppSelector(selectIvrOptions);
    return useMemo(() => options, [options]);
};

export const selectAllowedIvrOptions = (state: RootState) =>
    state.ivr.allowedIvrOptions;
export const useAllowedIvrOptions = () => {
    const allowedIvrOptions = useAppSelector(selectAllowedIvrOptions);
    return useMemo(() => allowedIvrOptions, [allowedIvrOptions]);
};
