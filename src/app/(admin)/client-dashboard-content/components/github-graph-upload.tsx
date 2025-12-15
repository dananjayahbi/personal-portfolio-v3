'use client';

import { useState, useActionState, useEffect } from "react";
import Image from "next/image";
import { Upload, ImageIcon } from "lucide-react";
import { uploadGitHubGraph, type GitHubGraphState } from "../actions";

const initialState: GitHubGraphState = { status: 'idle' };

interface GitHubGraphUploadProps {
  currentGraphUrl?: string | null;
}

export function GitHubGraphUpload({ currentGraphUrl }: GitHubGraphUploadProps) {
  const [state, formAction] = useActionState(uploadGitHubGraph, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      setSuccess(state.message);
      setPreviewUrl(null);
      const timeout = setTimeout(() => setSuccess(undefined), 4000);
      return () => clearTimeout(timeout);
    }
    if (state.status === 'error') {
      setSuccess(undefined);
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">GitHub Contribution Graph</h4>
      </div>

      {/* Current Image Preview */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/60 mb-3">Current Graph</p>
        <div className="relative w-full h-auto min-h-[200px] flex items-center justify-center">
          {currentGraphUrl ? (
            <Image
              src={currentGraphUrl}
              alt="Current GitHub Contribution Graph"
              className="w-full h-auto rounded-lg"
              width={1200}
              height={400}
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <ImageIcon className="h-12 w-12 text-white/20" />
              <p className="text-sm text-white/40">No graph uploaded yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <form action={formAction} className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="block">
            <span className="text-sm font-medium text-white mb-2 block">Upload New Graph</span>
            <div className="relative">
              <input
                type="file"
                name="graphImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-white/70
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-cyan-500/10 file:text-cyan-400
                  hover:file:bg-cyan-500/20
                  file:cursor-pointer cursor-pointer"
              />
            </div>
          </label>

          {/* Preview of new upload */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-xs text-white/60 mb-2">Preview</p>
              <div className="relative w-full h-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            {success}
          </div>
        )}
        
        {state.status === 'error' && state.message && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {state.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!previewUrl}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          Upload Graph
        </button>
      </form>
    </div>
  );
}
