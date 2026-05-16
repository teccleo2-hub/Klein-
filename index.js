/**
 * FLEKO-X BOT - WhatsApp Bot with Session Management
 * Main entry point for the bot
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  isJidGroup,
  isJidBroadcast,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const config = require("./config");
const moment = require("moment");
const { proto } = require("@whiskeysockets/baileys");
const { exec } = require("child_process");

require("dotenv").config();

// Initialize Express for health checks and session management
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger configuration
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        singleLine: false,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  },
  pino.destination()
);

// Global bot state
let sock = null;
let sessionId = process.env.SESSION_ID || uuidv4();

// Set timezone
process.env.TZ = config.timezone;
let botInfo = {
  // Add new bot configuration properties
  prefix: config.prefix,
  mode: config.mode,
  autobio: config.autobio,
  anticall: config.anticall,
  chatbot: config.chatbot,
  antibug: config.antibug,
  autotype: config.autotype,
  autoread: config.autoread,
  fontstyle: config.fontstyle,
  antiedit: config.antiedit,
  menustyle: config.menustyle,
  autoreact: config.autoreact,
  autoblock: config.autoblock,
  autorecord: config.autorecord,
  antidelete: config.antidelete,
  alwaysonline: config.alwaysonline,
  autoviewstatus: config.autoviewstatus,
  autoreactstatus: config.autoreactstatus,
  autorecordtype: config.autorecordtype,
  statusantidelete: config.statusantidelete,
  ownername: config.ownername,
  ownernumber: config.ownernumber,
  statusemoji: config.statusemoji,
  watermark: config.watermark,
  author: config.author,
  packname: config.packname,
  timezone: config.timezone,
  menuimage: config.menuimage,
  anticallmsg: config.anticallmsg,
  warnLimit: config.warnLimit,
  goodbyemsg: config.goodbyemsg,
  welcomemsg: config.welcomemsg,
  allowedCodes: config.allowedCodes,
  antisticker: config.antisticker,
  antistickerkick: config.antistickerkick,
  antistickerwarn: config.antistickerwarn,

  sessionId: sessionId,
  status: "disconnected",
  startTime: new Date(),
  version: config.version,
  botName: config.botname,
};

// Session directory
const SESSION_DIR = path.join(__dirname, "sessions", sessionId);

/**
 * Initialize WhatsApp connection
 */
async function initializeBot() {
  try {
    logger.info(`${chalk.cyan("FLEKO-X BOT")} - Initializing...`);
    logger.info(`${chalk.yellow("Session ID:")} ${sessionId}`);

    // Create session directory if it doesn't exist
    await fs.ensureDir(SESSION_DIR);

    // Load or create authentication state
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    // Create socket connection
    sock = makeWASocket({
      auth: state,
      logger: logger,
      printQRInTerminal: !process.env.PAIRING_CODE,
      markOnlineOnConnect: config.alwaysonline,
      browser: ["FLEKO-X BOT", "Safari", "1.0.0"],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      emitOwnEvents: true,
      defaultQueryTimeoutMs: 0,
    });

    // Pairing Code Logic
    if (process.env.PAIRING_CODE && !sock.authState.creds.registered) {
      const phoneNumber = process.env.PHONE_NUMBER;
      if (phoneNumber) {
        setTimeout(async () => {
          let code = await sock.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join("-") || code;
          logger.info(chalk.green(`Pairing Code: ${code}`));
        }, 3000);
      } else {
        logger.error(chalk.red("PHONE_NUMBER is required for pairing code."));
      }
    }

    // Handle credentials update
    sock.ev.on("creds.update", saveCreds);

    // Handle connection updates
    sock.ev.on("connection.update", async (update) => {
      if (config.autobio) {
        await sock.updateProfileStatus(config.watermark);
      }
      if (config.autoviewstatus && update.status) {
        logger.info(chalk.cyan(`[AUTOVIEW STATUS] Viewing status from ${update.id}`));
        await sock.readMessages([update.key]);
      }
      if (config.autoreactstatus && update.status) {
        const emojis = config.statusemoji.split(",");
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        logger.info(chalk.magenta(`[AUTOREACT STATUS] Reacting with ${randomEmoji} to status from ${update.id}`));
        await sock.sendMessage(update.id, { react: { text: randomEmoji, key: update.key } }, { statusForward: true });
      }
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info(chalk.green("QR Code generated. Scan with WhatsApp to authenticate."));
      }

      if (connection === "connecting") {
        logger.info(chalk.yellow("Connecting to WhatsApp..."));
        botInfo.status = "connecting";
      }

      if (connection === "open") {
        logger.info(chalk.green("✓ Connected to WhatsApp successfully!"));
        botInfo.status = "connected";
        botInfo.connectedAt = new Date();

        // Send startup message to console
        const jid = sock.user.id;
        logger.info(chalk.green(`Bot JID: ${jid}`));
        logger.info(chalk.green(`Session ID: ${sessionId}`));
      }

      if (connection === "close") {
        botInfo.status = "disconnected";
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        logger.error(
          chalk.red(
            `Connection closed. Reason: ${lastDisconnect?.error?.output?.statusCode}`
          )
        );

        if (shouldReconnect) {
          logger.info(chalk.yellow("Attempting to reconnect..."));
          setTimeout(() => initializeBot(), 3000);
        } else {
          logger.error(chalk.red("Bot logged out. Please generate a new session."));
          process.exit(0);
        }
      }
    });

    // Handle incoming messages
    sock.ev.on("messages.upsert", async (m) => {
      const message = m.messages[0];
      
      // Anti-Delete Logic
      if (message.message?.protocolMessage?.type === proto.Message.ProtocolMessage.Type.MESSAGE_DELETE && config.antidelete !== "off") {
        const deletedKey = message.message.protocolMessage.key;
        const from = deletedKey.remoteJid;
        const isGroup = isJidGroup(from);
        
        if (config.antidelete === "all" || (config.antidelete === "private" && !isGroup) || (config.antidelete === "group" && isGroup)) {
          logger.info(chalk.red(`[ANTIDELETE] Message deleted in ${from}`));
          await sock.sendMessage(from, { text: `🚨 *Anti-Delete:* A message was deleted here!` }, { quoted: message });
        }
      }

      // Anti-Edit Logic
      if (message.message?.protocolMessage?.type === proto.Message.ProtocolMessage.Type.MESSAGE_EDIT && config.antiedit !== "off") {
        const editedKey = message.message.protocolMessage.key;
        const from = editedKey.remoteJid;
        const isGroup = isJidGroup(from);
        
        if (config.antiedit === "all" || (config.antiedit === "private" && !isGroup) || (config.antiedit === "group" && isGroup)) {
          logger.info(chalk.blue(`[ANTIEDIT] Message edited in ${from}`));
          await sock.sendMessage(from, { text: `🚨 *Anti-Edit:* A message was edited here!` }, { quoted: message });
        }
      }

      // Chatbot Logic
      if (config.chatbot && !message.key.fromMe) {
        const from = message.key.remoteJid;
        // Simple chatbot response for now, can be expanded with AI
        await sock.sendMessage(from, { text: "🤖 *FLEKO-X Chatbot:* I'm currently in auto-reply mode. How can I help you?" }, { quoted: message });
      }

      // Anti-Bug Logic
      if (config.antibug) {
        const messageContent = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        if (messageContent.length > 5000 || messageContent.includes("\u200b")) {
          logger.warn(chalk.red(`[ANTIBUG] Potential bug message detected from ${message.key.remoteJid}`));
          await sock.sendMessage(message.key.remoteJid, { text: "🚨 *Anti-Bug:* Malicious message detected and blocked." });
          return; // Stop processing this message
        }
      }

      // Anti-Sticker Logic
      if (message.message?.stickerMessage) {
        const from = message.key.remoteJid;
        const isGroup = isJidGroup(from);
        if (config.antisticker === "on" || (config.antisticker === "group" && isGroup)) {
          logger.info(chalk.yellow(`[ANTISTICKER] Sticker detected in ${from}`));
          if (config.antistickerkick && isGroup) {
            await sock.groupParticipantsUpdate(from, [message.key.participant], "remove");
          } else if (config.antistickerwarn) {
            await sock.sendMessage(from, { text: "⚠️ *Anti-Sticker:* Stickers are not allowed here!" }, { quoted: message });
          }
        }
      }

      if (config.autotype) {
        await sock.sendPresenceUpdate("composing", m.messages[0].key.remoteJid);
      }
      if (config.autoread) {
        await sock.readMessages([m.messages[0].key]);
      }
      if (config.autorecord === "all" || (config.autorecord === "private" && !isJidGroup(m.messages[0].key.remoteJid)) || (config.autorecord === "group" && isJidGroup(m.messages[0].key.remoteJid))) {
        await sock.sendPresenceUpdate("recording", m.messages[0].key.remoteJid);
      }
      try {
        const message = m.messages[0];

        if (!message.message) return;
                if (message.key.fromMe && config.mode === "private") return;
        if (!message.key.fromMe && config.mode === "private" && !config.ownernumber.includes(sender.split("@")[0])) return;
        if (message.key.remoteJid === "status@broadcast") return;

        const from = message.key.remoteJid;
        const isGroup = isJidGroup(from);
        const isBroadcast = isJidBroadcast(from);

        // Extract message content
        const messageType = Object.keys(message.message)[0];
        let messageContent = "";

        if (messageType === "conversation") {
          messageContent = message.message.conversation;
        } else if (messageType === "extendedTextMessage") {
          messageContent = message.message.extendedTextMessage.text;
        }

        const sender = message.key.participant || from;
        const timestamp = moment(message.messageTimestamp * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        logger.info(
          `${chalk.cyan("[MESSAGE]")} From: ${sender} | Type: ${isGroup ? "GROUP" : "PRIVATE"} | Content: ${messageContent.substring(0, 50)}`
        );

        // Handle commands
                if (messageContent.startsWith(config.prefix)) {
          await handleCommand(sock, message, messageContent, from, sender);
        }
      } catch (error) {
        logger.error(chalk.red(`Error processing message: ${error.message}`));
      }
    });

    // Handle group updates
    sock.ev.on("groups.update", async (updates) => {
      if (config.statusantidelete) {
        for (const update of updates) {
          if (update.status) {
            logger.info(chalk.red(`[STATUS ANTIDELETE] Status update detected: ${update.id}`));
            // Logic to handle deleted status, e.g., re-uploading or notifying
          }
        }
      }
      for (const update of updates) {
        logger.info(
          chalk.blue(
            `Group Update: ${update.id} - ${JSON.stringify(update.announce)}`
          )
        );
      }
    });

    // Handle participant updates
    sock.ev.on("group-participants.update", async (update) => {
      if (update.action === "add" && config.welcomemsg) {
        await sock.sendMessage(update.id, { text: config.welcomemsg });
      }
      if (update.action === "remove" && config.goodbyemsg) {
        await sock.sendMessage(update.id, { text: config.goodbyemsg });
      }
    });

    // Handle incoming calls
    sock.ev.on("call", async (call) => {
      if (config.anticall && call.status === "ringing") {
        logger.warn(chalk.yellow(`[ANTICALL] Incoming call from ${call.from}`));
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, { text: config.anticallmsg });
        if (config.autoblock) {
          await sock.updateBlockStatus(call.from, "block");
          logger.info(chalk.red(`[AUTOBLOCK] Blocked ${call.from} due to call.`));
        }
      }
    });
  } catch (error) {
    logger.error(chalk.red(`Failed to initialize bot: ${error.message}`));
    setTimeout(() => initializeBot(), 3000);
  }
}

/**
 * Handle bot commands
 */
async function handleCommand(sock, message, messageContent, from, sender) {
  try {
        const args = messageContent.slice(config.prefix.length).split(" ");
    const command = args[0].toLowerCase();

    logger.info(chalk.magenta(`Command received: ${command}`));

    switch (command) {
      case "ping":
        await sock.sendMessage(from, {
          text: "🏓 Pong! Bot is online.",
        });
        break;

      case "help":
        const helpText = `
╔══════════════════════════════════════╗
║     ${config.botname} - HELP MENU          ║
╚══════════════════════════════════════╝

📋 *Core Commands:*
${config.prefix}ping - Check if bot is online
${config.prefix}help - Show this help menu
${config.prefix}info - Get bot information
${config.prefix}time - Get current time
${config.prefix}echo [text] - Echo your message
${config.prefix}status - Get bot status
${config.prefix}sessionid - Get current session ID

🎯 *Group Commands:*
${config.prefix}groupinfo - Get group information
${config.prefix}members - List group members
${config.prefix}kick [@user] - Kick a member
${config.prefix}promote [@user] - Promote to admin
${config.prefix}demote [@user] - Demote from admin

⚙️ *Settings:*
Mode: ${config.mode}
Prefix: ${config.prefix}
Always Online: ${config.alwaysonline ? "ON" : "OFF"}
Anti-Delete: ${config.antidelete}
Anti-Call: ${config.anticall ? "ON" : "OFF"}

	💡 *Tips:*
	- Use @ to mention users
	- Commands are case-insensitive
	- Some commands require admin privileges
	
	*Session ID:*
	${sessionId}
	
	*Watermark:* ${config.watermark}
	*Version:* ${config.version}
	        `;
        await sock.sendMessage(from, { text: helpText });
        break;

      case "info":
        const infoText = `
╔══════════════════════════════════════╗
║     ${config.botname} - BOT INFO           ║
╚══════════════════════════════════════╝

🤖 *Bot Name:* ${config.botname}
👤 *Owner:* ${config.ownername}
📞 *Owner Number:* ${config.ownernumber}
📌 *Version:* ${config.version}
🔑 *Session ID:* ${sessionId}
📊 *Status:* ${botInfo.status}
⏰ *Started:* ${botInfo.startTime.toLocaleString()}
🌍 *Timezone:* ${config.timezone}
${botInfo.connectedAt ? `✅ *Connected:* ${botInfo.connectedAt.toLocaleString()}` : ""}

🛠️ *Active Features:*
- Anti-Delete: ${config.antidelete}
- Anti-Edit: ${config.antiedit}
- Anti-Call: ${config.anticall ? "ON" : "OFF"}
- Auto-Read: ${config.autoread ? "ON" : "OFF"}
- Always Online: ${config.alwaysonline ? "ON" : "OFF"}
        `;
        await sock.sendMessage(from, { text: infoText });
        break;

      case "time":
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        await sock.sendMessage(from, {
          text: `⏰ Current Time: ${currentTime}`,
        });
        break;

      case "echo":
        const echoText = args.slice(1).join(" ");
        if (echoText) {
          await sock.sendMessage(from, { text: `🔊 ${echoText}` });
        } else {
          await sock.sendMessage(from, {
            text: "❌ Please provide text to echo. Usage: !echo [text]",
          });
        }
        break;

      case "status":
        const statusText = `
╔══════════════════════════════════════╗
║     FLEKO-X BOT - STATUS             ║
╚══════════════════════════════════════╝

🔌 Connection Status: ${botInfo.status}
📱 Bot JID: ${sock.user?.id || "Not connected"}
🕐 Uptime: ${getUptime()}
🔑 Session ID: ${sessionId}
        `;
        await sock.sendMessage(from, { text: statusText });
        break;

      case "sessionid":
        await sock.sendMessage(from, {
          text: `🔑 Your Session ID:\n\n${sessionId}\n\nKeep this safe!`,
        });
        break;

      case "groupinfo":
        if (isJidGroup(from)) {
          const groupMetadata = await sock.groupMetadata(from);
          const groupInfoText = `
╔══════════════════════════════════════╗
║     GROUP INFORMATION                ║
╚══════════════════════════════════════╝

📛 Group Name: ${groupMetadata.subject}
👥 Members: ${groupMetadata.participants.length}
👤 Owner: ${groupMetadata.owner}
🔐 Restricted: ${groupMetadata.restrict ? "Yes" : "No"}
🔒 Announce: ${groupMetadata.announce ? "Yes" : "No"}
          `;
          await sock.sendMessage(from, { text: groupInfoText });
        } else {
          await sock.sendMessage(from, {
            text: "❌ This command only works in groups.",
          });
        }
        break;

      case "members":
        if (isJidGroup(from)) {
          const groupMetadata = await sock.groupMetadata(from);
          let membersList = "👥 Group Members:\n\n";
          groupMetadata.participants.forEach((participant, index) => {
            membersList += `${index + 1}. ${participant.id.split("@")[0]}\n`;
          });
          await sock.sendMessage(from, { text: membersList });
        } else {
          await sock.sendMessage(from, {
            text: "❌ This command only works in groups.",
          });
        }
        break;

      default:
        await sock.sendMessage(from, {
          text: `❌ Unknown command: ${command}\n\nType ${config.prefix}help for available commands.`,
        });
    }
  } catch (error) {
    logger.error(chalk.red(`Error handling command: ${error.message}`));
    await sock.sendMessage(from, {
      text: `❌ Error executing command: ${error.message}`,
    });
  }
}

/**
 * Get bot uptime
 */
function getUptime() {
  const uptime = moment.duration(moment() - moment(botInfo.startTime));
  return `${Math.floor(uptime.asDays())}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`;
}

/**
 * Express routes for health checks and session management
 */

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    botStatus: botInfo.status,
    sessionId: sessionId,
    uptime: getUptime(),
    timestamp: new Date(),
  });
});

// Bot info endpoint
app.get("/info", (req, res) => {
  res.json({
    botName: botInfo.botName,
    version: botInfo.version,
    sessionId: sessionId,
    status: botInfo.status,
    startTime: botInfo.startTime,
    connectedAt: botInfo.connectedAt,
    uptime: getUptime(),
  });
});

// Session ID endpoint
app.get("/session", (req, res) => {
  res.json({
    sessionId: sessionId,
    status: botInfo.status,
  });
});

// Generate session endpoint
app.post("/api/generate-session", async (req, res) => {
  try {
    const newSessionId = uuidv4();
    sessionId = newSessionId;
    botInfo.sessionId = newSessionId;
    
    logger.info(chalk.green(`New session generated: ${newSessionId}`));
    
    res.json({
      success: true,
      sessionId: newSessionId,
      message: "Session generated successfully. Set this as SESSION_ID in your environment variables."
    });
  } catch (error) {
    logger.error(chalk.red(`Error generating session: ${error.message}`));
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Generate pairing code endpoint
app.post("/api/generate-pairing", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const newSessionId = uuidv4();
    sessionId = newSessionId;
    botInfo.sessionId = newSessionId;

    // Initialize a temporary socket to get pairing code
    const sessionDir = path.join(__dirname, "sessions", newSessionId);
    await fs.ensureDir(sessionDir);
    const { state } = await useMultiFileAuthState(sessionDir);
    
    const tempSock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      browser: ["FLEKO-X BOT", "Safari", "1.0.0"],
    });

    let code = await tempSock.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;

    res.json({
      success: true,
      sessionId: newSessionId,
      pairingCode: code,
      message: "Pairing code generated. Enter it on your WhatsApp."
    });
  } catch (error) {
    logger.error(chalk.red(`Error generating pairing code: ${error.message}`));
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Root endpoint (serve HTML)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "FLEKO-X BOT - WhatsApp Bot API",
    version: botInfo.version,
    endpoints: {
      health: "/health",
      info: "/info",
      session: "/session",
      generateSession: "POST /api/generate-session"
    },
    sessionId: sessionId,
  });
});

/**
 * Start the application
 */
async function start() {
  try {
    // Initialize the bot
    await initializeBot();

    // Start Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(chalk.green(`✓ Server running on port ${PORT}`));
      logger.info(chalk.cyan(`FLEKO-X BOT is ready!`));
      logger.info(chalk.yellow(`Session ID: ${sessionId}`));
    });
  } catch (error) {
    logger.error(chalk.red(`Failed to start bot: ${error.message}`));
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info(chalk.yellow("Shutting down gracefully..."));
  if (sock) {
    await sock.end();
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info(chalk.yellow("Shutting down gracefully..."));
  if (sock) {
    await sock.end();
  }
  process.exit(0);
});

// Start the application
start().catch((error) => {
  logger.error(chalk.red(`Fatal error: ${error.message}`));
  process.exit(1);
});

module.exports = { sock, botInfo, sessionId };
