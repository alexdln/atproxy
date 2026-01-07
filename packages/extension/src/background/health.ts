import { DEFAULT_PORT } from "../shared/config";

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:${DEFAULT_PORT}/xrpc/`, {
            method: "GET",
            signal: AbortSignal.timeout(2000),
        });
        return response.ok;
    } catch {
        return false;
    }
};
