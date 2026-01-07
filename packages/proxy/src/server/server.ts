import { createServer as createHttpServer } from "http";

import { type ServerConfig } from "./types";
import { createRequestHandler } from "./request-handler";

export const createServer = (config: ServerConfig): Promise<void> => {
    const server = createHttpServer(createRequestHandler(config));
    return new Promise<void>((resolve) => {
        server.listen(config.port, () => {
            console.log(`\nProxy server is running at http://localhost:${config.port}`);
            resolve();
        });
    });
};
