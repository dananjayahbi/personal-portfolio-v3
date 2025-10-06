import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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

const TEST_DIR = path.join(PROJECT_ROOT, "src", "scripts", "test-image");
const TEST_IMAGE_PATH = path.join(TEST_DIR, "test.jpg");
const TEST_UPDATE_PATH = path.join(TEST_DIR, "test-update.jpg");

// 1x1 PNG pixels (base64). Despite .jpg extensions, Cloudinary detects format by content.
const BASE_IMAGE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5w/1kAAAAASUVORK5CYII=";
const UPDATED_IMAGE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/x8AAwMBAgKIVqEAAAAASUVORK5CYII=";

function ensureTestAssets() {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
  if (!existsSync(TEST_IMAGE_PATH)) {
    writeFileSync(TEST_IMAGE_PATH, Buffer.from(BASE_IMAGE, "base64"));
  }
  if (!existsSync(TEST_UPDATE_PATH)) {
    writeFileSync(TEST_UPDATE_PATH, Buffer.from(UPDATED_IMAGE, "base64"));
  }
}

async function main() {
  ensureTestAssets();

  const { cloudinaryClient, ensureCloudinaryEnv } = await import("../lib/cloudinary");
  ensureCloudinaryEnv();

  const folder = "portfolio/test-run";
  const publicId = `image-${Date.now()}`;

  console.info("☁️ Uploading initial image…");
  const uploadResult = await cloudinaryClient.uploader.upload(TEST_IMAGE_PATH, {
    folder,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });
  console.info("✅ Uploaded:", uploadResult.secure_url);

  console.info("\n🖊️ Updating image with new pixels…");
  const updateResult = await cloudinaryClient.uploader.upload(TEST_UPDATE_PATH, {
    public_id: uploadResult.public_id,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });
  console.info("✅ Updated. New version:", updateResult.secure_url);

  console.info("\n🗑️ Cleaning up uploaded asset…");
  const destroyResult = await cloudinaryClient.uploader.destroy(uploadResult.public_id, {
    invalidate: true,
    resource_type: "image",
  });
  console.info("✅ Destroy response:", destroyResult);

  console.info("\nAll image lifecycle checks finished.");
}

main().catch((error) => {
  console.error("❌ Cloudinary image lifecycle test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
