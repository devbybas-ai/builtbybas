#!/bin/bash
# ============================================================
# BuiltByBas — GitHub SSH Key Setup for VPS
# Run on the VPS so it can clone the private repo
# Usage: bash setup-github-ssh.sh
# ============================================================

set -euo pipefail

KEY_PATH="$HOME/.ssh/github_devbybas"

echo "============================================"
echo " GitHub SSH Key Setup"
echo "============================================"
echo ""

if [ -f "$KEY_PATH" ]; then
    echo "SSH key already exists at $KEY_PATH"
else
    echo "Generating SSH key..."
    ssh-keygen -t ed25519 -C "devbybas@gmail.com" -f "$KEY_PATH" -N ""
fi

# Configure SSH
if ! grep -q "github.com-devbybas" ~/.ssh/config 2>/dev/null; then
    cat >> ~/.ssh/config <<SSHCONFIG

# devbybas-ai GitHub (builtbybas)
Host github.com-devbybas
    HostName github.com
    User git
    IdentityFile $KEY_PATH
    IdentitiesOnly yes
SSHCONFIG
    chmod 600 ~/.ssh/config
fi

echo ""
echo "============================================"
echo " SSH key generated!"
echo "============================================"
echo ""
echo "Add this public key to GitHub:"
echo "  https://github.com/settings/ssh/new"
echo ""
cat "${KEY_PATH}.pub"
echo ""
echo "After adding to GitHub, test with:"
echo "  ssh -T github.com-devbybas"
echo ""
