import { CredentialSession, Agent } from "@atproto/api";

export const authenticate = async (handle: string, password: string) => {
    const credentials = new CredentialSession(new URL("https://bsky.social"));
    await credentials.login({
        identifier: handle,
        password: password,
    });
    const agent = new Agent(credentials);
    const did = agent.did;

    if (!did) throw new Error("Authentication failed");

    return { agent, did };
};
