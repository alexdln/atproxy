import { handleProxyRequest } from "./proxy";
import { checkBackendHealth } from "./health";
import { updateBadge } from "./badge";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PROXY_REQUEST") {
        handleProxyRequest(request.options)
            .then((response) => {
                sendResponse({ success: true, response });
            })
            .catch((error) => {
                sendResponse({ success: false, error });
            });
        return true;
    }

    if (request.type === "CHECK_BACKEND") {
        checkBackendHealth().then((isHealthy) => {
            sendResponse({ isHealthy });
        });
        return true;
    }
});

updateBadge();
setInterval(updateBadge, 5000);
chrome.storage.onChanged.addListener(() => {
    updateBadge();
});
