import { post } from "shared/api";
import { appConfig } from "config";
import { User, SessionData } from "types";

export function signup(
    user: User,
    onSuccess?: (sessionData: SessionData) => void,
    onResponseError?: (apiError: string | undefined) => void,
    onFetchError?: (error: string) => void,
    onAbort?: () => void
): AbortController {
    return post<SessionData>(
        `${appConfig.apiUrl}signup`,
        appConfig.apiTimeoutSeconds,
        user,
        undefined,
        onSuccess,
        onResponseError,
        onFetchError,
        onAbort
    );
}