'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import Image from 'next/image';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: 'partner-profiles' | 'member-profiles' | 'offers' | 'general';
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  folder = 'general',
  maxSizeMB = 5,
  className = '',
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        return;
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload to backend
        const response = await apiClient.post(`/upload/image?folder=${folder}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { url } = response.data.data;
        onChange(url);
        setPreview(url);
        toast.success('Image uploaded successfully');
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to upload image';
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxSizeMB, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
            ${isUploading ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, WebP up to {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

