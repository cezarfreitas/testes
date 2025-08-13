#!/bin/bash

# Pre-build script to ensure pnpm-lock.yaml is up to date

set -e

echo "🔍 Checking if pnpm-lock.yaml is up to date..."

# Check if pnpm install with frozen lockfile works
if pnpm install --frozen-lockfile --dry-run &>/dev/null; then
    echo "✅ Lockfile is up to date"
else
    echo "⚠️ Lockfile is outdated, updating..."
    pnpm install --no-frozen-lockfile
    echo "✅ Lockfile updated successfully"
fi

echo "🎯 Ready for Docker build!"
