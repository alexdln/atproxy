import { DEFAULT_PORT } from "../shared/config";
import { checkBackendHealth } from "./health";

export const updateBadge = async (): Promise<void> => {
    const isHealthy = await checkBackendHealth();

    chrome.action.setBadgeText({
        text: isHealthy ? "●" : "×",
    });

    chrome.action.setBadgeBackgroundColor({
        color: isHealthy ? "#4CAF50" : "#F44336",
    });

    chrome.action.setTitle({
        title: isHealthy
            ? `Atproxy - Connected to localhost:${DEFAULT_PORT}`
            : `Atproxy - Backend not available on localhost:${DEFAULT_PORT}`,
    });
};
