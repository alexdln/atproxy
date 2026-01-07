import { DEFAULT_PORT, ExtensionConfig, getConfig, saveConfig } from "../shared/config";

export const loadConfig = async (): Promise<void> => {
    const config = await getConfig();
    document.querySelector<HTMLInputElement>("#rule")!.value = config.rule;
    document.querySelector<HTMLInputElement>("#enable")!.checked = config.enabled;
    checkBackendStatus();
};

export const checkBackendStatus = async (): Promise<void> => {
    const statusDiv = document.querySelector<HTMLDivElement>("#status");
    const statusText = document.querySelector<HTMLSpanElement>("#statusText");
    if (!statusDiv || !statusText) return;

    try {
        const response = await chrome.runtime.sendMessage({ type: "CHECK_BACKEND" });
        if (response && response.isHealthy) {
            statusDiv.className = "status connected";
            statusText.textContent = `Connected to localhost:${DEFAULT_PORT}`;
        } else {
            statusDiv.className = "status disconnected";
            statusText.textContent = `Backend not available on localhost:${DEFAULT_PORT}`;
        }
    } catch {
        statusDiv.className = "status disconnected";
        statusText.textContent = "Error checking connection";
    }
};

let timeout: number | null = null;

export const saveConfigHandler = async (newConfig: Partial<ExtensionConfig>, message: string): Promise<void> => {
    const messageDiv = document.querySelector<HTMLDivElement>("#message");

    try {
        const config = await getConfig();
        await saveConfig({
            ...config,
            ...newConfig,
        });

        messageDiv!.className = "success";
        messageDiv!.textContent = message;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            checkBackendStatus();
            messageDiv!.textContent = "";
        }, 1000);
    } catch {
        messageDiv!.className = "error";
        messageDiv!.textContent = "Failed to save settings";
    }
};
