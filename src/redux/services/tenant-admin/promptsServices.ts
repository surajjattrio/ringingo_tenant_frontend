//PROJECT IMPORT
import { PROMPTS, PROMPTS_DOWNLOAD, PROMPTS_SEARCH } from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== PROMPTS SERVICES ============================== */

export const prompts = (params: any) => {
    return apiInstance.get(PROMPTS, { params });
};

export const allPrompts = () => {
    return apiInstance.get(PROMPTS);
};

export const searchPrompt = (payload: any) => {
    return apiInstance.post(PROMPTS_SEARCH, payload);
};

export const createPrompt = (payload: any) => {
    return apiInstance.post(PROMPTS, payload);
};


export const getPromptById = (id: string) => {
    return apiInstance.get(PROMPTS + `/${id}`);
};


export const updatePrompt = (id: string, payload: FormData) => {
    return apiInstance.put(PROMPTS + `/${id}`, payload);
};

export const updatePromptStatus = (id: string, payload: any) => {
    return apiInstance.patch(PROMPTS + `/${id}`, payload);
};

export const deletePrompt = (id: string) => {
    return apiInstance.delete(PROMPTS + `/${id}`);
};

export const downloadFilePromt = (file: string) => {
    return apiInstance.get(PROMPTS_DOWNLOAD + `/${file}`);
};
