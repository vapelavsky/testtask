import { ApiResponse } from "types";

export function get<T>(
    url: string,
    timeout: number,
    additionalHeaders: any = undefined,
    onSuccess?: (data: T) => void,
    onErrorResponse?: (apiError: string | undefined) => void,
    onFetchError?: (errorMessage: string) => void,
    onAbort?: () => void
): AbortController {
    return apiCall(
        url,
        "GET",
        timeout,
        additionalHeaders,
        onSuccess,
        onErrorResponse,
        onFetchError,
        onAbort
    );
}

export function post<T>(
    url: string,
    timeout: number,
    data: string | object | undefined = undefined,
    additionalHeaders: any = undefined,
    onSuccess?: (data: T) => void,
    onErrorResponse?: (apiError: string | undefined) => void,
    onFetchError?: (errorMessage: string) => void,
    onAbort?: () => void
): AbortController {
    return apiCall(
        url,
        "POST",
        timeout,
        additionalHeaders,
        onSuccess,
        onErrorResponse,
        onFetchError,
        onAbort,
        data
    );
}

export function put<T>(
    url: string,
    timeout: number,
    data: string | object | undefined = undefined,
    additionalHeaders: any = undefined,
    onSuccess?: (data: T) => void,
    onErrorResponse?: (apiError: string | undefined) => void,
    onFetchError?: (errorMessage: string) => void,
    onAbort?: () => void
): AbortController {
    return apiCall(
        url,
        "PUT",
        timeout,
        additionalHeaders,
        onSuccess,
        onErrorResponse,
        onFetchError,
        onAbort,
        data
    );
}

export function del<T>(
    url: string,
    timeout: number,
    additionalHeaders: any = undefined,
    onSuccess?: (data: T) => void,
    onErrorResponse?: (apiError: string | undefined) => void,
    onFetchError?: (errorMessage: string) => void,
    onAbort?: () => void
): AbortController {
    return apiCall(
        url,
        "DELETE",
        timeout,
        additionalHeaders,
        onSuccess,
        onErrorResponse,
        onFetchError,
        onAbort
    );
}

export function apiCall<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    timeout: number,
    additionalHeaders: any = undefined,
    onSuccess?: (data: T) => void,
    onErrorResponse?: (apiError: string | undefined) => void,
    onFetchError?: (errorMessage: string) => void,
    onAbort?: () => void,
    data?: string | object
): AbortController {
    const headers: any = {};

    if (data) {
        headers["Content-Type"] = "application/json";
    }

    if (additionalHeaders) {
        for (let property in additionalHeaders) {
            if (
                Object.prototype.hasOwnProperty.call(
                    additionalHeaders,
                    property
                )
            ) {
                headers[property] = additionalHeaders[property];
            }
        }
    }
    const controller = new AbortController();

    const init: RequestInit = {
        credentials: "include",
        method: method,
        mode: "cors",
        cache: "no-cache",
        headers: headers,
        signal: controller.signal,
    };

    if (data) {
        if (typeof data === "string") {
            init["body"] = data;
        } else {
            init["body"] = JSON.stringify(data);
        }
    }
    let timedOut: boolean = false;
    new Promise<Response>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            timedOut = true;
            controller.abort();
            reject(new Error("Request timed out"));
        }, timeout * 1000);

        fetch(url, init)
            .then((response: Response) => {
                clearTimeout(timeoutId);
                if (!timedOut) {
                    resolve(response);
                }
            })
            .catch((error) => {
                if (!timedOut) {
                    reject(error);
                }
            });
    })
        .then((response: Response) => {
            return response.json();
        })
        .then((response: ApiResponse) => {
            if (!response || !response.hasOwnProperty("result")) {
                if (onErrorResponse) {
                    onErrorResponse("Server returned an unexpected response.");
                }
            } else {
                switch (response.result) {
                    case "success": {
                        if (onSuccess && response.hasOwnProperty("data")) {
                            onSuccess(response.data);
                        } else if (onErrorResponse) {
                            onErrorResponse("Server returned a success result with no data.");
                        }
                        break;
                    }
                    case "error": {
                        if (onErrorResponse) {
                            if (response.hasOwnProperty("error")) {
                                onErrorResponse(response.error);
                            } else {
                                onErrorResponse("Server returned an error with no details.");
                            }
                        }
                        break;
                    }
                    default: {
                        if (onErrorResponse) {
                            onErrorResponse("Server returned an unknown result.");
                        }
                        break;
                    }
                }
            }
        })
        .catch((error) => {
            if (onFetchError && error.name !== "AbortError") {
                onFetchError(
                    error.message === "Failed to fetch"
                        ? "Could not access server at this time"
                        : error.message
                );
            }

            if (onAbort && error.name === "AbortError") {
                onAbort();
            }
        });

    return controller;
}
