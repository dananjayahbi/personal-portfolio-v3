'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";

type Props = {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  error?: string;
  folder?: string;
};

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
function extractUrl(result?: CloudinaryUploadWidgetResults | null) {
  if (!result || typeof result !== 'object') return undefined;
  const info = 'info' in result ? result.info : undefined;
  if (!info || typeof info !== 'object') return undefined;
  if ('secure_url' in info && typeof info.secure_url === 'string') {
    return info.secure_url;
  }
  if ('url' in info && typeof info.url === 'string') {
    return info.url;
  }
  return undefined;
}

function extractPublicId(result?: CloudinaryUploadWidgetResults | null) {
  if (!result || typeof result !== 'object') return undefined;
  const info = 'info' in result ? result.info : undefined;
  if (!info || typeof info !== 'object') return undefined;
  if ('public_id' in info && typeof info.public_id === 'string') {
    return info.public_id;
  }
  return undefined;
}

function derivePublicIdFromUrl(url?: string | null) {
  if (!url) return undefined;
  try {
    const marker = '/upload/';
    const index = url.indexOf(marker);
    if (index === -1) return undefined;
    const pathWithVersion = url.slice(index + marker.length);
    const path = pathWithVersion.replace(/^v\d+\//, '');
    const sanitized = path.split(/[?#]/)[0];
    if (!sanitized) return undefined;
    const lastDot = sanitized.lastIndexOf('.');
    return lastDot === -1 ? sanitized : sanitized.slice(0, lastDot);
  } catch (error) {
    console.warn('Unable to derive Cloudinary public id from url', error);
    return undefined;
  }
}

function unlockScroll() {
  if (typeof document === 'undefined') return;
  const targets = [document.body, document.documentElement];
  for (const target of targets) {
    if (!target) continue;
    target.style.removeProperty('overflow');
    target.style.removeProperty('position');
    target.style.removeProperty('width');
  }
  document.body?.classList.remove('cloudinary-upload-widget-open');
}

export function CloudinaryImageInput({ label, name, defaultValue, hint, error, folder }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [publicId, setPublicId] = useState<string | undefined>(() => derivePublicIdFromUrl(defaultValue));
  const [isRemoving, setIsRemoving] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'info' | 'error'; text: string } | undefined>();

  // Move useMemo before any conditional returns
  const widgetOptions = useMemo(() => {
    const options: Record<string, unknown> = { cloudName };
    if (folder) options.folder = folder;
    return options;
  }, [folder]);

  useEffect(() => {
    setValue(defaultValue ?? "");
    setPublicId(derivePublicIdFromUrl(defaultValue));
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, []);

  if (!uploadPreset || !cloudName) {
    const missing: string[] = [];
    if (!cloudName) missing.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!uploadPreset) missing.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');

    return (
      <div className="flex flex-col gap-2 text-sm text-white/70">
        <span className="font-medium text-white">{label}</span>
        <div className="rounded-xl border border-dashed border-red-400/60 bg-red-500/10 p-4 text-xs text-red-200">
          Cloudinary signed uploads require the following public environment variables:
          <div className="mt-2 flex flex-col gap-1 font-mono text-[11px]">
            {missing.map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
          Add them to your <code className="font-mono">.env.local</code>, restart the dev server, and reload this page.
        </div>
      </div>
    );
  }

  async function handleRemove() {
    if (!value) return;
    setActionMessage(undefined);
    if (!publicId) {
      setValue("");
      setPublicId(undefined);
      unlockScroll();
      return;
    }

    setIsRemoving(true);
    try {
      const response = await fetch('/api/cloudinary-destroy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, invalidate: true }),
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const payload = (await response.json()) as { result?: { result?: string } };
      const destroyResult = payload?.result?.result;
      if (destroyResult && destroyResult !== 'ok' && destroyResult !== 'not found') {
        throw new Error(`Unexpected destroy result: ${destroyResult}`);
      }

      setValue("");
      setPublicId(undefined);
      setActionMessage({ type: 'info', text: 'Image removed from Cloudinary.' });
    } catch (err) {
      console.error('Error removing Cloudinary asset', err);
      setActionMessage({ type: 'error', text: 'Could not delete the image from Cloudinary. Please try again.' });
    } finally {
      setIsRemoving(false);
      unlockScroll();
    }
  }

  function handleUploadSuccess(result: CloudinaryUploadWidgetResults) {
    const url = extractUrl(result);
    const newPublicId = extractPublicId(result) ?? derivePublicIdFromUrl(url ?? undefined);
    if (url) {
      setValue(url);
    }
    setPublicId(newPublicId);
    setActionMessage(undefined);
    unlockScroll();
  }

  function handleUploadFailure() {
    unlockScroll();
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60 shadow-inner shadow-black/20',
          error && '!border-red-400/70 !bg-red-500/10'
        )}
      >
        <input type="hidden" name={name} value={value} />
        <input type="hidden" name={`${name}PublicId`} value={publicId ?? ""} />
        {value ? (
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <Image src={value} alt={`${label} preview`} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-white/80">{value}</span>
              <div className="flex flex-wrap gap-2">
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary-signature"
                  uploadPreset={uploadPreset}
                  options={widgetOptions}
                  onSuccess={handleUploadSuccess}
                  onError={handleUploadFailure}
                  onClose={unlockScroll}
                  onQueuesEnd={unlockScroll}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Replace
                    </button>
                  )}
                </CldUploadWidget>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:border-red-400/60 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isRemoving}
                >
                  {isRemoving ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary-signature"
              uploadPreset={uploadPreset}
              options={widgetOptions}
              onSuccess={handleUploadSuccess}
              onError={handleUploadFailure}
              onClose={unlockScroll}
              onQueuesEnd={unlockScroll}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/40"
                >
                  Upload image
                </button>
              )}
            </CldUploadWidget>
            <p className="text-xs text-white/50">
              Drag and drop in the widget or browse your media library. Optimized URLs are saved back to the form automatically.
            </p>
          </div>
        )}
      </div>
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {actionMessage && (
        <span
          className={clsx(
            'text-xs',
            actionMessage.type === 'info' ? 'text-emerald-300' : 'text-red-300'
          )}
        >
          {actionMessage.text}
        </span>
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
