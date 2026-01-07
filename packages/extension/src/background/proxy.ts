import { deserializeRequest, SerializedRequest } from "../shared/request";

export const handleProxyRequest = async (data: SerializedRequest) => {
    const request = deserializeRequest(data);
    const response = await fetch(request);
    const responseText = await response.text().catch(() => "");

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });

    return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseText,
    };
};
