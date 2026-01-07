import inquirer from "inquirer";

import { ProxyConfig } from "./types";
import { PERMISSIONS } from "./permissions";

export const promptHandle = async (defaultHandle?: string): Promise<string> => {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "handle",
            message: "Enter your handle (e.g., handle.example.com):",
            default: defaultHandle,
            validate: (input: string) => input.trim().length > 0 || "Handle is required",
        },
    ]);
    return answer.handle.trim();
};

export const promptPassword = async (): Promise<string> => {
    const answer = await inquirer.prompt([
        {
            type: "password",
            name: "password",
            message: "Enter your account or app password:",
            mask: "*",
            validate: (input: string) => input.length > 0 || "Password is required",
        },
    ]);
    return answer.password;
};

export const promptPermissions = async (config: ProxyConfig): Promise<string[]> => {
    const answer = await inquirer.prompt([
        {
            type: "checkbox",
            name: "permissions",
            message: "Select permissions (use space to select, enter to confirm):",
            choices: PERMISSIONS.map((perm) => ({
                name: perm,
                value: perm,
                checked: config.permissions?.includes(perm),
            })),
            pageSize: 15,
        },
    ]);
    return answer.permissions;
};
