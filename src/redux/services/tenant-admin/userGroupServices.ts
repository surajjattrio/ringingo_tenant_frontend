//PROJECT IMPORT
import { USER_GROUP, USER_GROUP_SEARCH } from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== USER - GROUP SERVICES ============================== */

export const userGroup = (params: any) => {
    return apiInstance.get(USER_GROUP, { params, });
};

export const allUserGroup = () => {
    return apiInstance.get(USER_GROUP,);
};

export const searchUserGroup = (payload: any) => {
    return apiInstance.post(USER_GROUP_SEARCH, payload,);
}

export const createUserGroup = (payload: any) => {
    return apiInstance.post(USER_GROUP, payload,);
};

export const updateUserGroup = (id: string, payload: any) => {
    return apiInstance.put(USER_GROUP + `/${id}`, payload,);
};

export const updateUserGrouptatus = (id: string, payload: any) => {
    return apiInstance.patch(USER_GROUP + `/${id}`, payload,);
};

export const deleteUserGroup = (id: string) => {
    return apiInstance.delete(USER_GROUP + `/${id}`,);
};