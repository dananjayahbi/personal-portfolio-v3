'use client';

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { changePassword, initialPasswordState, initialProfileState, updateProfile } from "../actions";
import { CloudinaryImageInput } from "@/components/common/cloudinary-image-input";

type ProfileDefaults = {
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

function TextInput({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  rows,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  error?: string;
  placeholder?: string;
  rows?: number;
  type?: string;
}) {
  const baseClass = clsx(
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
    error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? undefined}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue ?? undefined}
          placeholder={placeholder}
          type={type}
          className={baseClass}
        />
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-rose-500/50 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? 'Saving…' : label}
    </button>
  );
}

function PasswordButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? 'Updating…' : 'Update password'}
    </button>
  );
}

export function ProfilePanels({ defaults }: { defaults: ProfileDefaults }) {
  const [profileState, profileAction] = useActionState(updateProfile, initialProfileState);
  const [passwordState, passwordAction] = useActionState(changePassword, initialPasswordState);
  const [profileSuccess, setProfileSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (profileState.status === 'success' && profileState.message) {
      setProfileSuccess(profileState.message);
      const timeout = setTimeout(() => setProfileSuccess(undefined), 4000);
      return () => clearTimeout(timeout);
    }
    if (profileState.status === 'error') {
      setProfileSuccess(undefined);
    }
  }, [profileState]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
  <section className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
        <header className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Profile identity</h2>
          <p className="text-sm text-white/60">
            Update the name, bio, and avatar presented across the admin console and public portfolio.
          </p>
        </header>

        <form action={profileAction} className="flex flex-col gap-5">
          <TextInput
            label="Display name"
            name="name"
            defaultValue={defaults.name}
            error={profileState.fieldErrors?.name}
            placeholder="Ava Stone"
          />
          <TextInput
            label="Email"
            name="email"
            defaultValue={defaults.email}
            error={profileState.fieldErrors?.email}
            placeholder="ava@studio.com"
            type="email"
          />
          <CloudinaryImageInput
            label="Portrait / avatar"
            name="avatarUrl"
            defaultValue={defaults.avatarUrl ?? undefined}
            error={profileState.fieldErrors?.avatarUrl}
            hint="Square images work best."
            folder="portfolio/admin/avatar"
          />
          <TextInput
            label="Bio"
            name="bio"
            defaultValue={defaults.bio}
            error={profileState.fieldErrors?.bio}
            placeholder="Strategist and designer crafting soulful experiences."
            rows={6}
          />

          {profileState.status === 'error' && profileState.message && (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {profileState.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
            <span className="text-sm text-white/70">
              {profileSuccess ?? 'Refresh your profile to keep the brand voice consistent.'}
            </span>
            <SubmitButton label="Save profile" />
          </div>
        </form>
      </section>

  <section className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
        <header className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Security</h2>
          <p className="text-sm text-white/60">Reset your password. You’ll be asked to sign in again afterward.</p>
        </header>

        <form action={passwordAction} className="flex flex-col gap-4">
          <TextInput
            label="Current password"
            name="currentPassword"
            error={passwordState.fieldErrors?.currentPassword}
            type="password"
          />
          <TextInput
            label="New password"
            name="newPassword"
            error={passwordState.fieldErrors?.newPassword}
            type="password"
          />
          <TextInput
            label="Confirm new password"
            name="confirmPassword"
            error={passwordState.fieldErrors?.confirmPassword}
            type="password"
          />

          {passwordState.status === 'error' && passwordState.message && (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {passwordState.message}
            </div>
          )}

          <div className="flex justify-end">
            <PasswordButton />
          </div>
        </form>
      </section>
    </div>
  );
}
