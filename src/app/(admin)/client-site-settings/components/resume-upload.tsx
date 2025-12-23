'use client';

import { useState, useActionState, useEffect } from "react";
import { Upload, FileText, Trash2, ExternalLink } from "lucide-react";
import { uploadResume, deleteResume, type ResumeUploadState } from "../actions";

const initialState: ResumeUploadState = { status: 'idle' };

interface ResumeUploadProps {
  currentResumeUrl?: string | null;
  legacyResumeUrl?: string | null;
}

export function ResumeUpload({ currentResumeUrl, legacyResumeUrl }: ResumeUploadProps) {
  const [uploadState, uploadAction] = useActionState(uploadResume, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | undefined>();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (uploadState.status === 'success' && uploadState.message) {
      setSuccess(uploadState.message);
      setSelectedFile(null);
      const timeout = setTimeout(() => setSuccess(undefined), 4000);
      return () => clearTimeout(timeout);
    }
    if (uploadState.status === 'error') {
      setSuccess(undefined);
    }
  }, [uploadState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type on client side as well
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only');
        e.target.value = ''; // Reset file input
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteResume();
      if (result.status === 'success') {
        setSuccess(result.message);
        setTimeout(() => setSuccess(undefined), 4000);
      } else {
        alert(result.message || 'Failed to delete resume');
      }
    } catch {
      alert('An error occurred while deleting the resume');
    } finally {
      setDeleting(false);
    }
  };

  const displayResumeUrl = currentResumeUrl || legacyResumeUrl;
  const isCloudinaryResume = !!currentResumeUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">Resume / CV Upload</h4>
        {displayResumeUrl && (
          <div className="flex items-center gap-2">
            <a
              href={displayResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View Current
            </a>
            {isCloudinaryResume && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Current Resume Info */}
      {displayResumeUrl && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-2">
            {isCloudinaryResume ? 'Current Resume (Hosted on Cloudinary)' : 'Current Resume (External Link)'}
          </p>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-cyan-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {displayResumeUrl.split('/').pop() || 'Resume'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {displayResumeUrl}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form action={uploadAction} className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="block">
            <span className="text-sm font-medium text-white mb-2 block">
              Upload New Resume (PDF Only)
            </span>
            <p className="text-xs text-white/60 mb-3">
              Only PDF format is accepted. Max size: 10MB
            </p>
            <div className="relative">
              <input
                type="file"
                name="resumeFile"
                accept=".pdf,application/pdf"
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

          {/* Preview of selected file */}
          {selectedFile && (
            <div className="mt-4">
              <p className="text-xs text-white/60 mb-2">Selected PDF</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <FileText className="h-6 w-6 text-cyan-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-white/60">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · PDF Document
                  </p>
                </div>
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
        
        {uploadState.status === 'error' && uploadState.message && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {uploadState.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </button>
      </form>

      {/* Note about legacy URL */}
      {!isCloudinaryResume && legacyResumeUrl && (
        <div className="rounded-xl border border-yellow-400/40 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-200">
          <p className="font-semibold mb-1">Note:</p>
          <p>
            You&apos;re currently using an external resume link. Upload a file to host it on Cloudinary for better performance and reliability.
          </p>
        </div>
      )}
    </div>
  );
}
