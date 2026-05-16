# FLEKO-X BOT - Troubleshooting Guide 🔧

Complete troubleshooting guide for common issues and their solutions.

## Common Issues

### Issue 1: Bot Not Connecting to WhatsApp

**Symptoms**
- Bot status shows "disconnected"
- No QR code appears
- Connection times out

**Solutions**

1. **Verify Session ID**
```bash
# Check if SESSION_ID is set
echo $SESSION_ID

# If empty, generate new session
npm run generate-session
```

2. **Check Internet Connection**
```bash
# Test connectivity
ping google.com

# Test WhatsApp servers
curl -I https://web.whatsapp.com
```

3. **Clear Session Files**
```bash
# Backup old session
mv sessions sessions-backup

# Generate new session
npm run generate-session
```

4. **Check WhatsApp Account Status**
- Ensure WhatsApp is not logged in elsewhere
- Logout from all other devices
- Wait 5 minutes before trying again

5. **Verify Node.js Version**
```bash
# Check version
node --version

# Should be 18.x or higher
```

### Issue 2: QR Code Not Displaying

**Symptoms**
- No QR code in terminal
- "QR code generated" message but nothing visible
- Terminal doesn't support graphics

**Solutions**

1. **Use Different Terminal**
   - Try a different terminal application
   - Some terminals don't support QR codes

2. **Enable Terminal Graphics**
```bash
# For Windows PowerShell
# Enable ANSI escape sequences
Set-ItemProperty HKCU:\Console VirtualTerminalLevel -Value 1
```

3. **Use Web-based Generator**
   - Create a web interface for session generation
   - Use browser-based QR code display

4. **Check Terminal Encoding**
```bash
# Verify UTF-8 support
echo $LANG

# Should include "UTF-8"
```

### Issue 3: Bot Crashes on Startup

**Symptoms**
- Process exits immediately
- Error messages in console
- No logs saved

**Solutions**

1. **Check Error Messages**
```bash
# Run with verbose logging
LOG_LEVEL=debug npm start

# Look for specific error messages
```

2. **Verify Environment Variables**
```bash
# Check .env file exists
ls -la .env

# Check required variables
cat .env | grep SESSION_ID
```

3. **Install Dependencies**
```bash
# Clear node_modules
rm -rf node_modules

# Reinstall
npm install
```

4. **Check Node.js Installation**
```bash
# Verify Node.js
node --version

# Verify npm
npm --version

# Check for corrupted installation
npm cache clean --force
```

### Issue 4: High Memory Usage

**Symptoms**
- Bot uses 500MB+ memory
- System becomes slow
- Heroku dyno crashes

**Solutions**

1. **Reduce Logging Level**
```env
LOG_LEVEL=warn
```

2. **Implement Memory Cleanup**
```javascript
// Add to index.js
setInterval(() => {
  if (global.gc) global.gc();
}, 60000); // Every minute
```

3. **Limit Message History**
```javascript
// In index.js
syncFullHistory: false,
```

4. **Monitor Memory Usage**
```bash
# Check memory on Heroku
heroku ps

# Check local memory
node --max-old-space-size=256 index.js
```

### Issue 5: Heroku Deployment Fails

**Symptoms**
- `git push heroku main` fails
- Build error messages
- Deployment gets stuck

**Solutions**

1. **Check Heroku Logs**
```bash
# View deployment logs
heroku logs --tail

# View build logs
heroku builds:log
```

2. **Verify Buildpack**
```bash
# Check buildpack
heroku buildpacks

# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs

# Clear build cache
heroku builds:cache:purge
```

3. **Check package.json**
```bash
# Verify syntax
cat package.json | head -20

# Ensure all dependencies are listed
npm ls
```

4. **Verify Procfile**
```bash
# Check Procfile content
cat Procfile

# Should contain: web: node index.js
```

5. **Clear and Redeploy**
```bash
# Force push
git push heroku main --force

# Restart app
heroku restart
```

### Issue 6: Commands Not Working

**Symptoms**
- Bot doesn't respond to commands
- Commands timeout
- No response in chat

**Solutions**

1. **Verify Command Format**
```
Correct: !help
Incorrect: ! help (space after !)
Incorrect: Help (no !)
```

2. **Check Bot Connection**
```bash
# Test health endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok",...}
```

3. **Review Logs**
```bash
# Check for command errors
heroku logs --tail | grep -i command

# Check for message errors
heroku logs --tail | grep -i error
```

4. **Test Simple Command**
```
Send: !ping
Expected: 🏓 Pong! Bot is online.
```

5. **Verify Message Format**
- Ensure message is text only
- Check for special characters
- Verify message length

### Issue 7: Session ID Not Saving

**Symptoms**
- Session ID not displayed after generation
- SESSION_ID.txt file not created
- Session lost after restart

**Solutions**

1. **Check File Permissions**
```bash
# Verify write permissions
ls -la | grep FLEKO

# Should show rwx for user
chmod 755 /home/ubuntu/FLEKO-X-BOT
```

2. **Check Disk Space**
```bash
# Check available space
df -h

# Should have at least 100MB free
```

3. **Verify Session Directory**
```bash
# Check sessions directory
ls -la sessions/

# Should have subdirectories with session IDs
```

4. **Manual Session ID Save**
```bash
# Create SESSION_ID.txt manually
echo "your-session-id" > SESSION_ID.txt
```

### Issue 8: Heroku App Sleeping

**Symptoms**
- Bot goes offline after 30 minutes
- Slow response times
- Connection drops frequently

**Solutions**

1. **Upgrade Dyno Type**
```bash
# Check current dyno
heroku ps

# Upgrade from free to eco
heroku ps:type eco
```

2. **Use Ping Service**
   - UptimeRobot
   - Pingdom
   - HealthChecks.io
   - Configure to ping `/health` endpoint every 25 minutes

3. **Implement Keep-Alive**
```javascript
// Add to index.js
setInterval(() => {
  logger.info('Keep-alive ping');
}, 25 * 60 * 1000); // Every 25 minutes
```

### Issue 9: Database Connection Errors

**Symptoms**
- "Cannot connect to database"
- Timeout errors
- Connection refused

**Solutions**

1. **Verify Database URL**
```bash
# Check database URL
heroku config:get DATABASE_URL

# Should be set if database addon installed
```

2. **Install Database Addon**
```bash
# For PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# For MongoDB
heroku addons:create mongolab:sandbox
```

3. **Test Connection**
```bash
# Test database connection
heroku run "node -e \"require('pg').Client\""
```

4. **Check Connection String**
```javascript
// Verify connection string in code
console.log(process.env.DATABASE_URL);
```

### Issue 10: Rate Limiting Issues

**Symptoms**
- "Too many requests" errors
- Messages not sending
- Commands getting blocked

**Solutions**

1. **Reduce Message Frequency**
```javascript
// Add delay between messages
await new Promise(r => setTimeout(r, 1000)); // 1 second delay
```

2. **Implement Message Queue**
```javascript
const queue = [];
async function sendMessage(to, message) {
  queue.push({ to, message });
  processQueue();
}
```

3. **Contact WhatsApp Support**
   - Request higher rate limits
   - Provide use case details
   - Wait for approval

4. **Use Batching**
```javascript
// Send messages in batches
const BATCH_SIZE = 10;
const BATCH_DELAY = 5000; // 5 seconds
```

## Diagnostic Commands

### Check Bot Status

```bash
# Local health check
curl http://localhost:3000/health

# Heroku health check
curl https://your-app-name.herokuapp.com/health

# Get bot info
curl http://localhost:3000/info

# Check session
curl http://localhost:3000/session
```

### View Logs

```bash
# Local logs (real-time)
npm start

# Heroku logs (real-time)
heroku logs --tail

# Heroku logs (last 100 lines)
heroku logs -n 100

# Filter logs
heroku logs --tail | grep error
heroku logs --tail | grep warning
```

### Check Resources

```bash
# Local memory usage
ps aux | grep node

# Heroku dyno status
heroku ps

# Heroku resource usage
heroku ps:type

# Disk space
df -h
```

### Verify Configuration

```bash
# Check environment variables
heroku config

# Check specific variable
heroku config:get SESSION_ID

# Check Node.js version
node --version

# Check npm version
npm --version
```

## Debug Mode

### Enable Debug Logging

```bash
# Set log level to debug
LOG_LEVEL=debug npm start

# Or on Heroku
heroku config:set LOG_LEVEL=debug
heroku restart
```

### Add Debug Statements

```javascript
// Add to index.js
logger.debug('Debug message:', variable);
logger.debug('Message object:', JSON.stringify(message, null, 2));
```

### Monitor in Real-time

```bash
# Watch logs continuously
watch -n 1 'heroku logs --tail'

# Or use tail
heroku logs --tail | tee debug.log
```

## Performance Diagnostics

### Check Response Time

```bash
# Measure command response
time curl http://localhost:3000/health

# Should be < 100ms
```

### Monitor CPU Usage

```bash
# Local CPU monitoring
top -p $(pgrep -f "node index.js")

# Heroku CPU (via metrics)
heroku metrics
```

### Check Memory Leaks

```bash
# Monitor memory over time
watch -n 5 'ps aux | grep node | grep -v grep'

# Should remain relatively stable
```

## Recovery Procedures

### Restart Bot

```bash
# Local restart
# Press Ctrl+C then run: npm start

# Heroku restart
heroku restart

# Heroku restart specific dyno
heroku restart web.1
```

### Reset Session

```bash
# Generate new session
npm run generate-session

# Update environment variable
heroku config:set SESSION_ID=new-session-id

# Restart app
heroku restart
```

### Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Clear Heroku build cache
heroku builds:cache:purge

# Rebuild app
git push heroku main --force
```

### Rollback Deployment

```bash
# View release history
heroku releases

# Rollback to previous version
heroku releases:rollback

# Or rollback to specific version
heroku releases:rollback v42
```

## Getting Help

### Information to Provide

When reporting issues, include:

1. **Error Message**
   - Full error text
   - Stack trace if available

2. **Environment**
   - Node.js version
   - npm version
   - OS (Windows/Mac/Linux)

3. **Configuration**
   - Bot version
   - Baileys version
   - Deployment platform

4. **Logs**
   - Last 50 lines of logs
   - Error logs specifically

5. **Steps to Reproduce**
   - Exact steps to trigger issue
   - Expected vs actual behavior

### Resources

- GitHub Issues: Report bugs
- Documentation: Check README.md
- Logs: Review application logs
- Community: Ask in forums

## Preventive Maintenance

### Regular Checks

**Daily**
- Monitor logs for errors
- Check health endpoints
- Verify bot connectivity

**Weekly**
- Review error logs
- Check resource usage
- Test critical commands

**Monthly**
- Update dependencies
- Review security
- Backup session files

**Quarterly**
- Full system audit
- Performance review
- Dependency updates

### Backup Strategy

```bash
# Backup session files
tar -czf backup-$(date +%Y%m%d).tar.gz sessions/

# Backup configuration
heroku config > config-backup.txt

# Store backups safely
# Keep at least 3 recent backups
```

---

**Version**: 1.0.0
**Last Updated**: January 2024

For more help, see README.md or DEPLOYMENT_GUIDE.md
