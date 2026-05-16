/**
 * FLEKO-X BOT - Configuration File
 * Centralized settings for the bot.
 */

const config = {
  // Core Bot Settings
  prefix: process.env.PREFIX || ".",
  mode: process.env.MODE || "public", // public or private
  botname: process.env.BOT_NAME || "FLEKO-X BOT",
  version: "1.1.0",
  timezone: process.env.TIMEZONE || "Africa/Nairobi",

  // Owner Information
  ownername: process.env.OWNER_NAME || "Not Set!",
  ownernumber: process.env.OWNER_NUMBER || "254758301051",

  // Automation Features
  autobio: process.env.AUTOBIO === "ON",
  autotype: process.env.AUTOTYPE === "ON",
  autoread: process.env.AUTOREAD === "ON",
  autoreact: process.env.AUTOREACT === "ON",
  autorecord: process.env.AUTORECORD || "all", // all, private, group, off
  alwaysonline: process.env.ALWAYSONLINE === "ON",
  autoviewstatus: process.env.AUTOVIEWSTATUS === "ON",
  autoreactstatus: process.env.AUTOREACTSTATUS === "ON",
  autorecordtype: process.env.AUTORECORDTYPE || "OFF", // audio, video, off

  // Anti-Features
  anticall: process.env.ANTICALL === "ON",
  anticallmsg: process.env.ANTICALL_MSG || "You are blocked for calling the bot!",
  antibug: process.env.ANTIBUG === "ON",
  antiedit: process.env.ANTIEDIT || "private", // all, private, off
  antidelete: process.env.ANTIDELETE || "private", // all, private, off
  statusantidelete: process.env.STATUSANTIDELETE === "ON",
  antisticker: process.env.ANTISTICKER === "ON",
  antistickerkick: process.env.ANTISTICKERKICK === "ON",
  antistickerwarn: process.env.ANTISTICKERWARN === "ON",
  autoblock: process.env.AUTOBLOCK === "ON",

  // Messaging & Branding
  watermark: process.env.WATERMARK || "©FLEKO-X 🔥",
  author: process.env.AUTHOR || "Y",
  packname: process.env.PACKNAME || "FLEKO",
  statusemoji: process.env.STATUS_EMOJI ? process.env.STATUS_EMOJI.split(",") : ["🧡", "💚", "🔥", "✨", "❤️", "🥰", "😎"],
  menuimage: process.env.MENU_IMAGE || "", // URL or path to image
  menustyle: process.env.MENU_STYLE || "2", // 1, 2, 3 (for different menu layouts)
  fontstyle: process.env.FONT_STYLE || "OFF", // on, off, or specific font style

  // Chatbot Integration
  chatbot: process.env.CHATBOT === "ON",

  // Warning System
  warnLimit: parseInt(process.env.WARN_LIMIT || "5"),
  warnings: process.env.WARNINGS || "{}", // JSON string

  // Welcome/Goodbye Messages
  welcomemsg: process.env.WELCOME_MSG || "",
  goodbyemsg: process.env.GOODBYE_MSG || "",

  // Other
  allowedCodes: process.env.ALLOWED_CODES || "", // Comma-separated country codes
  stickerAliases: process.env.STICKER_ALIASES || "{}", // JSON string
  bankInfo: process.env.BANK_INFO || "{}", // JSON string
};

module.exports = config;
