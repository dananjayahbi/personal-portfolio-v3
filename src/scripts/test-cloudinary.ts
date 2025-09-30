import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";

const PROJECT_ROOT = path.resolve(process.cwd());
const ENV_FILES = [".env.local", ".env"]; // priority order

for (const file of ENV_FILES) {
  const target = path.join(PROJECT_ROOT, file);
  if (existsSync(target)) {
    loadEnv({ path: target, override: true });
  }
}

async function main() {
  const { cloudinaryClient, ensureCloudinaryEnv, getCloudinaryConfig, generateUploadSignature } = await import("../lib/cloudinary");
  ensureCloudinaryEnv();
  const config = getCloudinaryConfig();

  console.info("☁️  Cloudinary configuration loaded:");
  console.info(`- Cloud name: ${config.cloudName}`);
  console.info(`- Upload preset: ${config.uploadPreset}`);

  console.info("\n🔍 Verifying API connectivity with cloudinary.api.ping()…");
  const ping = await cloudinaryClient.api.ping();
  console.info("✅ API status:", ping.status);

  console.info("\n📝 Generating a signed upload signature for sanity check…");
  const signature = generateUploadSignature({ folder: "portfolio/test" });
  console.info(signature);

  console.info("\nAll checks passed. Try uploading via the admin console to fully confirm media handling.");
}

main().catch((error) => {
  console.error("❌ Cloudinary test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
