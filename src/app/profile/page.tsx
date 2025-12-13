'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { memberService } from '@/services/member.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { ImageCropper } from '@/components/ui/image-cropper';

import { Loader2, User, Camera, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

// Schema for profile update
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  mobileNumber: z
    .string()
    .regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan mobile number')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  email: z.string().email().optional(), // Read-only
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, refreshUser, isAuthenticated, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      address: '',
      email: '',
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user data into form
  useEffect(() => {
    if (user?.member) {
      form.reset({
        firstName: user.member.firstName || '',
        lastName: user.member.lastName || '',
        mobileNumber: user.member.mobileNumber || '',
        address: user.member.address || '',
        email: user.email || '',
      });
      setPreviewUrl(user.member.profilePicture || null);
    }
  }, [user, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected file to pass to the cropper
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImageSrc(reader.result?.toString() || null);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
      
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Create a File object from the Blob
    const file = new File([croppedBlob], "profile-picture.jpg", { type: "image/jpeg" });
    setSelectedImage(file);
    
    // Create preview URL
    const url = URL.createObjectURL(croppedBlob);
    setPreviewUrl(url);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        address: data.address,
        profilePicture: selectedImage || undefined,
      };

      await memberService.updateProfile(updateData);
      await refreshUser(); // Refresh user context to update navbar
      toast.success('Profile updated successfully');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/member');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // ... onSubmit logic

  if (authLoading || !user) {
    // ... loading state
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <ImageCropper 
        open={cropperOpen} 
        onOpenChange={setCropperOpen} 
        imageSrc={tempImageSrc} 
        onCropComplete={handleCropComplete} 
      />
      
      {/* Top Banner */}
      {/* ... rest of the component */}
      <div className="bg-[#102219] h-48 md:h-64 w-full relative">
        <div className="container mx-auto px-4 h-full relative">
          <Button 
            variant="ghost" 
            className="absolute top-6 left-4 text-white hover:text-gray-200 hover:bg-white/10 z-10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col items-center justify-center h-full pb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-300">Manage your personal information</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="container mx-auto px-4 -mt-20 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              {/* Profile Picture Section - Overlapping */}
              <div className="relative flex justify-center -mt-16 mb-8">
                <div className="relative group">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg ring-4 ring-[#102219]/10 bg-white">
                    <AvatarImage src={previewUrl || undefined} className="object-cover" />
                    <AvatarFallback className="bg-gray-100 text-gray-400">
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="picture-upload" 
                    className="absolute bottom-2 right-2 p-3 bg-[#102219] text-white rounded-full cursor-pointer hover:bg-[#1a3326] transition-all shadow-lg transform hover:scale-105 border-2 border-white"
                  >
                    <Camera className="h-5 w-5" />
                    <input 
                      id="picture-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="px-8 pb-10 md:px-12 md:pb-14">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#102219] h-12 text-gray-900"
                          />
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
                        <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#102219] h-12 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled 
                            className="bg-gray-100 border-gray-200 text-gray-500 h-12 cursor-not-allowed" 
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email address.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Mobile Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="07XXXXXXXX" 
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#102219] h-12 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-700 font-medium">Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="123 Main St, Colombo" 
                            className="bg-gray-50 border-gray-200 focus-visible:ring-[#102219] h-12 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-8 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full md:w-auto min-w-[150px] bg-[#102219] hover:bg-[#1a3326] text-white h-12 text-base font-medium shadow-md transition-all hover:shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
