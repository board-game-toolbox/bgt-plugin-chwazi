# Board Game Toolbox Plugin Template

Plugin template for board-game-toolbox.

Altered from [vite's react-ts template](https://stackblitz.com/edit/vitejs-vite-orp9e9?file=index.html&terminal=dev).

## Quick Start

### Upload Plugin

```bash
pnpm icon
npm publish
```

After publishing, you can load `https://registry.npmjs.org/${your-project-name}` to see the metadata.

## Main Changes

### Add required files

Add `icon.png`.

### Use relative path in `index.html`

`board-game-toolbox` use `react-native-webview` to load plugins, according to its file lookup logic, links in `index.html` should be relative path like `./xxx` instead of `/xxx`.

### Add scripts

Some useful scripts are located in `scripts` folder.

For example, `icon-to-base64.js` resize your `icon.png` to 64x64 and generate base64 string to `package.json`, then metadata will contain enough info to show the icon.
