export interface DispositionRow {
    disposition_uuid: string;
    disposition_name: string;
    disposition_code: string;
    queue_count: number;
    lead_count: number;
}

export interface LeadGroup {
    lead_group_uuid: string;
    lead_group_name: string;
    status: string;
    queue_count: number;
    total_leads: number;
    dispositions: DispositionRow[];
}

export interface Campaign {
    campaign_uuid: string;
    campaign_name: string;
    status: string;
    lead_groups: LeadGroup[];
}

export interface ManagerPageTypes {
    managerName?: string;
    name?: string;
}

export interface DispositionTableMeta {
    selected: Set<string>;
    onToggle: (uuid: string) => void;
}

export type CampaignType = "outbound" | "blended";
export type StatusFilter = "all" | "active" | "inactive";

export const COL_SPAN = 7;
