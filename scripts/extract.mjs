import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import path from 'path';

const zipFile = '/vercel/share/v0-project/Ringmaster V0.1.zip';
const tmpDir = '/tmp/ringmaster-extract';

try {
  execSync(`mkdir -p "${tmpDir}"`);
  execSync(`unzip -o "${zipFile}" -d "${tmpDir}"`);
  
  // List what was extracted
  function listFiles(dir, prefix = '') {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}${item}/`);
        listFiles(fullPath, prefix + '  ');
      } else {
        console.log(`${prefix}${item}`);
      }
    }
  }
  
  console.log('Extracted contents:');
  listFiles(tmpDir);
} catch (err) {
  console.error('Error:', err.message);
}
