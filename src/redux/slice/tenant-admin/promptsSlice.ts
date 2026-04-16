import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allPrompts,
    createPrompt,
    deletePrompt,
    downloadFilePromt,
    prompts,
    searchPrompt,
    updatePrompt,
    updatePromptStatus,
    getPromptById
} from "@/redux/services/tenant-admin/promptsServices";
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    promptsData: any;
    singlePromptData: any;
    promptsOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    promptsData: {},
    singlePromptData: {},
    promptsOptions: [],
};

export const promptsGet = createAsyncThunk(
    "prompts/get",
    async (params: any) => {
        return await prompts(params);
    }
);

export const promptsSearch = createAsyncThunk(
    "prompts/search",
    async (params: any) => {
        return await searchPrompt(params);
    }
);

export const promptsCreate = createAsyncThunk(
    "prompts/create",
    async (payload: any) => {
        return await createPrompt(payload);
    }
);


export const promptsGetById = createAsyncThunk(
    "prompts/get-by-id",
    async (id: string) => {
        return await getPromptById(id);
    }
);


export const promptsUpdate = createAsyncThunk(
    "prompts/update",
    async ({ id, data }: { id: string; data: FormData }) => {
        return await updatePrompt(id, data);
    }
);



export const promptsStatusUpdate = createAsyncThunk(
    "prompts-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updatePromptStatus(id, rest);
    }
);
export const promptsDelete = createAsyncThunk(
    "prompts/delete",
    async (id: string) => {
        return await deletePrompt(id);
    }
);

export const promptsOptionsGet = createAsyncThunk(
    "prompts-options/get",
    async () => {
        return await allPrompts();
    }
);

export const promptsDownloadFile = createAsyncThunk(
    "prompts-download/get",
    async (file: string) => {
        return await downloadFilePromt(file);
    }
);

const promptsSlice = createSlice({
    name: "prompts",
    initialState,
    reducers: {
        updateSinglePromptData: (state, action) => {
            state.singlePromptData = action.payload ? action.payload : {};
        },
        clearPrompts: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(promptsGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(promptsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.promptsData = action.payload;
                state.isLoading = false;
            })
            .addCase(promptsGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(promptsSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(promptsSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.promptsData = action.payload;
                state.isLoading = false;
            })
            .addCase(promptsSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });


        builder
            .addCase(promptsGetById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(promptsGetById.fulfilled, (state, action) => {
                state.singlePromptData = action.payload;
                state.isLoading = false;
            })
            .addCase(promptsGetById.rejected, (state) => {
                state.isLoading = false;
            });

        builder.addCase(
            promptsOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.promptsOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                })) || []
            }
        );
    },
});

export default promptsSlice.reducer;
export const { updateSinglePromptData, clearPrompts } = promptsSlice.actions;

export const selectIsLoading = (state: RootState) => state.prompts.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectPropmts = (state: RootState) => state.prompts.promptsData;
export const usePropmts = () => {
    const prompts = useAppSelector(selectPropmts);
    return useMemo(() => prompts, [prompts]);
};


export const selectSinglePrompt = (state: RootState) =>
    state.prompts.singlePromptData;
export const useSinglePropmt = () => {
    const prompt = useAppSelector(selectSinglePrompt);
    return useMemo(() => prompt, [prompt]);
};

export const useSinglePrompt = () => {
    const prompt = useAppSelector((state) => state.prompts.singlePromptData);
    return useMemo(() => prompt, [prompt]);
};


export const selectPromptsOptions = (state: RootState) =>
    state.prompts.promptsOptions;
export const usePromptsOptions = () => {
    const options = useAppSelector(selectPromptsOptions);
    return useMemo(() => options, [options]);
};
