import { SerializedRequest, serializeRequest } from "../shared/request";

let config = { enabled: false, rule: "" };
let configLoaded = false;

window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data || event.data.type !== "ATPROXY_CONFIG_UPDATE") {
        return;
    }
    config = event.data.config;
});

const loadConfig = (): Promise<void> => {
    return new Promise((resolve) => {
        const messageId = Math.random().toString(36).substring(2, 15);
        const messageHandler = (event: MessageEvent) => {
            if (event.source !== window || !event.data || event.data.type !== "ATPROXY_CONFIG_RESPONSE") {
                return;
            }
            if (event.data.messageId === messageId) {
                window.removeEventListener("message", messageHandler);
                config = event.data.config;
                configLoaded = true;
                resolve();
            }
        };
        window.addEventListener("message", messageHandler);
        window.postMessage(
            {
                type: "ATPROXY_CONFIG_REQUEST",
                messageId: messageId,
            },
            "*",
        );
        setTimeout(() => {
            window.removeEventListener("message", messageHandler);
            if (!configLoaded) {
                config = { enabled: false, rule: "" };
                configLoaded = true;
                resolve();
            }
        }, 1000);
    });
};

const configPromise = loadConfig();

const isXrpcRequest = (url: string): boolean => {
    const urlObj = new URL(url, window.location.href);
    return new RegExp(config.rule).test(urlObj.toString());
};

interface ProxyMessage {
    type: string;
    url: string;
    options: SerializedRequest;
}

interface ProxyResponse {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
}

const sendToBackground = (message: ProxyMessage): Promise<ProxyResponse> => {
    return new Promise((resolve, reject) => {
        const messageId = Math.random().toString(36).substring(2, 15);

        const messageHandler = (event: MessageEvent) => {
            if (event.source !== window || !event.data || event.data.type !== "ATPROXY_PROXY_RESPONSE") {
                return;
            }

            if (event.data.messageId === messageId) {
                window.removeEventListener("message", messageHandler);
                if (event.data.success) {
                    resolve(event.data.response);
                } else {
                    reject(event.data.error || new Error("Proxy request failed"));
                }
            }
        };

        window.addEventListener("message", messageHandler);

        window.postMessage(
            {
                type: "ATPROXY_PROXY_REQUEST",
                messageId: messageId,
                data: message,
            },
            "*",
        );

        setTimeout(() => {
            window.removeEventListener("message", messageHandler);
            reject(new Error("Request timeout"));
        }, 30000);
    });
};

const originalFetch = window.fetch;
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const req = input instanceof Request ? input : new Request(input, init);

    if (!isXrpcRequest(req.url)) {
        return originalFetch(input, init);
    }

    if (!configLoaded) {
        await configPromise;
    }

    if (!config.enabled) {
        return originalFetch(input, init);
    }

    try {
        const options = await serializeRequest(req);
        const response = await sendToBackground({
            type: "PROXY_REQUEST",
            url: options.url,
            options,
        });

        return new Response(response.body || "", {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        throw new Error(
            "[Atproxy] Failed to proxy request:",
            error instanceof Error ? error : new Error(String(error)),
        );
    }
};

window.fetch = customFetch;

window.postMessage({ type: "ATPROXY_INJECT_READY" }, "*");
