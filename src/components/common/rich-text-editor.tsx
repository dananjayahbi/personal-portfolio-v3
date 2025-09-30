'use client';

import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import clsx from "clsx";

type RichTextEditorProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
};

const TOOLBAR_ACTIONS = [
  { label: 'Bold', command: 'bold' },
  { label: 'Italic', command: 'italic' },
  { label: 'Underline', command: 'underline' },
  { label: 'Bullets', command: 'insertUnorderedList' },
] as const;

export function RichTextEditor({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    if ((value ?? '') !== currentHtml) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    const normalized = html === '<br>' ? '' : html;
    onChange(normalized);
  }, [onChange]);

  const handleToolbarAction = useCallback((command: string) => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof document === 'undefined' || !editorRef.current) return;
      editorRef.current.focus();
      if (!document.queryCommandSupported || document.queryCommandSupported(command)) {
        document.execCommand(command);
      }
      handleInput();
    };
  }, [handleInput]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && typeof document !== 'undefined') {
      // Ensure new paragraphs instead of divs
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, []);

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div className={clsx(
        'flex w-full flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 shadow-inner shadow-black/20',
        error && '!border-red-400/70 !bg-red-500/10'
      )}>
        <div className="flex flex-wrap gap-2">
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.command}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleToolbarAction(action.command)}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              {action.label}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          className={clsx(
            'relative min-h-[160px] whitespace-pre-wrap break-words rounded-lg border border-white/5 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30',
            !value && 'before:pointer-events-none before:absolute before:left-4 before:top-3 before:text-sm before:text-white/40 before:content-[attr(data-placeholder)]'
          )}
          contentEditable
          data-placeholder={placeholder}
          onInput={handleInput}
          onBlur={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
        />
        <input type="hidden" name={name} value={value} />
      </div>
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
