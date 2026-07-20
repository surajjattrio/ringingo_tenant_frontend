export interface InitialValueType {
    name: string;
    webhook_url: string;
    webhook_type: string;
    method: string;
    headers: Record<string, string>;
    timeout: number;
    max_retries: number;
    retry_delay: number;
    is_active: boolean;
    bearer_token: string;
}
