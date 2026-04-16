export interface FilterTypes {
    page: number;
    limit: number;
    search?: string;
    isAdvance?: boolean;
    doQuery?:boolean;
    callstart?: string;
    callend?: string;
}
