/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: "builtbybas",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      cwd: "/var/www/builtbybas",
      instances: 1,
      // Note: switching to cluster mode requires an external rate limiter
      // (e.g., Redis) since in-memory rate limiting is per-process.
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
