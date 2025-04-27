# VSCodium Libre Installer CLI

A cross-platform Node.js CLI to bulk-install VS Code Marketplace extensions into VSCodium (or VS Code).

## Setup

1. **Clone or copy** this folder (one-time):
   ```bash
   git clone https://github.com/markrusselldev/vscodium-libre-installer.git
   cd vscodium-libre-installer
   ```
2. **Install dependencies**:
   ```bash
   npm install axios
   ```
3. **Make the script executable** (Unix/macOS only):
   ```bash
   chmod +x index.js
   ```

## Configuration

Note: You need <publisher>.<extension-name> not the friendly name displayed next to the title.
Edit `extensions.list` and list one `publisher.extension` ID per line.  
Lines beginning with `#` or blank lines are ignored.
Find extensions: https://marketplace.visualstudio.com/VSCode

## Usage

1. **Run the installer** to download & install (or update) every extension in `extensions.list`:
   ```bash
   node index.js
   ```
   or via npm:
   ```bash
   npm run install-ext
   ```
2. **Reload VSCodium** (Ctrl + Shift + P → “Reload Window”) to load new extensions.

## Optional: Weekly Auto-Update via PM2

1. **Install PM2** (one-time):
   ```bash
   npm install -g pm2
   ```
2. **Start the process** under PM2 (adjust `/path/to/...` to your folder):
   ```bash
   cd /path/to/vscodium-libre-installer
   pm2 start index.js --name vscodium-libre-installer --cron "0 3 * * 1"
   ```
3. **Save process list for reboot**:
   ```bash
   pm2 save
   ```
4. **Enable PM2 at startup**:
   ```bash
   pm2 startup
   ```
   (Follow the printed command, e.g.  
   `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user`)
5. **Verify running processes**:
   ```bash
   pm2 ls
   ```

### Additional PM2 commands

- **View logs**:
  ```bash
  pm2 logs vscodium-libre-installer
  ```
- **Remove startup entry**:
  ```bash
  pm2 unstartup systemd
  ```
- **Change update schedule**:
  ```bash
  pm2 delete vscodium-libre-installer
  pm2 start index.js --name vscodium-libre-installer --cron "NEW_CRON_EXPRESSION"
  pm2 save
  ```

---

_If any installed extensions require extra configuration (API keys, etc.), see their individual documentation._
