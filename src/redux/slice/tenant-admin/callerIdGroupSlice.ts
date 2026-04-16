import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    addCallerId,
    allCallerIdGroup,
    callerIdGroup,
    createCallerIdGroup,
    deleteCallerId,
    deleteCallerIdGroup,
    importCallerId,
    searchCallerIdGroup,
    singleCallerIdGroup,
    updateCallerIdGroup,
    updateCallerIdGroupStatus,
} from "@/redux/services/tenant-admin/callerIdGroupServices";

interface InitialState {
    isLoading: boolean;
    callerIdGroupData: any;
    allCallerIdGroupData: any;
    singleCallerIdGroupData: any;
    callerIdGroupOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    callerIdGroupData: {},
    allCallerIdGroupData: {},
    singleCallerIdGroupData: {},
    callerIdGroupOptions: [],
};

export const callerIdGroupGet = createAsyncThunk(
    "callerIdGroup/get",
    async (params: any) => {
        return await callerIdGroup(params);
    }
);

export const callerIdGroupSearch = createAsyncThunk(
    "callerIdGroup/search",
    async (params: any) => {
        return await searchCallerIdGroup(params);
    }
);

export const callerIdGroupAllGet = createAsyncThunk(
    "callerIdGroup-all/get",
    async (params: any) => {
        return await callerIdGroup(params);
    }
);

export const callerIdGroupAllSearch = createAsyncThunk(
    "callerIdGroup-all/search",
    async (params: any) => {
        return await searchCallerIdGroup(params);
    }
);

export const callerIdSingleGet = createAsyncThunk(
    "callerIdGroup/single-get",
    async (params: any) => {
        const { id, ...rest } = params;
        return await singleCallerIdGroup(id, rest);
    }
);

export const callerIdGroupCreate = createAsyncThunk(
    "callerIdGroup/create",
    async (payload: any) => {
        return await createCallerIdGroup(payload);
    }
);

export const callerIdAdd = createAsyncThunk(
    "callerId/add",
    async (payload: any) => {
        return await addCallerId(payload);
    }
);

export const callerIdImport = createAsyncThunk(
    "callerId/import",
    async (payload: any) => {
        return await importCallerId(payload);
    }
);

export const callerIdGroupUpdate = createAsyncThunk(
    "callerIdGroup/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateCallerIdGroup(id, rest);
    }
);

export const callerIdGroupStatusUpdate = createAsyncThunk(
    "callerIdGroup-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateCallerIdGroupStatus(id, rest);
    }
);

export const callerIdGroupDelete = createAsyncThunk(
    "callerIdGroup/delete",
    async (id: string) => {
        return await deleteCallerIdGroup(id);
    }
);

export const callerIdDelete = createAsyncThunk(
    "callerId/delete",
    async (params: any) => {
        const { uuid, id } = params;
        return await deleteCallerId(uuid, id);
    }
);

export const callerIdGroupOptionsGet = createAsyncThunk(
    "callerIdGroup-options/get",
    async () => {
        return await allCallerIdGroup({ list: "all" });
    }
);

const callerIdGroupSlice = createSlice({
    name: "callerIdGroup",
    initialState,
    reducers: {
        updateSingleCallerIdGroupData: (state, action) => {
            state.singleCallerIdGroupData = action.payload ? action.payload : {};
        },
        clearCallerIdGroup: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(callerIdGroupGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                callerIdGroupGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.callerIdGroupData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(callerIdGroupGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(
                callerIdGroupSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                callerIdGroupSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.callerIdGroupData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                callerIdGroupSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            callerIdGroupAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCallerIdGroupData = action.payload;
            }
        );

        builder.addCase(
            callerIdGroupAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCallerIdGroupData = action.payload;
            }
        );

        builder.addCase(
            callerIdGroupOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.callerIdGroupOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.caller_id_group,
                }));
            }
        );
    },
});

export default callerIdGroupSlice.reducer;
export const { updateSingleCallerIdGroupData, clearCallerIdGroup } =
    callerIdGroupSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.callerIdGroup.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectCallerIdGroup = (state: RootState) =>
    state.callerIdGroup.callerIdGroupData;
export const useCallerIdGroup = () => {
    const callerIdGroup = useAppSelector(selectCallerIdGroup);
    return useMemo(() => callerIdGroup, [callerIdGroup]);
};

export const selectAllCallerIdGroup = (state: RootState) =>
    state.callerIdGroup.allCallerIdGroupData;
export const useAllCallerIdGroup = () => {
    const allCallerIdGroup = useAppSelector(selectAllCallerIdGroup);
    return useMemo(() => allCallerIdGroup, [allCallerIdGroup]);
};

export const selectSingleCallerIdGroup = (state: RootState) =>
    state.callerIdGroup.singleCallerIdGroupData;
export const useSingleCallerIdGroup = () => {
    const callerIdGroup = useAppSelector(selectSingleCallerIdGroup);
    return useMemo(() => callerIdGroup, [callerIdGroup]);
};

export const selectCallerIdGroupOptions = (state: RootState) =>
    state.callerIdGroup.callerIdGroupOptions;
export const useCallerIdGroupOptions = () => {
    const options = useAppSelector(selectCallerIdGroupOptions);
    return useMemo(() => options, [options]);
};
