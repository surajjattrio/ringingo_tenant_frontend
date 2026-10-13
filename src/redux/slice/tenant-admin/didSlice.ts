import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allDid,
    createDid,
    deleteDid,
    forwardDid,
    did,
    searchDid,
    updateDid,
    updateDidStatus,
    importDid,
} from "@/redux/services/tenant-admin/didSevices";
import { OptionTypes } from "@/types/formTypes";
import { timeoutOptions2 } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    didData: any;
    allDidData: any;
    singleDidData: any;
    didOptions: OptionTypes[];
    cidDidOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    didData: {},
    allDidData: {},
    singleDidData: {},
    didOptions: [],
    cidDidOptions: [],
};

export const didGet = createAsyncThunk("did/get", async (params: any) => {
    return await did(params);
});

export const didAllGet = createAsyncThunk(
    "did-all/get",
    async (params: any) => {
        return await did(params);
    }
);

export const didSearch = createAsyncThunk(
    "did-all/search",
    async (params: any) => {
        return await searchDid(params);
    }
);

export const didAllSearch = createAsyncThunk(
    "did/search",
    async (params: any) => {
        return await searchDid(params);
    }
);

export const didCreate = createAsyncThunk(
    "did/create",
    async (payload: any) => {
        return await createDid(payload);
    }
);

export const didUpdate = createAsyncThunk(
    "did/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateDid(id, rest);
    }
);

export const didStatusUpdate = createAsyncThunk(
    "did-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateDidStatus(id, rest);
    }
);

export const didDelete = createAsyncThunk("did/delete", async (id: string) => {
    return await deleteDid(id);
});

export const didForward = createAsyncThunk(
    "did/forward",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await forwardDid(id, rest);
    }
);

export const didImport = createAsyncThunk(
    "did/import",
    async (payload: any) => {
        return await importDid(payload);
    }
);

export const didOptionsGet = createAsyncThunk("did-options/get", async () => {
    const params = { list: "all" };
    return await allDid(params);
});

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        const timeout = timeoutOptions2?.find(
            (option: any) => option?.value === val?.timeout
        );
        return {
            ...val,
            timeout_value: timeout?.label,
            disabled: val?.flag === "2",
            status_name: val?.status === "0" ? "Enabled" : "Disabled",
        };
    });
    return { data: newData, count };
};

const didSlice = createSlice({
    name: "did",
    initialState,
    reducers: {
        updateSingleDidData: (state, action) => {
            state.singleDidData = action.payload ? action.payload : {};
        },
        clearDid: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(didGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(didGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.didData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(didGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });
        builder
            .addCase(didSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(didSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.didData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(didSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            didAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allDidData = prepareData(action.payload);
            }
        );

        builder.addCase(
            didAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allDidData = prepareData(action.payload);
            }
        );

        builder.addCase(
            didOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.didOptions = data?.map((val: any) => ({
                    value: val?.number,
                    label: val?.number,
                }));
                // Active DIDs enabled as caller id, used for Multi Caller IDs for Manual Calls
                state.cidDidOptions = (data || [])
                    ?.filter((val: any) => val?.did_as_cid === "0" && val?.status === "0")
                    ?.map((val: any) => ({
                        value: val?.number,
                        label: val?.name ? `${val?.name} (${val?.number})` : val?.number,
                    }));
            }
        );
    },
});

export default didSlice.reducer;
export const { updateSingleDidData, clearDid } = didSlice.actions;

export const selectIsLoading = (state: RootState) => state.did.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectDid = (state: RootState) => state.did.didData;
export const useDid = () => {
    const did = useAppSelector(selectDid);
    return useMemo(() => did, [did]);
};

export const selectAllDid = (state: RootState) => state.did.allDidData;
export const useAllDid = () => {
    const allDid = useAppSelector(selectAllDid);
    return useMemo(() => allDid, [allDid]);
};

export const selectSingleDid = (state: RootState) => state.did.singleDidData;
export const useSingleDid = () => {
    const did = useAppSelector(selectSingleDid);
    return useMemo(() => did, [did]);
};

export const selectDidOptions = (state: RootState) => state.did.didOptions;
export const useDidOptions = () => {
    const did = useAppSelector(selectDidOptions);
    return useMemo(() => did, [did]);
};

export const selectCidDidOptions = (state: RootState) => state.did.cidDidOptions;
export const useCidDidOptions = () => {
    const did = useAppSelector(selectCidDidOptions);
    return useMemo(() => did, [did]);
};
