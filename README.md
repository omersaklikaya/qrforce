# QR Force

A small, fast web app for turning **URLs, plain text, or any string** into a QR code you can preview on the page and **download as PNG or SVG**. Everything runs in your browser—no accounts, no uploads, no server-side processing.

---

## What you can do

- **Encode anything** — Paste a link, a Wi‑Fi string, contact info, or arbitrary text. If it fits in a QR code, you can generate it.
- **Tune error correction** — Choose **L / M / Q / H** so the code stays scannable even when part of it is damaged, dirty, or covered by a logo (higher levels use more modules for the same payload).
- **Pick module colors** — Set **foreground** and **background** with the color pickers so the code matches your brand or print layout (as long as contrast stays scanner-friendly).
- **Control export size** — Use the **size** slider for **downloaded** images. The on-screen preview scales with the layout for a comfortable preview on any device.
- **Export** — **PNG** for photos and general use; **SVG** for sharp scaling in design tools or print workflows.
- **Quick generate** — Press **Ctrl+Enter** in the text area to generate without clicking the button.

---

## How it works (privacy)

- The page is **static HTML, CSS, and JavaScript**.
- QR rendering uses **[QRCode.js](https://github.com/davidshimjs/qrcodejs)** loaded from a CDN.
- Your input **never leaves your machine**; there is no backend and no analytics layer in the app itself.

---

## Using the app

1. Open the site (or `index.html` locally).
2. Enter your content in the text area.
3. Optionally adjust error correction, colors, and download size.
4. Click **GENERATE** (or press **Ctrl+Enter** in the text area).
5. When the code appears, use **PNG** or **SVG** to download.

If the content is too long for a QR code, you’ll see an error state instead of a broken image.

The **stats bar** gives you a live **character count** and rough **at-a-glance** info about the code (useful when you’re pushing length limits).

---

## Running locally

You can open `index.html` directly in a browser. For a closer match to how static hosting serves files (and to avoid any rare `file://` quirks), use any static server from the project folder, for example:

```bash
npx serve .
```

Then visit the URL the tool prints (often `http://localhost:3000`).

---

## Project layout

| File        | Role                                      |
| ----------- | ----------------------------------------- |
| `index.html` | Structure and UI markup                  |
| `style.css`  | Layout, typography, and visual design     |
| `script.js`  | QR generation, downloads, and interaction |
| `qrforce.ico` | Favicon                                 |

---

## Credits

- QR generation: [QRCode.js](https://github.com/davidshimjs/qrcodejs) (David Shim).

---

## License

No license file is included in this repository yet. If you open-source the project, add a `LICENSE` file so others know how they may use the code.
