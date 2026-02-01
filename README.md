# Atproxy

> Local XRPC Proxy for atproto and Bluesky-like Applications

Atproxy is a privacy-first browser extension and local proxy server that gives you complete control over XRPC requests from atproto applications. Intercept, filter, and manage all XRPC traffic through your own local server, keeping session data and sensitive information entirely under your control.

[Read docs](./docs/README.md)

## Usage

1. Run local server

```bash
npx atproxy
```

2. In the questions, enter handle, password and permissions

3. If the service does not have additional support, enable the extension

4. Own your data and experience even more


## Overview

Atproxy consists of two components working together:

- **Browser Extension** (Manifest V3): Intercepts XRPC requests from web pages and forwards them to your local proxy server
- **Proxy Server** (Node.js CLI): A local HTTP server that authenticates with Bluesky, validates permissions, and proxies requests to the atproto network

This architecture ensures that all session management, authentication tokens, and request filtering happens on your machine—never in the browser or on external servers.

## Privacy & Security
- **Local-first architecture**: All session data and credentials stored exclusively on your server
- **Permission-based access control**: Whitelist specific XRPC methods (queries and procedures)
- **No data collection**: Zero telemetry, tracking, or external data transmission
- **Transparent proxying**: Requests flow through your server with full visibility

### Request Flow

1. **Interception**: Injected script overrides `window.fetch()` and matches requests against configured regex pattern (default: `^.*/xrpc/`)
2. **Extension Bridge**: Content script forwards serialized request to background service worker
3. **Proxy Forwarding**: Background worker sends HTTP request to local proxy server (default: `http://localhost:9523`)
4. **Permission Check**: Proxy validates request path against whitelisted permissions
5. **Authentication**: Proxy uses stored Bluesky credentials to authenticate with atproto network
6. **XRPC Call**: Proxy makes authenticated call using `@atproto/api` Agent
7. **Response**: Response flows back through the chain to the original web application

## API Reference

### Proxy Server CLI

```bash
atproxy [options]

Options:
  --handle <string>     Bluesky handle (e.g., handle.bsky.social)
  --permissions <...>   Permission IDs (can specify multiple times)
  --port <number>       Server port (default: 9523)
```

### Proxy Server Endpoints

- `GET /xrpc/<method>` - Proxy GET requests (queries)
- `POST /xrpc/<method>` - Proxy POST requests (procedures)
- `GET /` - Health check endpoint

### Extension Configuration

Extension settings are stored in Chrome's sync storage and accessible via the popup:

- **Enabled**: Toggle to enable/disable request proxying
- **Proxyfying rule**: Regex pattern to match URLs (default: `^.*/xrpc/`)

## Use Cases

### For Developers

- **Testing & Development**: Test Bluesky integrations without affecting production accounts
- **API Experimentation**: Explore atproto APIs with full request/response visibility
- **Custom Clients**: Build or use Bluesky clients with custom authentication or filtering logic
- **Debugging**: Inspect XRPC traffic and understand application behavior

### For Privacy-Conscious Users

- **Session Control**: Keep authentication tokens on your machine, not in browser storage
- **Request Filtering**: Block or modify specific API calls before they reach Bluesky
- **Traffic Analysis**: Monitor and log all XRPC requests for security auditing

## Troubleshooting

### Extension shows "Not started"

- Verify the proxy server is running: `curl http://localhost:9523/`
- Check the port matches in extension configuration
- Ensure no firewall is blocking `localhost:9523`

### Requests not being intercepted

- Verify the regex pattern matches your application's XRPC URLs
- Check browser console for injection errors
- Ensure extension is enabled in the popup

## Local Usage

### Installation

**Prerequisites**

- Node.js >= 18.0.0
- pnpm (recommended) or npm
- Chrome, Edge, or other Chromium-based browser

```bash
git clone <repository-url>
cd atproxy
pnpm install
pnpm build
```

### Starting the Proxy Server

The proxy server requires Bluesky credentials and permission configuration:

```bash
pnpm start:proxy
pnpm start:proxy --handle yourhandle.bsky.social \
  --permissions app.bsky.feed.getTimeline \
  --permissions app.bsky.actor.getProfile \
  --port 9523
```

**Server setup:**
1. Enter your Bluesky handle (e.g., `yourhandle.bsky.social`)
2. Enter your account or app password
3. Select permissions from the interactive list (use arrow keys, space to select)
4. Configuration (excluding password) is saved to `~/.atproxy.json` for future runs

### Installing the Extension

1. Build the extension:
    ```bash
    pnpm build:extension
    ```
2. Load in Chrome/Edge:
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `packages/extension/dist`
3. Configure the extension:
   - Click the extension icon in your toolbar
   - Toggle the switch to enable proxying
   - Adjust the regex pattern if needed (default: `^.*/xrpc/`)
   - Verify the status indicator shows "Connected"

## Resources

- [AT Protocol Documentation](https://atproto.com)
- [XRPC Specification](https://atproto.com/specs/xrpc)
- [Bluesky Developer Resources](https://docs.bsky.app)

---

**Note**: This extension does not collect, store, or transmit any data outside of your local machine. All request handling, session management, and data processing occurs entirely under your control.

## License

MIT License
