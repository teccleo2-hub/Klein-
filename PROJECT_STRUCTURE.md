# FLEKO-X BOT - Project Structure 📁

Complete overview of the FLEKO-X BOT project structure and file organization.

## Directory Tree

```
FLEKO-X-BOT/
├── index.js                      # Main bot application
├── package.json                  # Project dependencies and scripts
├── Procfile                      # Heroku process configuration
├── app.json                      # Heroku app configuration
├── runtime.txt                   # Node.js version specification
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
│
├── scripts/                      # Utility scripts
│   └── generateSession.js        # WhatsApp session generator
│
├── sessions/                     # Session data (auto-created)
│   └── [session-id]/
│       ├── creds.json           # Credentials
│       ├── pre-keys.json        # Pre-keys
│       ├── sender-keys.json     # Sender keys
│       └── app-state-sync.json  # App state
│
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick start guide
├── DEPLOYMENT_GUIDE.md           # Heroku deployment guide
├── FEATURES.md                   # Features documentation
├── CONFIG_GUIDE.md               # Configuration guide
├── PROJECT_STRUCTURE.md          # This file
│
└── node_modules/                 # Dependencies (auto-created)
    └── [packages]
```

## File Descriptions

### Core Application Files

**index.js**
- Main bot application entry point
- WhatsApp connection management
- Command handler implementation
- API endpoint definitions
- Message processing logic
- Session management
- Error handling and recovery

**package.json**
- Project metadata
- Dependency declarations
- NPM scripts configuration
- Node.js version requirements
- Project description and keywords

### Configuration Files

**Procfile**
- Heroku process type definition
- Specifies how to run the bot on Heroku
- Single line: `web: node index.js`

**app.json**
- Heroku app configuration
- Environment variable definitions
- Build pack specifications
- Deployment settings
- Add-on configurations

**runtime.txt**
- Node.js version specification for Heroku
- Format: `node-X.X.X`
- Ensures consistent runtime environment

**.env.example**
- Template for environment variables
- Shows all available configuration options
- Copy to `.env` and fill in values
- Never commit actual `.env` file

**.gitignore**
- Git ignore rules
- Excludes node_modules, sessions, .env
- Prevents accidental commits of sensitive data

### Documentation Files

**README.md**
- Main project documentation
- Feature overview
- Installation instructions
- Usage guide
- API documentation
- Deployment instructions
- Troubleshooting guide

**QUICKSTART.md**
- Fast-track setup guide
- 5-minute quick start
- Essential commands only
- Perfect for first-time users

**DEPLOYMENT_GUIDE.md**
- Detailed Heroku deployment guide
- Step-by-step instructions
- Multiple deployment options
- Troubleshooting section
- Monitoring and maintenance

**FEATURES.md**
- Complete feature documentation
- Command reference
- API endpoint details
- Advanced features
- Roadmap and future plans

**CONFIG_GUIDE.md**
- Configuration options
- Environment variables
- Advanced customization
- Performance tuning
- Security configuration

**PROJECT_STRUCTURE.md**
- This file
- Project organization overview
- File descriptions
- Directory purposes

### Scripts

**scripts/generateSession.js**
- Interactive session ID generator
- QR code generation
- Credential storage
- Session information display
- Error handling

### Runtime Directories

**sessions/** (Auto-created)
- Stores WhatsApp session data
- One subdirectory per session ID
- Contains authentication credentials
- Never commit to version control

**node_modules/** (Auto-created)
- NPM package dependencies
- Created by `npm install`
- Never commit to version control

## File Organization Logic

### By Purpose

**Application Logic**
- `index.js` - Main application

**Configuration**
- `package.json` - Dependencies
- `.env.example` - Environment template
- `app.json` - Heroku config
- `Procfile` - Process definition
- `runtime.txt` - Runtime version

**Deployment**
- `Procfile` - Heroku process
- `app.json` - Heroku configuration
- `runtime.txt` - Node.js version

**Documentation**
- `README.md` - Main docs
- `QUICKSTART.md` - Quick start
- `DEPLOYMENT_GUIDE.md` - Deployment
- `FEATURES.md` - Features
- `CONFIG_GUIDE.md` - Configuration
- `PROJECT_STRUCTURE.md` - Structure

**Utilities**
- `scripts/generateSession.js` - Session generator

**Version Control**
- `.gitignore` - Ignore rules

### By Audience

**For New Users**
- `QUICKSTART.md` - Start here
- `README.md` - Full documentation

**For Developers**
- `index.js` - Source code
- `CONFIG_GUIDE.md` - Configuration
- `FEATURES.md` - Feature details

**For DevOps/Deployment**
- `DEPLOYMENT_GUIDE.md` - Deployment
- `app.json` - Heroku config
- `Procfile` - Process definition

**For Maintainers**
- `README.md` - Overview
- `CONFIG_GUIDE.md` - Configuration
- All documentation files

## File Sizes and Purposes

| File | Size | Purpose |
|------|------|---------|
| index.js | ~12KB | Main application |
| package.json | ~1KB | Dependencies |
| README.md | ~15KB | Documentation |
| DEPLOYMENT_GUIDE.md | ~20KB | Deployment guide |
| FEATURES.md | ~15KB | Features list |
| CONFIG_GUIDE.md | ~12KB | Configuration |
| QUICKSTART.md | ~3KB | Quick start |
| scripts/generateSession.js | ~4KB | Session generator |
| app.json | ~2KB | Heroku config |
| .env.example | ~0.5KB | Environment template |

## Dependencies Structure

### Direct Dependencies

**@whiskeysockets/baileys**
- WhatsApp Web API wrapper
- Core bot functionality

**express**
- Web framework
- API endpoints

**pino**
- Logging library
- Structured logging

**dotenv**
- Environment variable management

**qrcode-terminal**
- QR code display in terminal

**uuid**
- Unique ID generation

**moment**
- Date/time manipulation

**axios**
- HTTP client (future use)

**fs-extra**
- File system utilities

**chalk**
- Terminal color output

### Development Dependencies

**nodemon**
- Auto-reload on file changes
- Development only

## Configuration Hierarchy

```
Environment Variables (.env)
         ↓
Environment Defaults (in code)
         ↓
Heroku Config Vars
         ↓
app.json defaults
         ↓
Final Configuration
```

## Session Data Structure

```
sessions/
└── [UUID]/
    ├── creds.json              # Main credentials
    ├── pre-keys.json           # Pre-shared keys
    ├── sender-keys.json        # Sender keys
    ├── app-state-sync.json     # App state
    ├── signal-store/           # Signal protocol store
    │   ├── keys.json
    │   ├── pre-keys.json
    │   └── sender-keys.json
    └── [other files]
```

## Build Artifacts

When deployed to Heroku:

```
.git/                  # Git repository
node_modules/          # Installed dependencies
sessions/              # Session data
.env                   # Environment variables (Heroku only)
```

## Development Workflow

```
Local Development:
  ├── Edit code
  ├── npm install (if needed)
  ├── npm run generate-session (if needed)
  ├── npm start (or npm run dev)
  └── Test locally

Version Control:
  ├── git add .
  ├── git commit -m "message"
  └── git push origin main

Heroku Deployment:
  ├── git push heroku main
  ├── Heroku builds
  ├── npm install (on Heroku)
  ├── npm start (on Heroku)
  └── Bot runs on Heroku
```

## Important Notes

### Files to Never Commit

- `.env` - Contains sensitive data
- `sessions/` - Contains authentication credentials
- `node_modules/` - Generated by npm
- `.DS_Store` - macOS system file
- `*.log` - Log files

### Files That Must Be Committed

- `index.js` - Application code
- `package.json` - Dependencies list
- `package-lock.json` - Dependency lock
- `.env.example` - Configuration template
- All `.md` files - Documentation
- `Procfile` - Deployment config
- `app.json` - Heroku config
- `.gitignore` - Ignore rules

### Directory Permissions

```bash
# Sessions directory should be readable/writable
chmod 700 sessions/

# Credential files should be restricted
chmod 600 sessions/*/creds.json
```

## Scaling Considerations

### Single Instance

```
FLEKO-X-BOT/
└── Single bot instance
    └── Single session
        └── Single Heroku dyno
```

### Multiple Instances

```
FLEKO-X-BOT-1/  (Session ID 1)
FLEKO-X-BOT-2/  (Session ID 2)
FLEKO-X-BOT-3/  (Session ID 3)
```

Each with its own:
- Repository
- Session ID
- Heroku app
- Environment variables

## Backup Strategy

### Essential Files to Backup

1. Session files (`sessions/`)
2. Custom code modifications
3. Environment configuration
4. Database backups (if applicable)

### Backup Locations

```
Backup/
├── sessions-backup-[date].tar.gz
├── config-backup-[date].txt
└── database-backup-[date].sql
```

## Performance Considerations

### File I/O

- Session files: ~1-2MB per session
- Logs: ~10-50MB per month
- Total disk space: ~100MB per instance

### Memory Usage

- Node.js base: ~30MB
- Bot runtime: ~50-100MB
- Total: ~80-130MB

### Network

- WhatsApp connection: ~1-5Mbps
- API requests: <100KB per request
- Session sync: ~5-10MB per day

## Maintenance Tasks

### Daily

- Monitor logs
- Check health endpoints
- Verify bot connectivity

### Weekly

- Review error logs
- Check resource usage
- Update dependencies if needed

### Monthly

- Backup session files
- Review and optimize code
- Update documentation

### Quarterly

- Security audit
- Performance review
- Dependency updates

## Documentation Map

```
Getting Started:
  ├── QUICKSTART.md (5 min read)
  └── README.md (15 min read)

Deployment:
  └── DEPLOYMENT_GUIDE.md (20 min read)

Configuration:
  ├── CONFIG_GUIDE.md (15 min read)
  └── .env.example (reference)

Features:
  └── FEATURES.md (20 min read)

Project Info:
  └── PROJECT_STRUCTURE.md (this file)
```

---

**Version**: 1.0.0
**Last Updated**: January 2024
**Project Status**: Active Development

For more information, see README.md or QUICKSTART.md
