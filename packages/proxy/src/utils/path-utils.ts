import { schemaDict, ids } from "@atproto/api/dist/client/lexicons";

const invertedIds = Object.fromEntries(Object.entries(ids).map(([key, value]) => [value, key])) as Record<
    string,
    keyof typeof ids
>;

export const checkIsQueryPath = (path: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(invertedIds, path)) return false;
    const defs = schemaDict[invertedIds[path]].defs;
    return "main" in defs && defs.main.type === "query";
};

export const checkIsProcedurePath = (path: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(invertedIds, path)) return false;
    const defs = schemaDict[invertedIds[path]].defs;
    return "main" in defs && defs.main.type === "procedure";
};

export const parseQueryParams = (url: string): Record<string, string | string[]> => {
    const urlObj = new URL(url, `http://localhost:8080`);
    const params: Record<string, string | string[]> = {};
    urlObj.searchParams.forEach((value, key) => {
        const existing = params[key];
        params[key] = existing ? (Array.isArray(existing) ? [...existing, value] : [existing, value]) : value;
    });
    return params;
};

export const parsePath = (pathname: string): string | null => {
    return pathname.startsWith("/xrpc/") ? pathname.slice(6) : null;
};
