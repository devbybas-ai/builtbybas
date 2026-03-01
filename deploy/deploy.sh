#!/bin/bash
# ============================================================
# BuiltByBas — Deploy / Update Script
# Run as root on the VPS
# Usage: bash deploy.sh
#
# First run:  clones repo, installs deps, builds, starts PM2
# Updates:    pulls latest, installs deps, builds, restarts PM2
# ============================================================

set -euo pipefail

APP_DIR="/var/www/builtbybas"
REPO="git@github.com-devbybas:devbybas-ai/builtbybas.git"
BRANCH="main"

echo "============================================"
echo " BuiltByBas — Deploy"
echo "============================================"
echo ""

# --- Clone or pull ---
if [ ! -d "$APP_DIR" ]; then
    echo "[1/5] Cloning repository..."
    mkdir -p /var/www
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
    git checkout "$BRANCH"
else
    echo "[1/5] Pulling latest changes..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard "origin/$BRANCH"
fi

# --- Check .env.production exists ---
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo ""
    echo "ERROR: .env.production not found!"
    echo ""
    echo "Create it at $APP_DIR/.env.production with:"
    echo "  DATABASE_URL=postgresql://builtbybas:PASSWORD@localhost:5432/builtbybas"
    echo "  NEXT_PUBLIC_SITE_URL=https://builtbybas.com"
    echo "  NODE_ENV=production"
    echo "  AUTH_SECRET=<generate with: openssl rand -base64 32>"
    echo ""
    exit 1
fi

# --- Install dependencies ---
echo "[2/5] Installing dependencies..."
pnpm install --frozen-lockfile

# --- Run database migrations ---
echo "[3/5] Running database migrations..."
cp .env.production .env.local
npx drizzle-kit push

# --- Build ---
echo "[4/5] Building production bundle..."
pnpm build

# --- PM2 ---
echo "[5/5] Starting/restarting PM2..."
if pm2 describe builtbybas > /dev/null 2>&1; then
    pm2 restart builtbybas
else
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup systemd -u root --hp /root 2>/dev/null || true
fi

echo ""
echo "============================================"
echo " Deploy complete!"
echo "============================================"
echo ""
pm2 status builtbybas
echo ""
echo "  App running at: http://localhost:3002"
echo "  Nginx proxy:    http://builtbybas.com"
echo ""
