'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { Upload, User, X } from 'lucide-react';
import Image from 'next/image';
import { partnerSettingsService } from '@/services/partner.settings.service';
import type { Partner } from '@/types';

interface SettingsProfileImageUploaderProps {
  partner: Partner | null;
  onImageUpdate?: () => void;
}

export function SettingsProfileImageUploader({ partner, onImageUpdate }: SettingsProfileImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (partner?.profileImage) {
      // Cloudinary URLs are already full URLs, use them directly
      const imageUrl = partner.profileImage;
      setCurrentImageUrl(imageUrl);
      setPreview(imageUrl);
    } else {
      setCurrentImageUrl(null);
      setPreview(null);
    }
  }, [partner?.profileImage]);

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

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      const response = await partnerSettingsService.uploadProfileImage(file);
      
      if (response.success && response.data.partner?.profileImage) {
        // Cloudinary URLs are already full URLs, use them directly
        const imageUrl = response.data.partner.profileImage;
        setCurrentImageUrl(imageUrl);
        setPreview(imageUrl);
        toast.success('Profile image uploaded successfully');
        // Clear file input after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh partner data to ensure consistency
        if (onImageUpdate) {
          await onImageUpdate();
        }
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload profile image';
      toast.error(errorMessage);
      // Reset preview on error
      if (currentImageUrl) {
        setPreview(currentImageUrl);
      } else {
        setPreview(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setLoading(true);
      await partnerSettingsService.deleteProfileImage();
      setCurrentImageUrl(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Profile image removed successfully');
      if (onImageUpdate) {
        onImageUpdate();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove profile image';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
        <CardDescription>Upload your profile image (max 5MB, PNG/JPG/GIF/WebP)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          {preview ? (
            <div className="relative w-32 h-32 border rounded-full overflow-hidden bg-muted">
              <Image 
                src={preview} 
                alt="Profile preview" 
                fill 
                className="object-cover"
                unoptimized={preview.startsWith('data:')}
                onError={() => {
                  console.error('Failed to load profile image:', preview);
                  setPreview(null);
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-full bg-muted">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <Label htmlFor="profile-image-upload">Select Image</Label>
            <Input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 200x200 pixels
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={loading || !preview || preview === currentImageUrl}>
            <Upload className="mr-2 h-4 w-4" />
            {loading ? 'Uploading...' : preview === currentImageUrl ? 'No Changes' : 'Upload Image'}
          </Button>
          {currentImageUrl && (
            <Button onClick={handleRemove} disabled={loading} variant="destructive">
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

