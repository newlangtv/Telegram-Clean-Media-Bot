module.exports = {
  apps: [
    {
      name: "telegram-media-cleaner-bot",
      script: "./bot.js",
      watch: false,
      autorestart: true,
      restart_delay: 5000,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};