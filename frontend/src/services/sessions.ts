import { post, get } from "shared/api";
import { appConfig } from "config";
import { SessionData, LoginData } from "types";

export function login(
    loginData: LoginData,
    onSuccess?: (sessionData: SessionData) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {;
    return post<SessionData>(
        `${appConfig.apiUrl}login`,
        appConfig.apiTimeoutSeconds,
        loginData,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}

export function logout(
    onSuccess?: () => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return post<string>(
        `${appConfig.apiUrl}logout`,
        appConfig.apiTimeoutSeconds,
        undefined,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}

export function sessionGet(
    onSuccess?: (sessionData: SessionData) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return get<SessionData>(
        `${appConfig.apiUrl}session`,
        appConfig.apiTimeoutSeconds,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}
