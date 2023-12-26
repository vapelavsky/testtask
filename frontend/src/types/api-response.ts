export interface ApiResponse {
    result: "error" | "success";
    error?: string;
    data?: any;
}