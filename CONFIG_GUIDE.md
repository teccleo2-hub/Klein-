# FLEKO-X BOT - Configuration Guide

This guide explains how to configure your FLEKO-X BOT using environment variables or the `config.js` file.

## 🛠️ Environment Variables

For Heroku deployment, set these variables in the **Settings > Config Vars** section of your Heroku dashboard.

| Variable | Description | Default |
|----------|-------------|---------|
| `PREFIX` | Command prefix | `.` |
| `MODE` | Bot mode (`public` or `private`) | `public` |
| `BOT_NAME` | Name of your bot | `FLEKO-X BOT` |
| `OWNER_NAME` | Your name | `Not Set!` |
| `OWNER_NUMBER` | Your WhatsApp number (with country code) | `254758301051` |
| `TIMEZONE` | Your local timezone | `Africa/Nairobi` |
| `ALWAYSONLINE` | Keep bot status as online (`ON`/`OFF`) | `ON` |
| `AUTOBIO` | Auto-update bot bio (`ON`/`OFF`) | `OFF` |
| `ANTICALL` | Reject incoming calls (`ON`/`OFF`) | `OFF` |
| `ANTIDELETE` | Detect deleted messages (`all`/`private`/`off`) | `private` |
| `ANTIEDIT` | Detect edited messages (`all`/`private`/`off`) | `private` |
| `WATERMARK` | Custom watermark for responses | `©FLEKO-X 🔥` |

## ⚙️ Advanced Configuration (`config.js`)

You can also modify the `config.js` file directly for more granular control.

### Automation Settings
- `autotype`: Set to `true` to show "typing..." when the bot is processing.
- `autoread`: Set to `true` to automatically mark messages as read.
- `autorecord`: Options are `all`, `private`, `group`, or `off`.

### Anti-Features
- `statusantidelete`: Set to `true` to detect when someone deletes their status.
- `autoblock`: Set to `true` to automatically block users who call the bot.

### Branding
- `statusemoji`: A list of emojis used for status reactions.
- `menustyle`: Choose between different menu layouts (1, 2, or 3).
- `packname` & `author`: Custom names for sticker packs.

## 🔑 Session ID

The `SESSION_ID` is crucial for maintaining your bot's connection. You can generate it using:
```bash
npm run generate-session
```
Once generated, set the `SESSION_ID` environment variable on Heroku to keep your bot logged in.
