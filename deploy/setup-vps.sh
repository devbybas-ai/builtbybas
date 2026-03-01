#!/bin/bash
# ============================================================
# BuiltByBas — VPS Initial Setup Script
# Run as root on Ubuntu 24.04 (Hostinger VPS)
# Usage: bash setup-vps.sh
# ============================================================

set -euo pipefail

echo "============================================"
echo " BuiltByBas VPS Setup — Ubuntu 24.04"
echo "============================================"
echo ""

# --- 1. System updates ---
echo "[1/8] Updating system packages..."
apt update && apt upgrade -y

# --- 2. Install essentials ---
echo "[2/8] Installing essentials..."
apt install -y curl git unzip ufw fail2ban

# --- 3. Install Node.js 22 LTS ---
echo "[3/8] Installing Node.js 22..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs
fi
echo "  Node.js: $(node -v)"

# --- 4. Install pnpm ---
echo "[4/8] Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi
echo "  pnpm: $(pnpm -v)"

# --- 5. Install PM2 ---
echo "[5/8] Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "  PM2: $(pm2 -v)"

# --- 6. Install PostgreSQL 17 ---
echo "[6/8] Installing PostgreSQL 17..."
if ! command -v psql &> /dev/null; then
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
    apt update
    apt install -y postgresql-17
fi
systemctl enable postgresql
systemctl start postgresql
echo "  PostgreSQL: $(psql --version | head -1)"

# --- 7. Install Nginx + Certbot ---
echo "[7/8] Installing Nginx + Certbot..."
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx

# --- 8. Configure firewall ---
echo "[8/8] Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "============================================"
echo " System setup complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Run: bash setup-db.sh"
echo "  2. Run: bash deploy.sh"
echo "  3. Run: bash setup-ssl.sh"
echo ""
