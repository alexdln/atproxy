export interface ExtensionConfig {
    enabled: boolean;
    rule: string;
}

export const DEFAULT_PORT = 9523;
export const DEFAULT_RULE = "^.*/xrpc/";

export const getConfig = async (): Promise<ExtensionConfig> => {
    const result = await chrome.storage.sync.get(["enabled", "rule"]);
    return {
        enabled: result.enabled !== undefined ? (result.enabled as boolean) : false,
        rule: (result.rule as string) || DEFAULT_RULE,
    };
};

export const saveConfig = async (config: Partial<ExtensionConfig>): Promise<void> => {
    await chrome.storage.sync.set(config);
};
