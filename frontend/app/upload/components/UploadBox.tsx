"use client";

import { useEffect, useState } from "react";

/**
 * Constants
 */
const SUPPORTED_FILE_TYPE_PREFIX = "image/";
const FILE_TYPE_ERROR_MESSAGE =
  "Only image files are supported in MVP v1 (JPG, PNG, WEBP).";

/**
 * Props
 */
interface UploadBoxProps {
  selectedFile: File | null;
  loading: boolean;
  loadingText: string;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}

/**
 * Utility functions
 */
function isImageFile(file: File): boolean {
  return file.type.startsWith(SUPPORTED_FILE_TYPE_PREFIX);
}

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Component
 */
export default function UploadBox({
  selectedFile,
  loading,
  loadingText,
  onFileChange,
  onUpload,
}: UploadBoxProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Generate preview URL when file changes
   */
  useEffect(() => {
    if (selectedFile && isImageFile(selectedFile)) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(null);
  }, [selectedFile]);

  /**
   * Handle file selection (input or drag-drop)
   */
  function handleFileSelect(file: File) {
    if (!isImageFile(file)) {
      alert(FILE_TYPE_ERROR_MESSAGE);
      return;
    }

    onFileChange(file);
  }

  /**
   * Drag event handlers
   */
  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`rounded-3xl border p-8 shadow-xl transition-all ${
        isDragging
          ? "border-cyan-400 bg-cyan-400/20 shadow-cyan-500/20"
          : "border-white/10 bg-white/4"
      }`}
    >
      {/* Upload input */}
      <div className="mb-6">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-4">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-300">
              {isDragging
                ? "Drop your image here"
                : "Drag and drop your image here"}
            </p>

            <p className="text-xs text-gray-500">
              or click to browse
            </p>

            <p className="mt-1 text-xs text-gray-500">
              (Supported: JPG, PNG, WEBP)
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </label>
      </div>

      {/* Selected file info */}
      {selectedFile && (
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
          <p className="text-sm text-cyan-200">
            Selected: {selectedFile.name}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {/* Image preview */}
      {previewUrl && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
            Preview
          </p>

          <img
            src={previewUrl}
            alt="Selected image preview"
            className="h-auto max-h-96 w-full rounded-lg object-contain"
          />
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={onUpload}
        disabled={loading}
        className="w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? loadingText : "Upload & Scan Image"}
      </button>
    </div>
  );
}
