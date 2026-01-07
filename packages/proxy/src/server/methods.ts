import { IncomingMessage, ServerResponse } from "http";

import { type ServerConfig } from "./types";
import { checkIsQueryPath, parseQueryParams, checkIsProcedurePath } from "../utils/path-utils";
import { sendJson } from "../utils/http-utils";

export const GET = async (
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    config: ServerConfig,
): Promise<void> => {
    if (!checkIsQueryPath(path) || !config.permissions.includes(path)) {
        return sendJson(res, 400, {});
    }

    try {
        const params = parseQueryParams(req.url || "");
        if (params.actor === "did:me") {
            if (!config.did) return sendJson(res, 200, null);
            params.actor = config.did;
        }
        const response = await config.agent.call(path, params);
        return sendJson(res, 200, response.data);
    } catch (e) {
        console.error(e);
        if (e instanceof Error && "status" in e && typeof e.status === "number") {
            return sendJson(res, e.status, { message: e.message });
        }
        return sendJson(res, 400, {});
    }
};

export const POST = async (
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    config: ServerConfig,
): Promise<void> => {
    if (!checkIsProcedurePath(path) || !config.permissions.includes(path)) {
        return sendJson(res, 400, {});
    }

    try {
        const queryParams = parseQueryParams(req.url || "");
        const response = await config.agent.call(path, queryParams, req, {
            encoding: req.headers["content-type"],
            headers: req.headers as Record<string, string>,
        });
        return sendJson(res, 200, response.data);
    } catch (e) {
        console.error(e);
        if (e instanceof Error && "status" in e && typeof e.status === "number") {
            return sendJson(res, e.status, { message: e.message });
        }
        return sendJson(res, 400, {});
    }
};
