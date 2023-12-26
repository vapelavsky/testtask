import { post, put } from "shared/api";
import { appConfig } from "config";
import { ForgotPasswordData, ResetPasswordData, TokenData, PasswordChangeStatus } from "types";

export function forgotPassword(
    forgotPassword: ForgotPasswordData,
    onSuccess?: (data: TokenData) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {;
    return post<TokenData>(
        `${appConfig.apiUrl}reset_password`,
        appConfig.apiTimeoutSeconds,
        forgotPassword,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}

export function resetPassword(
    resetPassword: ResetPasswordData,
    onSuccess?: (data: PasswordChangeStatus) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {;
    return put<PasswordChangeStatus>(
        `${appConfig.apiUrl}reset_password`,
        appConfig.apiTimeoutSeconds,
        resetPassword,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}