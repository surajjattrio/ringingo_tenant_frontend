export interface InitialValueType {
    name: string;
    code: string;
    status?: string;
    human_answer?: string;
    sale?: string;
    level: number;                // ✅ new field
    parent_disposition: string;   // ✅ new field
    has_children: boolean  // ✅ new field
};
