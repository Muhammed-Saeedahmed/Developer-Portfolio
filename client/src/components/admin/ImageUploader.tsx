import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, Check } from 'lucide-react';
import { adminApi, getAssetUrl } from '../../services/api';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = 'Upload Image',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await adminApi.uploadFile(file);
      if (res.success && res.fileUrl) {
        setPreview(res.fileUrl);
        onImageUploaded(res.fileUrl);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) {
      try {
        await adminApi.deleteUploadedFile(preview);
      } catch (e) {}
    }
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold">
          {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group border-2 border-dashed border-white/20 hover:border-[#00F5D4]/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05] overflow-hidden min-h-[140px]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif, application/pdf"
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden flex items-center justify-center bg-slate-950">
            <img
              src={getAssetUrl(preview)}
              alt="Uploaded preview"
              className="w-full h-full object-contain"
              onError={() => {
                // Keep clean fallback icon
              }}
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-[#00F5D4] text-slate-950 text-xs font-bold flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4 space-y-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-[#00F5D4] transition-colors">
              {isUploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#00F5D4]" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {isUploading ? 'Uploading file...' : 'Click or drag image here'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP or SVG (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
};
