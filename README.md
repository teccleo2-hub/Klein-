# FLEKO-X BOT 🤖

A powerful, feature-rich WhatsApp bot built with Node.js and Baileys, designed for easy deployment on Heroku with complete session management support.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/FLEKO-X-BOT)

## 🚀 Automatic Deployment (Forking System)

To deploy your own instance of FLEKO-X BOT automatically:

1.  **Fork this Repository**: Click the "Fork" button at the top right of this page to create a copy of the repository in your own GitHub account.
2.  **Deploy to Heroku**: Click the "Deploy to Heroku" button above. Heroku will automatically connect to your forked repository.
3.  **Configure App**: Provide a unique app name and set the required environment variables (especially `SESSION_ID`).
4.  **Automatic Updates**: Any changes you push to your forked repository's `main` branch will be automatically deployed to Heroku.

## Features ✨

- **WhatsApp Integration**: Connect to WhatsApp Web using Baileys library
- **Session Management**: Unique session IDs for multiple bot instances
- **Command System**: Extensible command handler for easy feature addition
- **Group Management**: Full group control capabilities
- **Message Handling**: Support for text, media, and special message types
- **Health Monitoring**: Built-in health check endpoints
- **Heroku Ready**: One-click deployment with Heroku Button
- **Logging**: Comprehensive logging with Pino
- **Error Handling**: Robust error handling and reconnection logic

## Prerequisites 📋

- Node.js 18.x or higher
- npm or yarn
- Heroku account (for deployment)
- WhatsApp account
- Git (for version control)

## Installation 🚀

### Local Setup

1. **Clone the repository**
```bash
https://github.com/teccleo2-hub/Klein-
```

2. **Install dependencies**
```bash
npm install
```

3. **Generate a session ID**
```bash
npm run generate-session
```

This will:
- Display a QR code in your terminal
- Scan it with WhatsApp on your phone
- Generate a unique Session ID
- Save the session information

4. **Create .env file**
```bash
cp .env.example .env
```

Edit `.env` and add your Session ID:
```env
SESSION_ID=your-generated-session-id
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

5. **Start the bot locally**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Deployment on Heroku 🌐

### Option 1: Heroku Button (Easiest)

Click the button below to deploy directly to Heroku:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/FLEKO-X-BOT)

### Option 2: Manual Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create a new Heroku app**
```bash
heroku create your-app-name
```

4. **Add buildpack**
```bash
heroku buildpacks:add heroku/nodejs
```

5. **Set environment variables**
```bash
heroku config:set SESSION_ID=your-session-id
heroku config:set NODE_ENV=production
heroku config:set LOG_LEVEL=info
```

6. **Deploy**
```bash
git push heroku main
```

7. **View logs**
```bash
heroku logs --tail
```

### Option 3: GitHub Integration

1. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/FLEKO-X-BOT.git
git push -u origin main
```

2. **Connect Heroku to GitHub**
- Go to your Heroku app dashboard
- Click "Deploy" tab
- Select "GitHub" as deployment method
- Connect your GitHub account
- Select the repository
- Enable automatic deploys

3. **Set environment variables** in Heroku dashboard under "Config Vars"

## Bot Commands 💬

### General Commands
- `!ping` - Check if bot is online
- `!help` - Show help menu
- `!info` - Get bot information
- `!time` - Get current time
- `!echo [text]` - Echo your message
- `!status` - Get bot status
- `!sessionid` - Get current session ID

### Group Commands (Admin only)
- `!groupinfo` - Get group information
- `!members` - List group members
- `!kick [@user]` - Kick a member
- `!promote [@user]` - Promote to admin
- `!demote [@user]` - Demote from admin

## API Endpoints 🔌

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok",
  "botStatus": "connected",
  "sessionId": "your-session-id",
  "uptime": "0d 1h 30m 45s",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Bot Info
```
GET /info
```
Response:
```json
{
  "botName": "FLEKO-X BOT",
  "version": "1.0.0",
  "sessionId": "your-session-id",
  "status": "connected",
  "startTime": "2024-01-15T09:00:00.000Z",
  "connectedAt": "2024-01-15T09:00:30.000Z",
  "uptime": "0d 1h 30m 45s"
}
```

### Session Info
```
GET /session
```
Response:
```json
{
  "sessionId": "your-session-id",
  "status": "connected"
}
```

### Root
```
GET /
```

## Session Management 🔑

### Understanding Session IDs

A Session ID is a unique identifier that stores your WhatsApp authentication credentials. Each bot instance should have its own Session ID.

**Benefits:**
- Run multiple bot instances simultaneously
- Easy credential management
- Secure session isolation
- Simple migration between servers

### Generating Multiple Sessions

To run multiple bot instances:

1. Generate a new session for each instance
2. Create separate Heroku apps or use environment variables
3. Each bot will operate independently

### Session Storage

Sessions are stored in the `sessions/` directory:
```
sessions/
├── your-session-id-1/
│   ├── creds.json
│   ├── pre-keys.json
│   └── ...
└── your-session-id-2/
    ├── creds.json
    ├── pre-keys.json
    └── ...
```

**Important**: Never commit session files to version control!

## Environment Variables 🔐

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SESSION_ID` | Your WhatsApp session ID | - | ✅ Yes |
| `PORT` | Server port | 3000 | ❌ No |
| `NODE_ENV` | Environment (development/production) | production | ❌ No |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | info | ❌ No |
| `BOT_NAME` | Bot display name | FLEKO-X BOT | ❌ No |

## Troubleshooting 🔧

### Bot not connecting
1. Verify your Session ID is correct
2. Check internet connection
3. Ensure WhatsApp account is not logged in elsewhere
4. Try generating a new session

### QR Code not displaying
1. Ensure terminal supports QR code display
2. Try running on a different terminal
3. Use the web-based session generator

### Heroku deployment fails
1. Check Heroku logs: `heroku logs --tail`
2. Verify all environment variables are set
3. Ensure Node.js version is compatible
4. Check available Heroku dyno hours

### Bot crashes frequently
1. Check logs for errors
2. Verify SESSION_ID is valid
3. Increase Heroku dyno size
4. Check WhatsApp API rate limits

## Extending the Bot 🛠️

### Adding Custom Commands

Edit `index.js` and add to the `handleCommand` function:

```javascript
case "mycommand":
  await sock.sendMessage(from, {
    text: "My custom response",
  });
  break;
```

### Adding Middleware

Create a new file `middleware/commandValidator.js`:

```javascript
module.exports = function validateCommand(message) {
  // Your validation logic
  return true;
};
```

### Database Integration

Install a database driver:
```bash
npm install mongoose
# or
npm install pg
```

Add connection logic in `index.js`.

## Performance Tips ⚡

1. **Use Heroku Eco dyno** for low-traffic bots
2. **Monitor logs** regularly for issues
3. **Set appropriate LOG_LEVEL** (info for production)
4. **Use session caching** for faster reconnects
5. **Implement rate limiting** for commands

## Security Considerations 🔒

1. **Never share your Session ID** publicly
2. **Use environment variables** for sensitive data
3. **Enable Heroku's SSL/TLS** for HTTPS
4. **Regularly rotate sessions** for security
5. **Monitor bot activity** for suspicious behavior
6. **Use strong Heroku passwords**
7. **Enable two-factor authentication** on accounts

## Monitoring & Logging 📊

### View Heroku Logs
```bash
# Real-time logs
heroku logs --tail
```

### Local Logging
Logs are displayed in the console with color coding:
- 🟢 Green: Success messages
- 🟡 Yellow: Warnings
- 🔴 Red: Errors
- 🔵 Blue: Info messages

## Contributing 🤝

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section
- Contact the development team

## Changelog 📝

### Version 1.0.0 (Initial Release)
- ✅ WhatsApp bot core functionality
- ✅ Session management system
- ✅ Command handler
- ✅ Group management features
- ✅ Heroku deployment support
- ✅ Health check endpoints
- ✅ Comprehensive logging

## Roadmap 🗺️

- [ ] Web dashboard for bot management
- [ ] Database integration for user data
- [ ] Advanced NLP capabilities
- [ ] Media file handling
- [ ] Scheduled message support
- [ ] Webhook integrations
- [ ] Multi-language support
- [ ] Admin panel UI

## Disclaimer ⚠️

This bot is for educational and authorized use only. Ensure you have proper authorization before deploying this bot. The developers are not responsible for misuse of this software.

---

**Made with ❤️ by FLEKO-X Development Team**

**Session ID**: Add your Session ID at the bottom of your .env file for reference

```
SESSION_ID_REFERENCE: [Your Session ID will be displayed here after generation]
```

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Active Development
