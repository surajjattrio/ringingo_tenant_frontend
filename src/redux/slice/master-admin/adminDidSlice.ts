import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { timeoutOptions2 } from "@/config/options";
import {
    adminDid,
    allAdminDid,
    createAdminDid,
    deleteAdminDid,
    importAdminDid,
    searchAdminDid,
    updateAdminDid,
    updateAdminDidStatus,
} from "@/redux/services/master-admin/adminDidSevices";

interface InitialState {
    adminDidData: any;
    singleAdminDidData: any;
    allAdminDidData: any;
    adminDidAllData: any;
}

const initialState: InitialState = {
    adminDidData: {},
    singleAdminDidData: {},
    allAdminDidData: [],
    adminDidAllData: [],
};

export const adminDidGet = createAsyncThunk(
    "adminDid/get",
    async (params: any) => {
        return await adminDid(params);
    }
);

export const adminDidGetAll = createAsyncThunk("adminDidall/get", async () => {
    const params = { list: "all" };
    return await allAdminDid(params);
});

export const adminDidAllGet = createAsyncThunk(
    "adminDid-all/get",
    async (params: any) => {
        return await adminDid(params);
    }
);

export const adminDidSearch = createAsyncThunk(
    "adminDid/search",
    async (params: any) => {
        return await searchAdminDid(params);
    }
);

export const adminDidAllSearch = createAsyncThunk(
    "adminDid-all/search",
    async (params: any) => {
        return await searchAdminDid(params);
    }
);

export const adminDidCreate = createAsyncThunk(
    "adminDid/create",
    async (payload: any) => {
        return await createAdminDid(payload);
    }
);

export const adminDidUpdate = createAsyncThunk(
    "adminDid/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateAdminDid(id, rest);
    }
);

export const adminDidStatusUpdate = createAsyncThunk(
    "adminDid-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateAdminDidStatus(id, rest);
    }
);

export const adminDidDelete = createAsyncThunk(
    "adminDid/delete",
    async (id: string) => {
        return await deleteAdminDid(id);
    }
);

export const adminDidImport = createAsyncThunk(
    "adminDid/import",
    async (payload: any) => {
        return await importAdminDid(payload);
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
            timeout_value: timeout?.label,
            tenant_name: val?.tenant?.[0]?.tenant_name || "",
            status_name: val?.status === "0" ? "Enabled" : "Disabled",
        };
    });
    return { data: newData, count };
};

const adminDidSlice = createSlice({
    name: "adminDid",
    initialState,
    reducers: {
        updateSingleAdminDidData: (state, action) => {
            state.singleAdminDidData = action.payload ? action.payload : {};
        },
        clearAdminDid: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            adminDidGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.adminDidData = prepareData(action.payload);
            }
        );
        builder.addCase(
            adminDidSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.adminDidData = prepareData(action.payload);
            }
        );
        builder.addCase(
            adminDidGetAll.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allAdminDidData = action.payload;
            }
        );
        builder.addCase(
            adminDidAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.adminDidAllData = prepareData(action.payload);
            }
        );
        builder.addCase(
            adminDidAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allAdminDidData = prepareData(action.payload);
            }
        );
    },
});

export default adminDidSlice.reducer;
export const { updateSingleAdminDidData, clearAdminDid } =
    adminDidSlice.actions;

export const selectDid = (state: RootState) => state.adminDid.adminDidData;
export const useAdminDid = () => {
    const adminDidData = useAppSelector(selectDid);
    return useMemo(() => adminDidData, [adminDidData]);
};

export const selectAllAdminDid = (state: RootState) =>
    state.adminDid.allAdminDidData;
export const useAllAdminDid = () => {
    const allAdminDidData = useAppSelector(selectAllAdminDid);
    return useMemo(() => allAdminDidData, [allAdminDidData]);
};

export const selectAdminDidAll = (state: RootState) =>
    state.adminDid.adminDidAllData;
export const useAdminDidAll = () => {
    const adminDidAllData = useAppSelector(selectAdminDidAll);
    return useMemo(() => adminDidAllData, [adminDidAllData]);
};

export const selectSingleDid = (state: RootState) =>
    state.adminDid.singleAdminDidData;
export const useSingleAdminDid = () => {
    const singleAdminDidData = useAppSelector(selectSingleDid);
    return useMemo(() => singleAdminDidData, [singleAdminDidData]);
};
