import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    createAreaCode, deleteAreaCode, areaCode, searchAreaCode, singleAreaCode, updateAreaCode, updateAreaCodeStatus, allAreaCode, importAreaCode,
    statusAreaCode,
} from "@/redux/services/tenant-admin/manageAreaCodeService";

interface InitialState {
    isLoading: boolean;
    areaCodeData: any;
    getSingleAreaCode: any;
    singleAreaCodeData: any;
    areaCodeOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    areaCodeData: {},
    getSingleAreaCode: {},
    singleAreaCodeData: {},
    areaCodeOptions: [],
};

export const areaCodeGet = createAsyncThunk("areaCode/get", async (params: any) => {
    return await areaCode(params);

});

export const areaCodeSingleGet = createAsyncThunk("areaCode/single-get", async (id: string) => {
    return await singleAreaCode(id);
});


export const areaCodeSearch = createAsyncThunk("areaCode/search", async (params: any) => {
    return await searchAreaCode(params);
});

export const areaCodeCreate = createAsyncThunk(
    "areaCode/create",
    async (payload: any) => {
        return await createAreaCode(payload);
    }
);

export const areaCodeUpdate = createAsyncThunk(
    "areaCode/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateAreaCode(id, rest);

    }
);

export const areaCodeImport = createAsyncThunk(
    "areaCode/import",
    async (payload: any) => {
        return await importAreaCode(payload);
    }
);

export const areaCodeStatusUpdate = createAsyncThunk(
    "areaCode-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateAreaCodeStatus(id, rest);
    }
);
export const areaCodeDelete = createAsyncThunk("areaCode/delete", async (id: string) => {
    return await deleteAreaCode(id);
});
export const areaCodeStatus = createAsyncThunk("state/update-by-status", async (payload: any) => {
    const { id, ...rest } = payload;
    return await statusAreaCode(id, rest);
});

export const areaCodeOptionsGet = createAsyncThunk("areaCode-options/get", async () => {
    return await allAreaCode();
});

const areaCodeSlice = createSlice({
    name: "areaCode",
    initialState,
    reducers: {
        updateSingleAreaCodeData: (state, action) => {

            state.singleAreaCodeData = action.payload ? action.payload : {};
        },
        clearAreaCode: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(areaCodeGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(areaCodeGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.areaCodeData = action.payload;
                state.isLoading = false;
            })
            .addCase(areaCodeGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(areaCodeSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                areaCodeSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.areaCodeData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(areaCodeSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            areaCodeOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.areaCodeOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default areaCodeSlice.reducer;
export const { updateSingleAreaCodeData, clearAreaCode } =
    areaCodeSlice.actions;

export const selectIsLoading = (state: RootState) => state.areaCode.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectAreaCodeData = (state: RootState) => state.areaCode.areaCodeData;
export const useAreaCode = () => {
    const areaCode = useAppSelector(selectAreaCodeData);
    return useMemo(() => areaCode, [areaCode]);
};

export const selectSingleAreaCode = (state: RootState) =>
    state.areaCode.singleAreaCodeData;
export const useSingleAreaCode = () => {
    const areaCode = useAppSelector(selectSingleAreaCode);
    return useMemo(() => areaCode, [areaCode]);
};

export const selectAreaCodeOptions = (state: RootState) =>
    state.areaCode.areaCodeOptions;
export const useAreaCodeOptions = () => {
    const options = useAppSelector(selectAreaCodeOptions);
    return useMemo(() => options, [options]);
};
