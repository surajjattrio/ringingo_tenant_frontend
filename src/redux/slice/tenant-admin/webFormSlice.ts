import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    allWebForm,
    createWebForm,
    deleteWebForm,
    webForm,
    searchWebForm,
    singleWebForm,
    updateWebForm,
   // updateTenantDispositionStatus,
} from "@/redux/services/tenant-admin/webFormService";

interface InitialState {
    isLoading: boolean;
    webFormData: any;
    allWebFormData: any;
    getSingleWebForm: any;
    singleWebFormData: any;
   webFormOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    webFormData: [],
    allWebFormData: [],
    getSingleWebForm: {},
    singleWebFormData: {},
webFormOptions: [],
};

export const webFormGet = createAsyncThunk(
    "webForm/get",
    async (params: any) => {
        return await webForm(params);
    }
);

export const webFormSingleGet = createAsyncThunk(
    "webForm/single-get",
    async (id: string) => {
        return await singleWebForm(id);
    }
);

export const webFormSearch = createAsyncThunk(
    "webForm/search",
    async (payload: any) => {
        return await searchWebForm(payload);
    }
);

export const webFormCreate = createAsyncThunk(
    "webForm/create",
    async (payload: any) => {
        return await createWebForm(payload);
    }
);

export const webFormUpdate = createAsyncThunk(
    "webForm/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateWebForm(id, rest);
    }
);

// export const tenantDispositionStatusUpdate = createAsyncThunk(
//     "tenant-lead-status/update",
//     async (payload: any) => {
//         const { id, ...rest } = payload;
//         return await updateTenantDispositionStatus(id, rest);
//     }
// );

export const webFormDelete = createAsyncThunk(
    "webForm/delete",
    async (id: string) => {
        return await deleteWebForm(id);
    }
);

export const webFormOptionsGet = createAsyncThunk(
    "webForm-options/getAll",
    async () => {
        return await allWebForm();
    }
);

const webFormSlice = createSlice({
    name: "webForm",
    initialState,
    reducers: {
        updateSingleWebFormData: (state, action) => {
            state.singleWebFormData = action.payload ? action.payload : {};
        },
        clearWebForm: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(webFormGet.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(
                webFormGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                        uuid: val.uuid,
                        name: val?.name,
                    }));
                    state.webFormData = { data: newData, count };
                    state.isLoading = false;
                    console.log("DDDD",state.webFormData);
                }
            )

            .addCase(
                webFormGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder
            .addCase(
                webFormSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )

            .addCase(
                webFormSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                        uuid: val.disposition_uuid,
                        disabled: val?.created_flag === "0",
                        // name: val?.created_flag === "0" ? val?.name + " (admin)" : val?.name,
                        name: val?.name,
                    }));
                    state.webFormData = { data: newData, count };
                    state.isLoading = false;
                }
            )

            .addCase(
                webFormSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );
        

            builder.addCase(
                webFormOptionsGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    state.webFormOptions = data?.map((val: any) => ({
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

export default webFormSlice.reducer;

export const { updateSingleWebFormData, clearWebForm } =
webFormSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.webForm.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectWebFormData = (state: RootState) =>
    state.webForm.webFormData;
export const useWebFormData = () => {
    const webFormData = useAppSelector(selectWebFormData);
    return useMemo(() => webFormData, [webFormData]);
};

export const selectSingleWebForm = (state: RootState) =>
    state.webForm.singleWebFormData;
export const useSingleWebForm = () => {
    const webFormData = useAppSelector(selectSingleWebForm);
    return useMemo(() => webFormData, [webFormData]);
};


export const selectWebFormOptions = (state: RootState) =>
    state.webForm.webFormOptions;
export const useWebFormOptions = () => {
    const options = useAppSelector(selectWebFormOptions);
    return useMemo(() => options, [options]);
};
