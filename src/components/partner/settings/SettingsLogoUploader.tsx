'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface SettingsLogoUploaderProps {
  currentLogoUrl?: string;
  onLogoUpdate?: (url: string) => void;
}

export function SettingsLogoUploader({ currentLogoUrl, onLogoUpdate }: SettingsLogoUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Note: Backend may not have logo upload endpoint
      // This is a placeholder - handle gracefully
      toast.info('Logo upload endpoint not available. Feature coming soon.');
      
      // If endpoint exists, uncomment:
      // const formData = new FormData();
      // formData.append('logo', file);
      // const response = await apiClient.post('/partners/logo', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // toast.success('Logo uploaded successfully');
      // if (onLogoUpdate) {
      //   onLogoUpdate(response.data.data.logoUrl);
      // }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload logo';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Logo</CardTitle>
        <CardDescription>Upload your business logo (max 5MB, PNG/JPG)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preview && (
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
            <Image src={preview} alt="Logo preview" fill className="object-contain" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!preview && (
          <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="logo-upload">Select Logo</Label>
          <Input
            id="logo-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        <Button onClick={handleUpload} disabled={loading || !preview}>
          <Upload className="mr-2 h-4 w-4" />
          {loading ? 'Uploading...' : 'Upload Logo'}
        </Button>
      </CardContent>
    </Card>
  );
}

