import React, { useEffect, useState, useRef } from "react";
import { sessionGet } from "services";
import { SessionData, SessionContextContent } from "types";
import { SessionContext } from "contexts";

export const SessionProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [initComplete, setInitComplete] = useState<boolean>(false);
    const sessionGetAC = useRef<AbortController | null>(null);

    useEffect(() => {
        const onSuccess = (sessionData: SessionData): void => {
            setInitComplete(true);
            sessionGetAC.current = null;
            setSessionData(sessionData);
        };

        const onError = (error: string | undefined): void => {
            sessionGetAC.current = null;
            setInitComplete(true);
        };

        sessionGet(onSuccess, onError, onError);
    }, []);

    const updateSessionData = (sessionData: SessionData | null): void => {
        if (sessionGetAC.current) {
            sessionGetAC.current.abort();
            sessionGetAC.current = null;
        }
        setSessionData(sessionData);
    };

    const value: SessionContextContent = {
        sessionData,
        updateSessionData,
        initComplete,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};
