import { DEFAULT_PORT } from "./config";

export type SerializedRequest = {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string | null;
};

export async function serializeRequest(req: Request): Promise<SerializedRequest> {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => (headers[key] = value));

    if (!req.body) {
        return { url: req.url, method: req.method, headers, body: null };
    }

    const buffer = await req.clone().arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let bodyRaw = "";
    for (const byte of bytes) bodyRaw += String.fromCharCode(byte);

    return {
        url: req.url,
        method: req.method,
        headers,
        body: btoa(bodyRaw),
    };
}

export function deserializeRequest(data: SerializedRequest): Request {
    let body: BodyInit | undefined = undefined;

    if (data.body) {
        const raw = atob(data.body);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        body = bytes.buffer;
    }
    const localUrl = new URL(data.url);
    localUrl.host = `localhost:${DEFAULT_PORT}`;
    localUrl.protocol = "http";
    data.url = localUrl.toString();

    return new Request(data.url, {
        method: data.method,
        headers: data.headers,
        body,
    });
}
