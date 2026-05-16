# FLEKO-X BOT - Quick Start Guide ⚡

Get your FLEKO-X BOT running in 5 minutes!

## 1️⃣ Prerequisites (2 minutes)

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check git version
git --version
```

## 2️⃣ Setup (1 minute)

```bash
# Navigate to project
cd FLEKO-X-BOT

# Install dependencies
npm install
```

## 3️⃣ Generate Session (1 minute)

```bash
# Generate your WhatsApp session
npm run generate-session
```

**What to do:**
1. Look for the QR code in terminal
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Copy the Session ID displayed

## 4️⃣ Configure (30 seconds)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your Session ID
# SESSION_ID=your-session-id-here
```

## 5️⃣ Run Locally (30 seconds)

```bash
# Start the bot
npm start

# You should see:
# ✓ Connected to WhatsApp successfully!
# ✓ Server running on port 3000
```

## 🧪 Test Your Bot

Send a message to your bot:
```
!help
```

You should get a help menu with all available commands.

## 🚀 Deploy to Heroku

### Quick Deploy (1 click)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/FLEKO-X-BOT)

### Manual Deploy (3 minutes)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set Session ID
heroku config:set SESSION_ID=your-session-id

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## 📱 Available Commands

| Command | Description |
|---------|-------------|
| `!ping` | Check if bot is online |
| `!help` | Show help menu |
| `!info` | Get bot information |
| `!status` | Get bot status |
| `!sessionid` | Get your session ID |
| `!time` | Get current time |
| `!echo [text]` | Echo text |

## 🔗 API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Bot info
curl http://localhost:3000/info

# Session info
curl http://localhost:3000/session
```

## ⚙️ Environment Variables

```env
SESSION_ID=your-session-id          # Required
PORT=3000                            # Optional
NODE_ENV=production                  # Optional
LOG_LEVEL=info                       # Optional
```

## 🐛 Troubleshooting

### Bot not connecting?
```bash
# Regenerate session
npm run generate-session

# Check if WhatsApp is logged in elsewhere
# Logout from other devices and try again
```

### QR code not showing?
```bash
# Try different terminal
# Or use web-based generator
```

### Heroku deployment fails?
```bash
# Check logs
heroku logs --tail

# Verify environment variables
heroku config

# Rebuild
git push heroku main --force
```

## 📚 Full Documentation

- **README.md** - Complete feature list and API documentation
- **DEPLOYMENT_GUIDE.md** - Detailed Heroku deployment guide
- **index.js** - Source code with inline comments

## 🎯 Next Steps

1. ✅ Test bot locally with `!help`
2. ✅ Customize commands in `index.js`
3. ✅ Deploy to Heroku
4. ✅ Share with friends
5. ✅ Extend with more features

## 💡 Tips

- **Keep Session ID safe** - Never share it publicly
- **Monitor logs** - Check `heroku logs --tail` regularly
- **Update dependencies** - Run `npm update` monthly
- **Backup session** - Save your session files
- **Test locally first** - Before deploying to Heroku

## 🆘 Need Help?

1. Check README.md for detailed docs
2. Review DEPLOYMENT_GUIDE.md for Heroku issues
3. Check logs: `heroku logs --tail`
4. Regenerate session ID if needed

## 🎉 You're All Set!

Your FLEKO-X BOT is now:
- ✅ Running locally
- ✅ Connected to WhatsApp
- ✅ Ready to deploy to Heroku
- ✅ Responding to commands

**Session ID**: [Your Session ID will appear after generation]

---

**Happy Botting! 🤖**

For more details, see README.md and DEPLOYMENT_GUIDE.md
