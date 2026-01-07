import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

import { type ProxyConfig } from "./types";

const CONFIG_FILE = join(homedir(), ".atproxy.json");

export const loadConfig = async (): Promise<ProxyConfig> => {
    try {
        const content = await readFile(CONFIG_FILE, "utf-8");
        return JSON.parse(content);
    } catch {
        return {};
    }
};

export const saveConfig = async (config: ProxyConfig): Promise<void> => {
    return writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
};
