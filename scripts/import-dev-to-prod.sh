#!/usr/bin/env bash
# Export all data + file storage from dev, then import into production.
# Requires: .env.convex.dev with CONVEX_DEPLOYMENT=dev:<your-dev-deployment-name>
# Prod is selected by --prod (uses CONVEX_DEPLOYMENT from .env.local or your deploy key).

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/.convex-backup"
ENV_DEV="$ROOT_DIR/.env.convex.dev"

cd "$ROOT_DIR"

if [[ ! -f "$ENV_DEV" ]]; then
  echo "Missing $ENV_DEV. Create it with: CONVEX_DEPLOYMENT=dev:<your-dev-deployment-name>"
  exit 1
fi

# Read dev deployment name only (strip any deploy key after "|")
DEV_DEPLOYMENT=$(grep -E '^CONVEX_DEPLOYMENT=' "$ENV_DEV" | head -1 | cut -d= -f2- | cut -d'|' -f1)
if [[ -z "$DEV_DEPLOYMENT" ]]; then
  echo "Could not read CONVEX_DEPLOYMENT from $ENV_DEV"
  exit 1
fi

echo "Step 1/2: Exporting from dev ($DEV_DEPLOYMENT) — tables + file storage..."
mkdir -p "$BACKUP_DIR"
# Use env var only for deployment; CLI auth comes from your normal login (.env.local / ~/.convex)
CONVEX_DEPLOYMENT="$DEV_DEPLOYMENT" npx convex export --path "$BACKUP_DIR" --include-file-storage

ZIP=$(ls -t "$BACKUP_DIR"/snapshot_*.zip 2>/dev/null | head -1)
if [[ -z "$ZIP" || ! -f "$ZIP" ]]; then
  echo "Export did not produce a snapshot zip in $BACKUP_DIR"
  exit 1
fi

echo "Step 2/2: Importing into production (--replace)..."
npx convex import --prod --replace "$ZIP" -y

echo "Done. Production now has the data and files from dev."
