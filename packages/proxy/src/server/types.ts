import { type Agent } from "@atproto/api";

export interface ServerConfig {
    agent: Agent;
    did: string;
    permissions: string[];
    port: number;
}
