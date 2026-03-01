#!/bin/bash
# ============================================================
# BuiltByBas — PostgreSQL Database Setup
# Run as root after setup-vps.sh
# Usage: bash setup-db.sh
# ============================================================

set -euo pipefail

DB_NAME="builtbybas"
DB_USER="builtbybas"

echo "============================================"
echo " PostgreSQL Database Setup"
echo "============================================"
echo ""

# Generate a random password
DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)

# Create user and database
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '${DB_USER}') THEN
        CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
    END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo ""
echo "============================================"
echo " Database created!"
echo "============================================"
echo ""
echo "  Database:  ${DB_NAME}"
echo "  User:      ${DB_USER}"
echo "  Password:  ${DB_PASS}"
echo ""
echo "  CONNECTION STRING (add to .env.production):"
echo "  DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
echo ""
echo "  IMPORTANT: Save this password! It won't be shown again."
echo ""
