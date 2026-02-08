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

// Batch 3: remaining lib + contexts + image-storage
const files = [
  'lib/auth-context.tsx',
  'lib/series-context.tsx',
  'lib/indexeddb-storage.ts',
  'lib/image-storage.ts',
  'lib/firebase.ts',
  'lib/hooks.ts',
];

async function main() {
  if (!fs.existsSync(baseDir)) {
    await download(zipUrl, zipDest);
    execSync(`mkdir -p "${extractDir}"`);
    execSync(`unzip -o "${zipDest}" -d "${extractDir}"`);
  }

  for (const relPath of files) {
    const fullPath = path.join(baseDir, relPath);
    if (fs.existsSync(fullPath)) {
      console.log(`===FILE:${relPath}===`);
      console.log(fs.readFileSync(fullPath, 'utf-8'));
      console.log(`===ENDFILE===`);
    } else {
      console.log(`MISSING:${relPath}`);
    }
  }
}

main().catch(err => console.error('Error:', err));
