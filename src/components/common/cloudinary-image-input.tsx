'use client';

import { useEffect, useState } from "react";
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
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

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

export function CloudinaryImageInput({ label, name, defaultValue, hint, error, folder }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  if (!uploadPreset || !cloudName || !apiKey) {
    const missing: string[] = [];
    if (!cloudName) missing.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    if (!uploadPreset) missing.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
    if (!apiKey) missing.push('NEXT_PUBLIC_CLOUDINARY_API_KEY');

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
                  options={{ folder, cloudName, apiKey }}
                  onSuccess={(result) => {
                    const url = extractUrl(result);
                    if (url) setValue(url);
                  }}
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
                  onClick={() => setValue("")}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:border-red-400/60"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary-signature"
              uploadPreset={uploadPreset}
              options={{ folder, cloudName, apiKey }}
              onSuccess={(result) => {
                const url = extractUrl(result);
                if (url) setValue(url);
              }}
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
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
