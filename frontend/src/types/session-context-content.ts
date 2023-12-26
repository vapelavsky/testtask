import { SessionData } from "./session-data";

export interface SessionContextContent {
    sessionData: SessionData | null;
    updateSessionData: (sessionData: SessionData | null) => void;
    initComplete: boolean;
}
