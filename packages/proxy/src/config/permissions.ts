import { schemaDict } from "@atproto/api/dist/client/lexicons";

export const PERMISSIONS = Object.values(schemaDict)
    .filter((value) => "main" in value.defs && ["query", "procedure"].includes(value.defs.main.type))
    .map((value) => value.id);
