# Introduction markdown

Before uploading, replace in `introduction.md`:

- `CHANNEL_ID_ANNOUNCEMENTS` → full `_id` for the **announcements** channel (from Convex dashboard)
- `CHANNEL_ID_SHOWCASE` → full `_id` for the **showcase** channel (from Convex dashboard)

Then run from project root:

```bash
bun run scripts/upload-markdown.ts ./content/introduction --channel j97cbasht6y8zjbwk6xh4fqmjx7zmpqh --content "Introduction"
```
