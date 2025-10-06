'use client';

import { useFormStatus } from "react-dom";

export function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
