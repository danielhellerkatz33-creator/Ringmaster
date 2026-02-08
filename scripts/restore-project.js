const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const zipUrl = 'https://raw.githubusercontent.com/danielhellerkatz33-creator/Ringmaster/main/Ringmaster%20V0.1.zip';
const zipDest = '/tmp/ringmaster.zip';
const extractDir = '/tmp/ringmaster';
const baseDir = '/tmp/ringmaster/Ringmaster V0.1';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch(e) {}
      reject(err);
    });
  });
}

// Accept comma-separated relative paths via FILES env var
const FILES = process.env.FILES ? process.env.FILES.split('|') : [];

async function main() {
  if (!fs.existsSync(baseDir)) {
    console.log('Downloading ZIP from GitHub...');
    await download(zipUrl, zipDest);
    console.log('Extracting...');
    execSync(`mkdir -p "${extractDir}"`);
    execSync(`unzip -o "${zipDest}" -d "${extractDir}"`);
  }

  if (FILES.length === 0) {
    // List mode: output all files with sizes
    const allFiles = execSync(`find "${baseDir}" -type f`).toString().trim().split('\n');
    for (const f of allFiles) {
      const rel = f.replace(baseDir + '/', '');
      const size = fs.statSync(f).size;
      console.log(`${size}\t${rel}`);
    }
    return;
  }

  // Read mode: output requested files in plain text
  for (const relPath of FILES) {
    const trimmed = relPath.trim();
    const fullPath = path.join(baseDir, trimmed);
    if (fs.existsSync(fullPath)) {
      console.log(`===FILE:${trimmed}===`);
      console.log(fs.readFileSync(fullPath, 'utf-8'));
      console.log(`===ENDFILE===`);
    } else {
      console.log(`MISSING:${trimmed}`);
    }
  }
}

main().catch(err => console.error('Error:', err));
