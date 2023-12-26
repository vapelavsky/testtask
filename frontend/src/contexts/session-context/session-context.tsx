import { createContext } from "react";
import { SessionContextContent } from "types";

export const SessionContext = createContext<SessionContextContent>(null!);
