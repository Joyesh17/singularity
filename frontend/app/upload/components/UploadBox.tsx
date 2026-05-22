"use client";

import { useState, useEffect } from "react";

interface UploadBoxProps {
  selectedFile: File | null;
  loading: boolean;
  loadingText: string;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}

const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

const isSupportedFile = (file: File): boolean => {
  const imageTypes = file.type.startsWith("image/");
  const videoTypes = file.type.startsWith("video/");
  const audioTypes = file.type.startsWith("audio/");
  return imageTypes || videoTypes || audioTypes;
};

export default function UploadBox({
  selectedFile,
  loading,
  loadingText,
  onFileChange,
  onUpload,
}: UploadBoxProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (selectedFile && isImageFile(selectedFile)) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    if (isSupportedFile(file)) {
      onFileChange(file);
    } else {
      alert("Please select an image, video, or audio file.");
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`rounded-3xl border p-8 shadow-xl transition-all ${
        isDragging
          ? "border-cyan-400 bg-cyan-400/20 shadow-cyan-500/20"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center gap-4 cursor-pointer">
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              {isDragging ? "Drop your file here" : "Drag and drop your file here"}
            </p>
            <p className="text-xs text-gray-500">or click to browse</p>
          </div>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
            accept="image/*,video/*,audio/*"
          />
        </label>
      </div>

      {selectedFile && (
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
          <p className="text-sm text-cyan-200">
            Selected: {selectedFile.name}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {previewUrl && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4 overflow-hidden">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">
            Preview
          </p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain rounded-lg"
          />
        </div>
      )}

      <button
        onClick={onUpload}
        disabled={loading}
        className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70 w-full"
      >
        {loading ? loadingText : "Upload & Scan"}
      </button>
    </div>
  );
}

