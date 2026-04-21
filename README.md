# QR Deeplink Generator

A one-page React app for generating QR codes from deeplinks. Fully dynamic by default — all fields are free-text inputs — and configurable via JSON import to turn any field into a dropdown.

## Features

- **Build Deeplink tab** — compose a deeplink from schema, base path, and query parameters, then generate a QR code
- **Custom tab** — generate a QR code from any arbitrary text or URL
- **JSON config import** — load a configuration via a floating button to preset field values or convert text inputs into dropdowns
- **Persistent state** — all field values are saved to `localStorage` and restored on reload

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents of that folder to any static host (Vercel, Netlify, etc.).

## Config import

Click the upload button in the bottom-right corner to open the import modal. Paste a JSON object with any combination of the following keys:

```json
{
  "schema": ["chrome", "other"],
  "deeplink_base": ["inspect/#device", "other/path"],
  "query_params": [
    { "key": "url", "value": "" },
    { "key": "user_id", "value": "1234" }
  ]
}
```

| Key | Type | Effect |
|---|---|---|
| `schema` | `string` | Sets the schema field to that value |
| `schema` | `string[]` | Replaces the schema field with a dropdown |
| `deeplink_base` | `string` | Sets the deeplink base field to that value |
| `deeplink_base` | `string[]` | Replaces the deeplink base field with a dropdown |
| `query_params` | `{ key, value }[]` | Populates the query params list (`url` goes to the fixed field, the rest become additional params) |

Submitting the modal with an empty field resets all fields to their default state (empty free-text inputs).

## How deeplinks are built

```
{schema}://{deeplink_base}?{query_params}
```

Example: schema `chrome`, base `inspect/devices`, url param `https://example.com` →

```
chrome://inspect/devices?url=https%3A%2F%2Fexample.com
```

QR codes are generated via [api.qrserver.com](https://api.qrserver.com).

## Tech stack

- React 18 + Vite 6
- No UI framework — plain CSS modules per component
- No state management library — React `useState` + `localStorage`
