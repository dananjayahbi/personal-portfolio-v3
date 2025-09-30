'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { loginAction } from "../actions";
import { loginInitialState as initialState } from "../state";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? 'Signing in…' : label}
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
};

function Field({ label, name, type = 'text', autoComplete, error }: FieldProps) {
  return (
    <label className="group relative flex flex-col gap-2 text-sm font-medium text-white/80">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className={clsx(
          'w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-base text-white shadow-inner shadow-black/20 outline-none transition',
          'focus:border-white/40 focus:bg-white/20 focus:ring-2 focus:ring-white/20',
          error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
        )}
      />
      {error && <span className="text-xs font-normal text-red-300">{error}</span>}
    </label>
  );
}

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Admin Console</h1>
        <p className="text-sm text-white/60">
          Manage your portfolio projects, content, and settings from a single, secure dashboard.
        </p>
      </div>

      {notice && (
        <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />

      {state.status === 'error' && state.message && (
        <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </div>
      )}

      <SubmitButton label="Sign in" />

      <p className="text-center text-xs text-white/40">
        Default access: <span className="font-mono text-white/70">admin@test.com</span> /
        <span className="font-mono text-white/70"> admin</span>
      </p>
    </form>
  );
}
