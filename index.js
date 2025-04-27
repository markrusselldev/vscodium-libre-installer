#!/usr/bin/env node

/**
 * VSIX Installer for VSCodium (cross-platform)
 */
import fs from "fs";
import path from "path";
import axios from "axios";
import { execSync } from "child_process";
import cron from "node-cron"; // ← our scheduler

// Detect CLI binary
const isWin = process.platform === "win32";
const CODE_CLI = isWin ? "codium.cmd" : "codium";

const CONFIG = "extensions.list";
const TMP_DIR = ".vsix_tmp";

// 1) The installer function
async function installExtensions() {
  if (!fs.existsSync(CONFIG)) {
    console.error(`❌ Missing ${CONFIG}`);
    process.exit(1);
  }
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

  const lines = fs
    .readFileSync(CONFIG, "utf-8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#"));

  console.log(`📦 Installing ${lines.length} extensions…`);
  const failures = [];

  for (const id of lines) {
    const [publisher, extension] = id.split(".");
    const vsixPath = path.join(TMP_DIR, `${publisher}-${extension}.vsix`);
    const url = `https://${publisher}.gallery.vsassets.io/_apis/public/gallery/` + `publisher/${publisher}/extension/${extension}/latest/` + `assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;

    process.stdout.write(`→ ${id}… `);
    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(vsixPath, res.data);
      execSync(`${CODE_CLI} --install-extension "${vsixPath}"`, { stdio: "ignore" });
      fs.unlinkSync(vsixPath);
      console.log("✅");
    } catch (err) {
      console.log("❌", err.response?.status || err.message);
      failures.push(id);
    }
  }

  fs.rmdirSync(TMP_DIR);
  if (failures.length) {
    console.error(`\n⚠️ Failed to install: ${failures.join(", ")}`);
    process.exit(1);
  } else {
    console.log("\n🎉 All extensions installed!");
  }
}

// 2) Run immediately on invocation
installExtensions().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

// 3) Schedule weekly update (Monday @ 03:00)
cron.schedule("0 3 * * 1", () => {
  console.log("🕒 Weekly extension update triggered by node-cron");
  installExtensions().catch(err => {
    console.error("Scheduled update failed:", err);
  });
});
