import { s3 } from "bun";

const config = {
  CONCURRENCY: 20,
  GLOB_PATTERN: "../**/*.png",
  UPLOAD_LOG: "uploaded.json",
  SAVE_INTERVAL: 100,
} as const;

let uploaded: Set<string>;
try {
  const data = await Bun.file(config.UPLOAD_LOG).json();
  uploaded = new Set(data);
  console.log(`Loaded upload log with ${uploaded.size} entries.`);
} catch {
  uploaded = new Set();
  console.log("No existing upload log found. Starting fresh.");
}

const glob = new Bun.Glob(config.GLOB_PATTERN);
const allPaths = [...glob.scanSync()];

console.log(`Found ${allPaths.length} files to upload.`);

let uploadCount = 0;
const startTime = Date.now();

async function saveLog() {
  await Bun.write(config.UPLOAD_LOG, JSON.stringify([...uploaded]));
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function logProgress() {
  const elapsed = (Date.now() - startTime) / 1000;
  const speed = uploaded.size / Math.max(elapsed, 1);
  const remaining = allPaths.length - uploaded.size;
  const eta = remaining / Math.max(speed, 0.01);

  process.stdout.write(
    `\rUploaded ${uploaded.size}/${allPaths.length} | ${speed.toFixed(2)} files/s | ETA ${formatTime(eta)}`,
  );
}

async function upload(localPath: string) {
  const key = localPath.replace("../", "");
  if (uploaded.has(key)) {
    return;
  }
  try {
    const localFile = Bun.file(localPath);
    const metadata = s3.file(key, {
      type: "image/png",
    });
    await metadata.write(localFile);
    uploaded.add(key);
    uploadCount++;

    if (uploadCount % 10 === 0 || uploaded.size === allPaths.length)
      logProgress();
    if (
      uploadCount % config.SAVE_INTERVAL === 0 ||
      uploaded.size === allPaths.length
    )
      await saveLog();
  } catch {
    console.error(`Failed to upload: ${key}`);
  }
}

async function run() {
  let index = 0;
  const workers = Array.from({ length: config.CONCURRENCY }, async () => {
    while (true) {
      const i = index++;
      if (i >= allPaths.length) break;
      const path = allPaths[i];
      if (path) await upload(path);
    }
  });

  await Promise.all(workers);
}

await run();
console.log("Upload process completed.");
