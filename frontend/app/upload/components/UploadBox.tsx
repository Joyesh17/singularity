"use client";

import { Dispatch, SetStateAction } from "react";

interface UploadBoxProps {
  selectedFile: File | null;
  loading: boolean;
  loadingText: string;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
}

export default function UploadBox({
  selectedFile,
  loading,
  loadingText,
  onFileChange,
  onUpload,
}: UploadBoxProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileChange(e.target.files[0]);
          }
        }}
        className="mb-6 block w-full text-sm text-gray-300"
      />

      {selectedFile && (
        <div className="mb-6 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4">
          <p className="text-sm text-cyan-200">
            Selected: {selectedFile.name}
          </p>
        </div>
      )}

      <button
        onClick={onUpload}
        disabled={loading}
        className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? loadingText : "Upload & Scan"}
      </button>
    </div>
  );
}
