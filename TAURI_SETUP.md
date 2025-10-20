# Flow Pomodoro - Tauri Integration Guide

This guide explains how to integrate the Flow Pomodoro frontend with Tauri to create a native macOS app.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Rust (install via [rustup.rs](https://rustup.rs))
- Xcode Command Line Tools (macOS): `xcode-select --install`

## Project Structure

\`\`\`
flow-pomodoro/
├── app/                    # Next.js frontend (already built in v0)
├── components/             # React components
├── lib/                    # Hooks and utilities
├── public/                 # Static assets
├── tauri-src/              # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs        # Main Tauri app
│   │   ├── timer.rs       # Timer logic
│   │   └── preferences.rs # Preferences management
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── package.json
\`\`\`

## Setup Steps

### 1. Initialize Tauri in Your Project

\`\`\`bash
# Install Tauri CLI
npm install --save-dev @tauri-apps/cli

# Add Tauri scripts to package.json
\`\`\`

Add these scripts to your `package.json`:

\`\`\`json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
\`\`\`

### 2. Configure Next.js for Tauri

Update `next.config.mjs`:

\`\`\`js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  trailingSlash: true,
}

export default nextConfig
\`\`\`

### 3. Copy Tauri Files

Copy all files from the `tauri-src/` directory in this project to your local `src-tauri/` directory.

### 4. Install Tauri Dependencies

\`\`\`bash
cd src-tauri
cargo build
cd ..
\`\`\`

### 5. Update Frontend to Use Tauri APIs

The frontend code already includes fallbacks for browser preview. When running in Tauri, it will automatically use the native APIs.

Key integration points in the code:

\`\`\`typescript
// Check if running in Tauri
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window

// Use Tauri notifications
if (isTauri) {
  const { invoke } = await import('@tauri-apps/api/core')
  await invoke('send_notification', { 
    title: 'Timer Complete!', 
    body: 'Time for a break' 
  })
}
\`\`\`

### 6. Run Development Server

\`\`\`bash
npm run tauri:dev
\`\`\`

This will:
1. Start the Next.js dev server
2. Launch the Tauri app window
3. Enable hot-reload for both frontend and backend

### 7. Build for Production

\`\`\`bash
npm run tauri:build
\`\`\`

This creates a native `.app` bundle in `src-tauri/target/release/bundle/`.

## Features Enabled by Tauri

### System Tray
- Always accessible from menu bar
- Quick start/pause/reset controls
- Show/hide window

### Native Notifications
- macOS notification center integration
- Appears even when app is in background

### Keyboard Shortcuts
Add to `tauri.conf.json`:

\`\`\`json
{
  "app": {
    "shortcuts": {
      "start": "Cmd+S",
      "pause": "Cmd+P",
      "reset": "Cmd+R"
    }
  }
}
\`\`\`

### Persistent Storage
- Preferences saved to `~/Library/Application Support/flow/`
- Stats stored locally with full privacy

## Customization

### Window Size
Edit `tauri.conf.json`:

\`\`\`json
{
  "app": {
    "windows": [{
      "width": 400,
      "height": 600,
      "resizable": false
    }]
  }
}
\`\`\`

### App Icon
Replace icons in `src-tauri/icons/` with your own:
- `icon.icns` (macOS)
- `icon.ico` (Windows)
- Various PNG sizes for different contexts

## Troubleshooting

### "Command not found: tauri"
\`\`\`bash
npm install --save-dev @tauri-apps/cli
\`\`\`

### Build fails on macOS
\`\`\`bash
xcode-select --install
\`\`\`

### Rust compilation errors
\`\`\`bash
rustup update
cargo clean
cargo build
\`\`\`

## Next Steps

1. Add app icons (use [tauri-icon](https://github.com/tauri-apps/tauri-icon))
2. Configure code signing for distribution
3. Set up auto-updates with Tauri updater
4. Add global keyboard shortcuts
5. Implement menu bar-only mode (no dock icon)

## Resources

- [Tauri Documentation](https://tauri.app)
- [Tauri + Next.js Guide](https://tauri.app/v1/guides/getting-started/setup/next-js)
- [Tauri API Reference](https://tauri.app/v1/api/js/)
\`\`\`



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwOTIyMjEwMDEyLCJmaW5pc2hlZEF0IjoxNzYwOTIyMjEwMDEyLCJpZCI6Im85bWNUcGp3YzNGSkhDMloiLCJsYXN0UGFydFNlbnRBdCI6MTc2MDkyMjIxMDAxMiwicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6IlR4dVZWSW95WW1LbFluRHYiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgdG9kbyBsaXN0IiwidG9vbENhbGxJZCI6InRvb2x1XzAxQ3ZmSmV5amc0eEIxaFRDeU1iQzJDNCIsInRhc2tOYW1lQ29tcGxldGUiOiJDb21wbGV0ZWQgdG9kbyBsaXN0IiwiY3JlYXRlZEF0IjoxNzYwOTIyMjEwOTE2LCJmaW5pc2hlZEF0IjpudWxsLCJwYXJ0cyI6W10sImxhc3RQYXJ0U2VudEF0IjpudWxsfQ==" />
