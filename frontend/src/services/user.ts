import { get, put } from "shared/api";
import { appConfig } from "config";
import { User } from "types";

export function userGet(
    onSuccess?: (user: User) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return get<User>(
        `${appConfig.apiUrl}user`,
        appConfig.apiTimeoutSeconds,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}

export function userUpdate(
    user: User,
    onSuccess?: (user: User) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return put<User>(
        `${appConfig.apiUrl}user`,
        appConfig.apiTimeoutSeconds,
        user,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}
