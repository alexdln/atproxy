import { getConfig } from "../shared/config";

const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
script.onload = script.remove;
document.documentElement.insertBefore(script, document.documentElement.firstChild);

const updateConfig = async () => {
    const config = await getConfig();
    window.postMessage(
        {
            type: "ATPROXY_CONFIG_UPDATE",
            config,
        },
        "*",
    );
};

updateConfig();

chrome.storage.onChanged.addListener(updateConfig);

window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data) {
        return;
    }

    if (event.data.type === "ATPROXY_CONFIG_REQUEST") {
        getConfig().then((config) => {
            window.postMessage(
                {
                    type: "ATPROXY_CONFIG_RESPONSE",
                    messageId: event.data.messageId,
                    config,
                },
                "*",
            );
        });
        return;
    }

    if (event.data.type !== "ATPROXY_PROXY_REQUEST") {
        return;
    }

    chrome.runtime.sendMessage(event.data.data, (response) => {
        if (chrome.runtime.lastError) {
            window.postMessage(
                {
                    type: "ATPROXY_PROXY_RESPONSE",
                    messageId: event.data.messageId,
                    success: false,
                    error: { message: chrome.runtime.lastError.message, code: "RUNTIME_ERROR" },
                },
                "*",
            );
            return;
        }

        window.postMessage(
            {
                type: "ATPROXY_PROXY_RESPONSE",
                messageId: event.data.messageId,
                success: response && response.success,
                response: response && response.response,
                error: response && !response.success ? response.error || { message: "Proxy request failed" } : null,
            },
            "*",
        );
    });
});
