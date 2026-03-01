/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: "builtbybas",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      cwd: "/var/www/builtbybas",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
