#!/bin/bash
# ============================================================
# BuiltByBas — SSL Setup (Let's Encrypt)
# Run AFTER deploy.sh and AFTER DNS is pointing to VPS
# Usage: bash setup-ssl.sh
# ============================================================

set -euo pipefail

DOMAIN="builtbybas.com"
EMAIL="devbybas@gmail.com"

echo "============================================"
echo " SSL Setup — Let's Encrypt"
echo "============================================"
echo ""

# Verify DNS is pointing to this server
echo "Checking DNS resolution..."
RESOLVED_IP=$(dig +short "$DOMAIN" | head -1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
    echo "WARNING: $DOMAIN resolves to $RESOLVED_IP but this server is $SERVER_IP"
    echo "Make sure DNS A record points to $SERVER_IP before running this."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# --- Install Nginx config if not present ---
if [ ! -f /etc/nginx/sites-available/builtbybas ]; then
    echo "Installing Nginx config..."
    cp /var/www/builtbybas/deploy/nginx-builtbybas.conf /etc/nginx/sites-available/builtbybas
    ln -sf /etc/nginx/sites-available/builtbybas /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl reload nginx
fi

# --- Get SSL certificate ---
echo "Requesting SSL certificate..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive --redirect

# --- Verify ---
echo ""
echo "============================================"
echo " SSL Setup Complete!"
echo "============================================"
echo ""
echo "  https://$DOMAIN should now be live with SSL"
echo "  Certificate auto-renews via certbot timer"
echo ""
systemctl list-timers certbot.timer
echo ""
