const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

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
        fs.unlinkSync(dest);
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// Skip these files (auto-generated, too large, or default)
const SKIP = new Set([
  'package-lock.json',
  'next-env.d.ts',
  'public/tv-series-manager-restore-backup.json',
]);

// Read specific files by comma-separated paths from FILES env var
const FILES_TO_READ = process.env.FILES ? process.env.FILES.split(',') : null;

async function main() {
  if (!fs.existsSync(baseDir)) {
    console.log('Downloading ZIP from GitHub...');
    await download(zipUrl, zipDest);
    console.log('Extracting...');
    execSync(`mkdir -p "${extractDir}"`);
    execSync(`unzip -o "${zipDest}" -d "${extractDir}"`);
  }

  if (FILES_TO_READ) {
    // Read specific files
    for (const relPath of FILES_TO_READ) {
      const fullPath = path.join(baseDir, relPath.trim());
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        console.log(`===FILE:${relPath.trim()}===`);
        console.log(content);
        console.log(`===END_FILE===`);
      } else {
        console.log(`MISSING: ${relPath}`);
      }
    }
  } else {
    // List all files
    const allFiles = execSync(`find "${baseDir}" -type f`).toString().trim().split('\n');
    const textFiles = allFiles.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.tsx', '.ts', '.css', '.mjs', '.js', '.json', '.svg', '.md', '.d.ts', '.webmanifest'].includes(ext);
    }).filter(f => !SKIP.has(f.replace(baseDir + '/', '')));
    
    for (const filePath of textFiles) {
      const relativePath = filePath.replace(baseDir + '/', '');
      const size = fs.statSync(filePath).size;
      console.log(`${relativePath} (${size})`);
    }
  }
}

main().catch(err => console.error('Error:', err));
