const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = 'YOUR_BOT_TOKEN_HERE';

const ALLOWED_GROUP_IDS = [
  -1001234567890,
  -1009876543210,
];

const IGNORED_CHANNEL_IDS = [
  -1001122334455,
  -1005544332211,
];

const ADMIN_IDS = [
  123456789,
  987654321,
];

const bot = new TelegramBot(token, { polling: true });

function isBeijingNightTime() {
  const now = new Date();
  const beijingHour = (now.getUTCHours() + 8) % 24;
  return beijingHour >= 0 && beijingHour < 8;
}

function getUserDisplayName(user) {
  if (!user) return 'Unknown';
  if (user.username) return `@${user.username}`;
  if (user.first_name || user.last_name)
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return `UserID:${user.id}`;
}

function containsCustomEmoji(msg) {
  if (!msg.entities) return false;
  return msg.entities.some(e => e.type === 'custom_emoji');
}

function logDeletion(chatId, messageId, mediaType, sender) {
  const timestamp = new Date().toISOString();
  const senderName = getUserDisplayName(sender);
  const senderId = sender?.id || 'Unknown';
  const logLine = `[${timestamp}] Deleted ${mediaType} in ChatID:${chatId}, MsgID:${messageId}, Sender:${senderName} (ID:${senderId})\n`;
  const logPath = path.join(__dirname, 'deleted_log.txt');

  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error('记录写入失败:', err.message);
  });

  for (const adminId of ADMIN_IDS) {
    bot.sendMessage(adminId, logLine).catch(err => {
      console.error(`发送给管理员 ${adminId} 失败:`, err.message);
    });
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (IGNORED_CHANNEL_IDS.includes(chatId)) return;
  if (!ALLOWED_GROUP_IDS.includes(chatId)) return;
  if (!isBeijingNightTime()) return;

  const messageId = msg.message_id;
  const sender = msg.from;

  const mediaType = msg.photo ? 'photo'
    : msg.video ? 'video'
    : msg.audio ? 'audio'
    : msg.voice ? 'voice'
    : msg.document ? 'document'
    : msg.sticker ? 'sticker'
    : containsCustomEmoji(msg) ? 'custom_emoji'
    : null;

  if (mediaType) {
    try {
      await bot.deleteMessage(chatId, messageId);
      console.log(`✅ 删除 ${mediaType}：${messageId}`);
      logDeletion(chatId, messageId, mediaType, sender);
    } catch (err) {
      console.error(`❌ 删除失败 ${messageId}:`, err.message);
    }
  }
});
