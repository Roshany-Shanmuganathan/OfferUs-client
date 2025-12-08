'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  disabled?: boolean;
}

export function ImageUploader({ value, onChange, folder, disabled }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    handleUpload(file);
  };

  const handleUpload = async (file?: File) => {
    const fileToUpload = file || fileInputRef.current?.files?.[0];
    if (!fileToUpload) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', fileToUpload);

      const response = await apiClient.post<{
        success: boolean;
        data: { url: string; public_id: string };
      }>(`/upload/image?folder=${folder}`, formData);

      if (response.data.success && response.data.data.url) {
        const imageUrl = response.data.data.url;
        onChange(imageUrl);
        toast.success('Image uploaded successfully');
        // Clear file input after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Failed to upload image. Please try again.');
        // Reset preview on error
        if (value) {
          setPreview(value);
        } else {
          setPreview(null);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to upload image';
      toast.error(errorMessage);
      // Reset preview on error
      if (value) {
        setPreview(value);
      } else {
        setPreview(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
            <Image
              src={preview}
              alt="Image preview"
              fill
              className="object-cover"
              unoptimized={preview.startsWith('data:')}
              onError={() => {
                console.error('Failed to load image:', preview);
                setPreview(null);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || loading}
            className="hidden"
            id={`image-upload-${folder}`}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || loading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {loading ? 'Uploading...' : preview ? 'Change Image' : 'Select Image'}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={disabled || loading}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Max file size: 5MB. Supported formats: PNG, JPG, GIF, WebP
          </p>
        </div>
      </div>
    </div>
  );
}
