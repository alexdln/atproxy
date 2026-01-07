import { loadConfig, saveConfigHandler, checkBackendStatus } from "./config";

document.addEventListener("DOMContentLoaded", loadConfig);
document.querySelector("#form")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newConfig = {
        rule: formData.get("rule") as string,
    };
    saveConfigHandler(newConfig, "Settings saved");
});

document.querySelector<HTMLInputElement>("#enable")!.addEventListener("change", (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    saveConfigHandler({ enabled }, enabled ? "Enabled" : "Disabled");
});

setInterval(checkBackendStatus, 3000);
