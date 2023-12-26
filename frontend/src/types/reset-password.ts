export interface ResetPasswordData {
    token: string | null;
    password: string;
    confirmPassword: string;
}

export interface PasswordChangeStatus {
    status: string;
}