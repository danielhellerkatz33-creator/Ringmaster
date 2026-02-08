const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
        file.close(); fs.unlinkSync(dest);
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

const BATCH = parseInt(process.env.BATCH || '0', 10);
const BATCH_SIZE = 8;

const SKIP = new Set([
  'package-lock.json', 'next-env.d.ts',
  'public/tv-series-manager-restore-backup.json',
]);

async function main() {
  if (!fs.existsSync(baseDir)) {
    await download(zipUrl, zipDest);
    execSync(`mkdir -p "${extractDir}"`);
    execSync(`unzip -o "${zipDest}" -d "${extractDir}"`);
  }

  const allFiles = execSync(`find "${baseDir}" -type f`).toString().trim().split('\n');
  const textFiles = allFiles.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.tsx','.ts','.css','.mjs','.js','.json','.svg','.md','.d.ts','.webmanifest'].includes(ext);
  }).filter(f => !SKIP.has(f.replace(baseDir + '/', ''))).sort();

  const start = BATCH * BATCH_SIZE;
  const batch = textFiles.slice(start, start + BATCH_SIZE);
  
  console.log(`BATCH ${BATCH}: ${start}-${start+batch.length-1} of ${textFiles.length}`);
  
  for (const filePath of batch) {
    const rel = filePath.replace(baseDir + '/', '');
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`\n===FILE:${rel}===`);
    console.log(content);
    console.log(`===END_FILE===`);
  }
}

main().catch(e => console.error(e));
