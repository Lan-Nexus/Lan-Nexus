# Auto-Update Setup for LanLauncher

This document explains how the auto-update functionality works and how to set up GitHub releases for your Electron app.

## What was configured

### 1. electron-builder.yml
Updated the publish configuration to use GitHub releases:
```yaml
publish:
  provider: github
  owner: samdems
  repo: Lan-Launcher
```

### 2. Main Process (src/main/index.ts)
- Added `electron-updater` import and configuration
- Auto-updater only runs in production (not during development)
- Events are sent to renderer process for UI updates
- Auto-install after 5 seconds when update is downloaded

### 3. Preload Script (src/preload/index.ts)
- Added `updaterAPI` with methods to interact with auto-updater from renderer
- Exposed event listeners for update states

### 4. Type Definitions (src/preload/index.d.ts)
- Added TypeScript definitions for the new APIs

### 5. Renderer Process (src/renderer/src/App.vue)
- Added update notification UI
- Shows download progress
- Provides "Restart Now" button when update is ready

## How it works

1. **Check for Updates**: On app startup, the auto-updater checks GitHub releases for newer versions
2. **Download**: If an update is found, it downloads automatically in the background
3. **Install**: When download completes, the user gets a notification to restart and apply the update

## Setting up GitHub Releases

### 1. Repository Setup
1. Ensure your repository `https://github.com/samdems/Lan-Launcher` is **public**
2. Go to **Settings** → **Actions** → **General** and enable "Allow all actions and reusable workflows"

### 2. Set up GitHub Actions (Recommended)
The workflow file `.github/workflows/release.yml` has been created with:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*.*.*'  # Triggers on version tags like v1.0.0, v1.2.3, etc.

jobs:
  build-and-release:
    runs-on: windows-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
          
      - name: Install dependencies
        working-directory: ./client
        run: npm ci
        
      - name: Build Electron app
        working-directory: ./client
        run: npm run build:win
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Upload release assets
        uses: softprops/action-gh-release@v1
        with:
          files: |
            client/dist/*.exe
            client/dist/*.yml
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Manual Release Alternative
Build locally and upload to GitHub releases:

```bash
cd client
npm run build:win
```

Then upload the generated files from `client/dist/` to a GitHub release.

## Creating a Release

1. **Tag your version**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

2. **GitHub Actions will automatically**:
   - Build the app
   - Create a GitHub release
   - Upload the built files

3. **Your users will get automatic updates** when they open the app!

## Testing

To test the auto-updater:

1. Build and distribute version 1.0.0
2. Create a new release with version 1.0.1
3. Open the version 1.0.0 app - it should detect and download the update

## API Usage in Renderer

```typescript
// Check current version
const version = await window.updaterAPI.getVersion();

// Manual check for updates
window.updaterAPI.checkForUpdates();

// Listen for update events
window.updaterAPI.onUpdateAvailable((info) => {
  console.log('Update available:', info);
});

window.updaterAPI.onDownloadProgress((progress) => {
  console.log('Progress:', progress.percent + '%');
});

window.updaterAPI.onUpdateDownloaded((info) => {
  // Show restart button
  window.updaterAPI.quitAndInstall();
});
```

## Important Notes

- Auto-updater only works in production builds (not during development)
- Requires code signing for Windows/macOS for best user experience
- GitHub releases must be public for the auto-updater to access them
- Version numbers must follow semantic versioning (e.g., 1.0.0, 1.0.1, 1.1.0)
