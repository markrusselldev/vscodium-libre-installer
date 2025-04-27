# VSCodium Libre Installer CLI

A cross-platform Node.js CLI to bulk-install VS Code Marketplace extensions into VSCodium (or VS Code).

## Setup

1. **Clone or copy** this folder (one-time):
    ```
    git clone https://github.com/markrusselldev/vscodium-libre-installer.git
    cd vscodium-libre-installer
    ```
2. **Install dependencies**:
    ```
    npm install axios node-cron
    ```
3. **Make the script executable** (Unix/macOS only):
    ```
    chmod +x index.js
    ```

## Configuration

Edit `extensions.list` and list one `publisher.extension` ID per line.  
Lines beginning with `#` or blank lines are ignored.

## Usage

1. **Run the installer** to download & install (or update) every extension in `extensions.list`:
    ```
    node index.js
    ```
   or via npm script:
    ```
    npm run install-ext
    ```
2. **Reload VSCodium** (Ctrl + Shift + P → “Reload Window”) to load new extensions.

## Optional: Weekly Auto-Update via PM2

Use PM2 to run `index.js` as a background process and keep it alive across reboots:

1. **Install PM2** (one-time):
    ```
    npm install -g pm2
    ```
2. **Start the process** under PM2:
    ```
    cd /path/to/vscodium-libre-installer
    pm2 start index.js --name vscodium-libre-installer
    ```
3. **Freeze process list on reboot**:
    ```
    pm2 save
    ```
4. **Enable PM2 at startup**:
    ```
    pm2 startup
    ```
   Follow the printed command (e.g. `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user`).
5. **Verify running processes**:
    ```
    pm2 ls
    ```
6. **View logs**:
    ```
    pm2 logs vscodium-libre-installer
    ```
7. **Remove PM2 startup entry** (if needed):
    ```
    pm2 unstartup systemd
    ```

---

*If any installed extensions require extra configuration (API keys, etc.), see their individual documentation.*  
