'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit2, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { userService } from '@/services/user.service';

import Link from 'next/link';

interface AdminProfileSectionProps {
  pendingApprovals?: number;
}

export function AdminProfileSection({ pendingApprovals = 0 }: AdminProfileSectionProps) {
  const { user, login } = useAuth(); // Using login to refresh user data if needed, or we might need a refreshUser method
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      // 1. Upload to Cloudinary
      // Using 'admin-profiles' folder or similar
      const uploadResponse = await apiClient.post(
        '/upload/image?folder=admin-profiles',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = uploadResponse.data.data.url;

      // 2. Update User Profile
      if (user?._id) {
        await userService.updateUser(user._id, {
          profileImage: imageUrl,
        });

        // 3. Refresh local user state
        // Ideally AuthContext should expose a refreshUser method.
        // For now, we might need to rely on a page reload or just update the UI optimistically if we can't refresh context easily without re-login.
        // Let's try to reload the window for now to ensure context is updated, or if AuthContext has a way to update user.
        // Since we don't have refreshUser, we'll just show a success message. The user might need to refresh to see changes in other places,
        // but we can update the Avatar src locally if we had local state for it.
        // Actually, let's just reload the page to be safe and simple for now.
        window.location.reload();
        
        toast.success('Profile image updated successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile image');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg p-6 mb-8 flex items-center gap-6 shadow-sm border">
      <div className="relative group">
        <Avatar
          src={user.profileImage}
          alt={user.email}
          className="h-20 w-20 border-2 border-white shadow-md"
          size="xl"
        />
        <label
          htmlFor="profile-upload"
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <input
            id="profile-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome Back, {user.email?.split('@')[0] || 'Admin'}
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-gray-500 mt-1">
          {pendingApprovals > 0 ? (
            <>
              You have{' '}
              <Link href="/admin/approvals" className="text-orange-500 font-medium hover:underline">
                {pendingApprovals} Pending Approvals
              </Link>
            </>
          ) : (
            'You have no pending approvals'
          )}
        </p>
      </div>
    </div>
  );
}
