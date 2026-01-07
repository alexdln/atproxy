#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadConfig, saveConfig } from "./config/config";
import { createServer } from "./server/server";
import { authenticate } from "./config/auth";
import { promptHandle, promptPassword, promptPermissions } from "./config/prompts";

const DEFAULT_PORT = 8080;

const main = async (): Promise<void> => {
    const config = await loadConfig();
    const argv = await yargs(hideBin(process.argv))
        .option("handle", {
            type: "string",
            description: "Handle (e.g., handle.example.com)",
        })
        .option("permissions", {
            type: "array",
            description: "Permissions to enable (can be specified multiple times)",
            string: true,
        })
        .option("port", {
            type: "number",
            description: "Port number for the server",
        })
        .parse();

    const port = argv.port || config.port || DEFAULT_PORT;

    console.log("Starting XRPC Server\n");

    const handle = argv.handle || (await promptHandle(config.handle));
    const password = await promptPassword();

    const selectedPermissions =
        (argv.permissions && argv.permissions.length > 0
            ? (argv.permissions as string[])
            : await promptPermissions(config)) || [];

    if (selectedPermissions.length === 0) {
        console.error("Error: At least one permission must be selected");
        process.exit(1);
    }

    await saveConfig({
        handle,
        permissions: selectedPermissions,
        port,
    });

    console.log("\nAuthenticating...");

    try {
        const { agent, did } = await authenticate(handle, password);
        console.log(`Authenticated as ${did}\n`);

        await createServer({
            agent,
            did,
            permissions: selectedPermissions,
            port,
        });
    } catch (error) {
        console.error("Authentication failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
