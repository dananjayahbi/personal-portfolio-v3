# Cloudinary credential checklist

Follow these steps to provision the Cloudinary values required by the admin console.

## 1. Create or log into your Cloudinary account
1. Visit [https://cloudinary.com/users/register](https://cloudinary.com/users/register) and sign up (the free tier is sufficient).
2. Verify your email address and log into the [Cloudinary Console](https://console.cloudinary.com/).

## 2. Locate your product environment
1. In the top-left of the console, select **Programmable Media**.
2. Ensure you are working in the correct **Product Environment** (defaults to `Cloudinary`).

## 3. Capture the core API credentials
1. Navigate to **Settings → Access Keys**.
2. Under **Account Details** make note of:
   - **Cloud name** → use for `CLOUDINARY_CLOUD_NAME`
   - **API Key** → use for `CLOUDINARY_API_KEY` and `NEXT_PUBLIC_CLOUDINARY_API_KEY`
   - Click **Generate new API Secret** (or reveal the existing one) → use for `CLOUDINARY_API_SECRET`
3. Store these values in your `.env.local` file. Never commit them to git.

## 4. Create an upload preset
1. Go to **Settings → Upload** within the console.
2. Scroll to **Upload Presets** and click **Add upload preset**.
3. Choose a meaningful name, e.g. `portfolio_signed_uploads`.
4. Under **Signing Mode**, choose **Signed** (required for secure uploads).
5. Optionally set a default **Folder** (e.g. `portfolio`).
6. Save the preset.
7. Use the preset name for **both** `CLOUDINARY_UPLOAD_PRESET` (server-side) and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (client-side) in your `.env.local`.
8. Copy your cloud name into `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` so the upload widget can initialise on the client.

## 5. Optional: Restrict upload behavior
To keep uploads organized, you can:
- Enable **Unique filename** to avoid collisions.
- Specify allowed formats under **Allowed formats** (e.g. `jpg,png,webp`).
- Configure automatic transformations if desired; these are optional for the admin console.

## 6. Verify your `.env.local`
Your file should include the following entries:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=portfolio_signed_uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_signed_uploads
```

Restart the Next.js dev server after editing environment variables so the new credentials are loaded.