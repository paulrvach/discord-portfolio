# Showcase Sync CLI

A Node.js CLI tool that synchronizes a local `showcase/` directory with the Convex backend for the Discord-clone portfolio. It handles file uploads to Convex storage and manages message creation/updates via Convex mutations.

## Quick Start

```bash
bun run scripts/sync-showcase.ts
```

## Prerequisites

- [Bun](https://bun.sh/) runtime
- A running Convex deployment with `VITE_CONVEX_URL` set in `.env.local`
- At least one seeded user and server/channel in your Convex database

## Directory Structure

```
showcase/
  manifest.json          # Auto-generated. Tracks sync state between local folders and Convex.
  index.md               # Auto-generated. Markdown task list of pending/completed uploads.
  blender-renders/       # "Message Bundle" — becomes a media message
    render-01.png
    render-02.png
  music-demos/           # Another bundle — becomes audio messages
    track-01.mp3
    cover.jpg
  portfolio-writeup/     # Another bundle — becomes a markdown message
    writeup.md
```

Each subdirectory is a **Message Bundle**. When synced, the script uploads its files to Convex storage and creates a message (or appends to an existing one) in the channel you select.

## How It Works

### 1. Discovery

The script scans all subdirectories inside `showcase/`. Files like `.gitkeep`, `.DS_Store`, `Thumbs.db`, `manifest.json`, and `index.md` are automatically ignored.

### 2. Diffing

Each folder is compared against `manifest.json` to determine its state:

| Symbol | Meaning |
|--------|---------|
| `+`    | New folder, not yet synced |
| `~`    | Existing folder with new files detected |
| `=`    | Fully synced, no changes |

### 3. Task Generation

Before uploading anything, the script appends `- [ ] Upload: folder/file` entries to `showcase/index.md` for every pending file. After a successful sync, those entries are marked `- [x]`.

### 4. Interactive Prompts

The CLI guides you through each sync:

- **Folder selection** — Pick which pending folder to sync.
- **Message type** — Choose from `user`, `bot`, `media`, `audio`, or `markdown`. The script suggests a type based on the file extensions it finds (e.g., `.png` files suggest `media`).
- **Channel selection** — Channels are fetched live from Convex and presented as a list. A manual ID entry option is always available.
- **Metadata** — Depending on the message type, you'll be prompted for title, caption, tags, artist, duration, etc.

For folders that already exist in the manifest (update scenario), the message type and channel are reused automatically.

### 5. Upload & Message Creation

For each new file:
1. A presigned upload URL is requested from Convex (`storage.generateUploadUrl`).
2. The file is `POST`ed to that URL.
3. The permanent storage URL is resolved.

Then, depending on the message type:

| Type | Behavior |
|------|----------|
| **media** | All image files become a single media message. If the folder already exists, new images are appended to the existing message. Prompts for title, caption, tags, and an optional external URL. |
| **audio** | Each audio file (`.mp3`, `.wav`, `.ogg`, `.flac`) becomes its own audio message. If a `.png`/`.jpg`/`.webp` image is in the folder, it's used as the cover art. Prompts for title, artist, and duration per track. |
| **markdown** | Each `.md` file is uploaded to Convex storage and a markdown message is created. Prompts for a display title. |
| **user / bot** | A plain text message is created. Prompts for message content. |

### 6. Cleanup

After a successful sync:
- `manifest.json` is **deep-merged** — only the synced folder entry is updated; all other entries are preserved.
- `index.md` tasks for the synced files are marked complete.

If a Convex mutation **fails**, the manifest is **not** updated for that folder, so you can safely retry.

## Manifest Schema

```json
{
  "blender-renders": {
    "convexMessageId": "j975abc123...",
    "files": ["render-01.png", "render-02.png"],
    "channelId": "j976def456...",
    "messageType": "media"
  }
}
```

| Field | Description |
|-------|-------------|
| `convexMessageId` | The Convex document ID of the created/updated message |
| `files` | Array of filenames that have been synced |
| `channelId` | The target channel's Convex ID |
| `messageType` | One of `user`, `bot`, `media`, `audio`, `markdown` |

## File Type Detection

The script maps file extensions to suggested message types:

| Extensions | Suggested Type |
|------------|----------------|
| `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.bmp`, `.heic` | `media` |
| `.mp3`, `.wav`, `.ogg`, `.flac` | `audio` |
| `.md` | `markdown` |

The suggestion is based on whichever type has the most matching files in the folder. You can always override it during the prompt.

## Convex Mutations Used

| Function | Purpose |
|----------|---------|
| `storage.generateUploadUrl` | Get a presigned upload URL |
| `storage.getUrl` | Resolve a permanent URL from a storage ID |
| `channels.listAll` | Fetch all channels for the picker |
| `messages.createMediaDirect` | Create a media message with image URLs |
| `messages.appendMediaImages` | Append images to an existing media message |
| `messages.createAudioMessage` | Create an audio message from a storage ID |
| `messages.createMarkdownMessage` | Create a markdown message from a storage ID |
| `messages.send` | Create a plain text message |

## Error Handling

- **Failed uploads** are logged and skipped; other files in the folder continue uploading.
- **Failed mutations** prevent the manifest from being updated, so the folder stays "pending" for the next run.
- If anything goes wrong mid-sync, you're prompted whether to continue with another folder or exit.

## Example Session

```
╔══════════════════════════════╗
║     Showcase Sync CLI        ║
╚══════════════════════════════╝

  Convex: https://your-deployment.convex.cloud

Scanning showcase directory...

Found 3 subdirectory(ies):

  + blender-renders  (new, 4 files)
  + music-demos      (new, 3 files)
  = portfolio-writeup  (synced, 1 files)

Updated index.md with 7 pending task(s).

? Select folder to sync: blender-renders (4 new files)
? Message type: media (suggested)
? Select target channel: #showcase (My Portfolio)
? Media title: Blender Renders
? Caption: Latest 3D rendering work
? Tags (comma-separated): blender, 3d, rendering
? External URL (optional, press Enter to skip):

Uploading files...

  [1/4] scene-01.png (245.3 KB, image/png)... done (kg5abc...)
  [2/4] scene-02.png (312.1 KB, image/png)... done (kg5def...)
  [3/4] scene-03.jpg (198.7 KB, image/jpeg)... done (kg5ghi...)
  [4/4] wireframe.webp (89.4 KB, image/webp)... done (kg5jkl...)

  Creating media message with 4 image(s)...
  Message created: j975mno...

  Updated manifest.json
  Marked 4 task(s) complete in index.md

? Sync another folder? Yes
...
```
