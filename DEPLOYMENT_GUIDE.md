# FLEKO-X BOT - Heroku Deployment Guide

This guide provides comprehensive instructions for deploying your FLEKO-X BOT to Heroku, a cloud platform that enables developers to build, run, and operate applications entirely in the cloud.

## Table of Contents
1.  [Prerequisites](#1-prerequisites)
2.  [Heroku Account Setup](#2-heroku-account-setup)
3.  [Deployment Methods](#3-deployment-methods)
    -   [Method 1: Deploy to Heroku Button (Recommended for beginners)](#method-1-deploy-to-heroku-button-recommended-for-beginners)
    -   [Method 2: Heroku CLI (Recommended for advanced users)](#method-2-heroku-cli-recommended-for-advanced-users)
4.  [Configuring Environment Variables](#4-configuring-environment-variables)
5.  [Generating and Setting Session ID](#5-generating-and-setting-session-id)
6.  [Monitoring Your Bot](#6-monitoring-your-bot)
7.  [Troubleshooting Common Issues](#7-troubleshooting-common-issues)
8.  [Updating Your Bot](#8-updating-your-bot)

## 1. Prerequisites
Before you begin, ensure you have the following:
-   A **Heroku Account**: Sign up at [Heroku.com](https://www.heroku.com/).
-   **Git**: Installed on your local machine. Download from [git-scm.com](https://git-scm.com/downloads).
-   **Heroku CLI**: Installed on your local machine. Follow the instructions at [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli).
-   **Node.js (v18 or higher)**: Installed on your local machine. Download from [nodejs.org](https://nodejs.org/en/download/).
-   **npm (v9 or higher)**: Usually comes with Node.js.
-   **WhatsApp Account**: An active WhatsApp account to link with your bot.

## 2. Heroku Account Setup
If you don't have a Heroku account, create one and verify your email. Once logged in, you can create a new app from your dashboard or via the Heroku CLI.

## 3. Deployment Methods

### Method 1: Deploy to Heroku Button (Recommended for beginners)
This is the easiest way to deploy your FLEKO-X BOT to Heroku.

1.  **Click the Deploy Button**: Locate the "Deploy to Heroku" button in the project's `README.md` (or if provided separately).
2.  **Configure App**: Heroku will redirect you to a page where you can:
    -   **App name**: Choose a unique name for your Heroku app.
    -   **Region**: Select a server region (e.g., United States or Europe).
    -   **Config Vars**: You will see pre-filled environment variables from `app.json`. You **must** provide a `SESSION_ID` here. If you don't have one yet, you can leave it as `your-session-id-here` for now and update it later (see [Generating and Setting Session ID](#5-generating-and-setting-session-id)).
3.  **Deploy App**: Click "Deploy app" at the bottom of the page. Heroku will then build and deploy your bot.
4.  **View App**: Once deployed, click "View app" to open your bot's web interface. This interface will allow you to generate a `SESSION_ID` if you haven't already.

### Method 2: Heroku CLI (Recommended for advanced users)
This method gives you more control over the deployment process.

1.  **Clone the Repository**: If you haven't already, clone the FLEKO-X BOT repository to your local machine:
    ```bash
    git clone https://github.com/yourusername/FLEKO-X-BOT.git
    cd FLEKO-X-BOT
    ```
    *(Note: Replace `https://github.com/yourusername/FLEKO-X-BOT.git` with the actual repository URL if it's different.)*

2.  **Log in to Heroku CLI**: Open your terminal and log in to your Heroku account:
    ```bash
    heroku login
    ```
    This will open a browser window for you to log in.

3.  **Create a Heroku App**: Create a new Heroku application. You can specify a name, or Heroku will generate one for you:
    ```bash
    heroku create your-app-name
    ```
    *(Replace `your-app-name` with your desired app name. This will also set up a Git remote for your Heroku app.)*

4.  **Set Buildpack**: Ensure the Node.js buildpack is set:
    ```bash
    heroku buildpacks:set heroku/nodejs
    ```

5.  **Configure Environment Variables**: Set the necessary environment variables. At a minimum, you need `SESSION_ID`. You can set others as needed (refer to `CONFIG_GUIDE.md` and `.env.example` for a full list):
    ```bash
    heroku config:set SESSION_ID="your-session-id-here"
    heroku config:set PREFIX="."
    heroku config:set BOT_NAME="FLEKO-X BOT"
    # Add other variables as needed
    ```
    *(You will generate the actual `SESSION_ID` in the next step.)*

6.  **Deploy the Code**: Push your local Git repository to Heroku:
    ```bash
    git push heroku main
    ```
    Heroku will detect the `Procfile` and `package.json` to build and start your application.

7.  **Open the App**: Once deployed, open your app in the browser:
    ```bash
    heroku open
    ```
    This will take you to the bot's web interface, which includes the session ID generator.

## 4. Configuring Environment Variables
Environment variables are crucial for customizing your bot and securing sensitive information. They are defined in `app.json` for Heroku deployments and can be managed via the Heroku dashboard or CLI.

**Key Variables to Configure:**
-   `SESSION_ID`: **(Required)** The unique identifier for your WhatsApp session. See [Generating and Setting Session ID](#5-generating-and-setting-session-id).
-   `PREFIX`: The command prefix for your bot (e.g., `.`, `!`).
-   `MODE`: `public` or `private`. In `private` mode, only the owner can use commands.
-   `BOT_NAME`: The name displayed for your bot.
-   `OWNER_NAME`: Your name as the bot owner.
-   `OWNER_NUMBER`: Your WhatsApp number (with country code, e.g., `254758301051`).
-   `TIMEZONE`: Your local timezone (e.g., `Africa/Nairobi`).
-   `ALWAYSONLINE`: Set to `ON` to keep the bot's WhatsApp status as online.
-   `AUTOBIO`: Set to `ON` to automatically update the bot's bio.
-   `ANTICALL`: Set to `ON` to reject incoming calls.
-   `ANTIDELETE`: `all`, `private`, or `off` to control anti-delete behavior.
-   `ANTIEDIT`: `all`, `private`, or `off` to control anti-edit behavior.
-   `WATERMARK`: Custom watermark for bot responses.

**How to set/update Config Vars on Heroku:**
-   **Via Dashboard**: Go to your Heroku app, then navigate to **Settings > Config Vars > Reveal Config Vars**. You can add, edit, or remove variables here.
-   **Via Heroku CLI**: Use `heroku config:set KEY=VALUE` (e.g., `heroku config:set SESSION_ID=your-new-session-id`).

## 5. Generating and Setting Session ID
The `SESSION_ID` is vital for your bot to connect to WhatsApp. It acts as an authentication token.

**Steps to Generate and Set Session ID:**

1.  **Access the Web Interface**: After deploying your bot to Heroku, open your app in a web browser (using `heroku open` or by clicking "View app" in the Heroku dashboard).
2.  **Click "Generate Session ID"**: On the web page, click the "Generate Session ID" button. The page will display a QR code.
3.  **Scan QR Code**: Open WhatsApp on your phone, go to **Linked Devices**, and scan the displayed QR code.
4.  **Copy Session ID**: Once authenticated, the generated `SESSION_ID` will be displayed on the web page. Copy this ID.
5.  **Set on Heroku**: Go to your Heroku app's **Settings > Config Vars** and update the `SESSION_ID` variable with the copied value. If you used the "Deploy to Heroku" button and left it as a placeholder, now is the time to update it.
6.  **Restart Dyno**: After updating the `SESSION_ID`, restart your Heroku dyno for the changes to take effect. You can do this from the Heroku dashboard (under **More > Restart all dynos**) or via CLI (`heroku restart`).

## 6. Monitoring Your Bot
Heroku provides several tools to monitor your bot's health and activity.

-   **Heroku Logs**: View real-time logs of your bot's activity:
    ```bash
    heroku logs --tail --app your-app-name
    ```
-   **Heroku Dashboard**: Check your app's status, resource usage, and logs directly from the Heroku dashboard.
-   **Health Check Endpoint**: Your bot exposes a `/health` endpoint. You can visit `https://your-app-name.herokuapp.com/health` to check its status.

## 7. Troubleshooting Common Issues
-   **Bot not connecting**: Ensure your `SESSION_ID` is correctly set and your phone has an active internet connection. Check Heroku logs for errors.
-   **Commands not working**: Verify the `PREFIX` environment variable is correctly set. Check bot `MODE` (public/private).
-   **Dyno crashes**: Review Heroku logs for error messages. Ensure all dependencies are correctly installed and `package.json` is valid.
-   **High memory usage**: Consider upgrading your Heroku dyno size or optimizing your bot's code for memory efficiency.

For more detailed troubleshooting, refer to the `TROUBLESHOOTING.md` file in the project.

## 8. Updating Your Bot
To update your bot with new features or bug fixes:

1.  **Pull Latest Changes**: Pull the latest code from the repository to your local machine:
    ```bash
    git pull origin main
    ```
2.  **Test Locally**: It's always recommended to test new changes locally before deploying to production.
3.  **Deploy to Heroku**: Push the updated code to your Heroku remote:
    ```bash
    git push heroku main
    ```
    Heroku will automatically rebuild and redeploy your application.

By following this guide, you should be able to successfully deploy and manage your FLEKO-X BOT on Heroku. If you encounter any issues, consult the provided documentation or seek assistance from the community.
