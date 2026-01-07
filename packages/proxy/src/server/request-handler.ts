import { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

import { type ServerConfig } from "./types";
import { GET, POST } from "./methods";
import { parsePath } from "../utils/path-utils";
import { sendJson } from "../utils/http-utils";

export const createRequestHandler = (config: ServerConfig) => {
    return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const url = new URL(req.url || "", `http://localhost`);
        const path = parsePath(url.pathname || "");

        if (path === null) {
            return sendJson(res, 404, { error: "Not found" });
        }

        if (path === "") {
            return sendJson(res, 200, {});
        }

        console.log(`[${req.method}] ${req.url?.replace(url.origin, "")}`);

        if (req.method === "GET") {
            return GET(req, res, path, config);
        } else if (req.method === "POST") {
            return POST(req, res, path, config);
        } else {
            return sendJson(res, 405, { error: "Method not allowed" });
        }
    };
};
