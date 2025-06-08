# Telegram 媒体清理机器人
---

## 项目简介

这是一个基于 Node.js 和 `node-telegram-bot-api` 库开发的 Telegram 机器人，功能是在指定的群组内，自动监控并在北京时间晚上 0 点到 8 点期间删除所有发送的媒体文件（包括照片、视频、音频、语音、文档、贴纸和自定义表情），并记录删除日志，同时将日志发送给多个管理员。

---

## 功能特点

- **定时删除**：仅在北京时间凌晨 0:00 到 8:00 期间自动删除指定类型的媒体消息。
- **群组白名单**：只处理特定群组内的消息，避免误删。
- **多管理员日志**：删除记录会同时发送给多个管理员。
- **详细日志**：包括发送者信息、消息ID、时间和删除的媒体类型。
- **支持多种媒体类型**：照片、视频、音频、语音、文档、贴纸和DIY表情。

---

## 环境准备

- Node.js v14 及以上版本
- npm
- Telegram Bot Token（通过 @BotFather 获取）

---

## 安装依赖

```bash
npm install node-telegram-bot-api
```

---

## 配置说明

在 bot.js 文件中，主要需要配置以下参数：

```bash
const token = 'YOUR_BOT_TOKEN_HERE';          // 替换成你的 Telegram Bot Token
const ALLOWED_GROUP_IDS = [                    // 允许处理的群组 ID 列表
  -1001234567890,
  -1009876543210,
];
const ADMIN_IDS = [                            // 多个管理员用户 ID，接收日志消息
  123456789,
  987654321,
];
```

---

## 运行方式

### 直接运行
```bash
node bot.js
```

### 使用 PM2 管理

- 安装 pm2（如未安装）
```bash
npm install -g pm2
```

- 使用示例的 ecosystem.config.js 启动
```bash
pm2 start
```

- 查看运行状态和日志
 ```bash
pm2 status
pm2 logs telegram-media-cleaner-bot
```
