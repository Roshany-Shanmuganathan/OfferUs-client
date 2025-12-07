'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { memberService } from '@/services/member.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import type { Member } from '@/types';
import { Camera, X } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNumber: z.string().regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan mobile number'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function MemberProfilePage() {
  const { refreshUser } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      address: '',
      dateOfBirth: '',
      gender: undefined,
    },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await memberService.getProfile();
      if (response.success) {
        const memberData = response.data.member;
        setMember(memberData);
        form.reset({
          firstName: memberData.firstName || '',
          lastName: memberData.lastName || '',
          mobileNumber: memberData.mobileNumber || '',
          address: memberData.address || '',
          dateOfBirth: memberData.dateOfBirth ? new Date(memberData.dateOfBirth).toISOString().split('T')[0] : '',
          gender: (memberData.gender as 'male' | 'female' | 'other' | undefined) || undefined,
        });
        // Reset image preview when profile is loaded
        setImagePreview(null);
        setProfileImage(null);
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load profile';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProfileImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (member?.profilePicture) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${apiUrl}${member.profilePicture}`;
    }
    return null;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSubmitting(true);
      const response = await memberService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        address: data.address,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender,
        profileImage: profileImage || undefined,
      });

      if (response.success) {
        toast.success('Profile updated successfully');
        await fetchProfile();
        await refreshUser();
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          if (err.field && err.message) {
            form.setError(err.field as keyof ProfileFormData, { message: err.message });
          }
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your profile information</p>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center gap-4 pb-6 border-b">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                        {getProfileImageUrl() ? (
                          <img
                            src={getProfileImageUrl()!}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-4xl font-semibold">
                            {member?.firstName?.[0]?.toUpperCase() || 'M'}
                            {member?.lastName?.[0]?.toUpperCase() || ''}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      {(imagePreview || member?.profilePicture) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Profile Picture</p>
                      <p className="text-xs text-muted-foreground">Click the camera icon to upload</p>
                      <p className="text-xs text-muted-foreground">Max size: 5MB (JPEG, PNG, GIF, WebP)</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="0771234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </MemberLayout>
  );
}

