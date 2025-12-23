'use client';

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ManualImageUploadProps {
  label: string;
  name: string;
  defaultValue?: string;
  onFileSelect: (file: File | null) => void;
}

export function ManualImageUpload({ label, name, defaultValue, onFileSelect }: ManualImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(defaultValue || null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90">
        {label}
      </label>
      
      <input type="hidden" name={name} value={defaultValue || ""} />
      
      <div className="flex gap-4 items-start">
        {/* Preview */}
        {preview && (
          <div className="relative h-20 w-20 rounded-lg border border-white/10 bg-white/5 overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain p-2"
            />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <label className="flex flex-col items-center justify-center h-20 px-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all">
            <Upload className="h-5 w-5 text-white/60 mb-1" />
            <span className="text-xs text-white/60">
              {selectedFile ? selectedFile.name : 'Select image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Remove selected file
            </button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-white/40">
        Image will be uploaded when you click Save
      </p>
    </div>
  );
}
