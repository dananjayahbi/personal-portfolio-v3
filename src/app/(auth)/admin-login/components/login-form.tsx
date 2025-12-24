'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { loginAction } from "../actions";
import { loginInitialState as initialState } from "../state";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={clsx(
        "group relative w-full rounded-xl px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-medium text-white transition-all duration-300",
        "bg-gradient-to-r from-blue-600 to-blue-500",
        "hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/25",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#030014]",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
      disabled={pending}
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            {label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  icon?: React.ReactNode;
};

function Field({ label, name, type = 'text', autoComplete, error, icon }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 sm:gap-2 text-sm">
      <span className="text-white/70 font-medium">{label}</span>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          className={clsx(
            'w-full rounded-xl border bg-white/5 py-3 sm:py-3.5 text-white placeholder-white/30 outline-none transition-all duration-200',
            icon ? 'pl-10 sm:pl-12 pr-4' : 'px-4',
            'focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20',
            error 
              ? 'border-red-500/50 bg-red-500/5 focus:border-red-500/50 focus:ring-red-500/20' 
              : 'border-white/10 hover:border-white/20'
          )}
        />
      </div>
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </label>
  );
}

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="relative flex flex-col gap-5 sm:gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-black/20"
    >
      {/* Subtle glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="hidden lg:block text-center mb-2">
          <h2 className="text-xl font-medium text-white">Welcome Back</h2>
          <p className="text-sm text-white/50 mt-1">Enter your credentials to continue</p>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-emerald-300 mt-4">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            {notice}
          </div>
        )}
      </div>

      <div className="relative space-y-4 sm:space-y-5">
        <Field
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          error={state.fieldErrors?.email}
          icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />}
        />
        
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          error={state.fieldErrors?.password}
          icon={<Lock className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />}
        />
      </div>

      {state.status === 'error' && state.message && (
        <div className="relative flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-300">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {state.message}
        </div>
      )}

      <div className="relative">
        <SubmitButton label="Sign In" />
      </div>
    </form>
  );
}
