import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const jwt = process.argv[2];
if (!jwt) {
  console.error("Usage: node scripts/upload-assets.mjs <jwt>");
  process.exit(1);
}

const distDir = path.resolve(process.cwd(), 'dist');

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json':
    case '.webmanifest': return 'application/json';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.xml': return 'application/xml';
    case '.txt': return 'text/plain';
    default: return 'application/octet-stream';
  }
}

function getAllFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, base));
    } else {
      const relPath = '/' + path.relative(base, fullPath).replace(/\\/g, '/');
      files.push({ fullPath, relPath });
    }
  }
  return files;
}

async function main() {
  const files = getAllFiles(distDir);
  console.log(`Found ${files.length} files in dist/`);

  const manifest = {};
  const fileData = [];

  for (const { fullPath, relPath } of files) {
    const content = fs.readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(content).digest('hex');
    manifest[relPath] = hash;
    fileData.push({
      relPath,
      hash,
      base64: content.toString('base64'),
      mimeType: getMimeType(fullPath)
    });
  }

  const hashes = fileData.map(f => f.hash);
  console.log(`Checking missing hashes (${hashes.length})...`);

  const checkRes = await fetch('https://api.cloudflare.com/client/v4/pages/assets/check-missing', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hashes })
  });

  const checkData = await checkRes.json();
  if (!checkData.success) {
    throw new Error('Check missing failed: ' + JSON.stringify(checkData));
  }

  const missingHashes = new Set(checkData.result || []);
  console.log(`Missing hashes to upload: ${missingHashes.size}`);

  if (missingHashes.size > 0) {
    const payload = fileData
      .filter(f => missingHashes.has(f.hash))
      .map(f => ({
        key: f.hash,
        value: f.base64,
        metadata: { contentType: f.mimeType },
        base64: true
      }));

    console.log(`Uploading ${payload.length} assets...`);
    const uploadRes = await fetch('https://api.cloudflare.com/client/v4/pages/assets/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.success) {
      throw new Error('Upload assets failed: ' + JSON.stringify(uploadData));
    }
    console.log('Upload successful!');
  }

  console.log('Upserting hashes...');
  const upsertRes = await fetch('https://api.cloudflare.com/client/v4/pages/assets/upsert-hashes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ hashes })
  });
  const upsertData = await upsertRes.json();
  if (!upsertData.success) {
    throw new Error('Upsert hashes failed: ' + JSON.stringify(upsertData));
  }
  console.log('Hashes upserted!');

  fs.writeFileSync(
    path.join(distDir, '../manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Manifest written to manifest.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
