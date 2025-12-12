'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/ui/image-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  partnerRegisterSchema,
  SRI_LANKAN_DISTRICTS,
  type PartnerRegisterFormData,
} from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ApiError, PartnerRegisterRequest } from '@/types';

export default function PartnerRegisterPage() {
  const { registerPartner } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PartnerRegisterFormData>({
    resolver: zodResolver(partnerRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      partnerName: '',
      shopName: '',
      location: {
        street: '',
        city: '',
        district: '',
        postalCode: '',
      },
      category: '',
      contactInfo: {
        mobileNumber: '',
        website: '',
      },
      profileImage: '',
    },
  });

  const onSubmit = async (data: PartnerRegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      // Clean up empty website
      if (!registerData.contactInfo.website) {
        delete registerData.contactInfo.website;
      }
      // Clean up empty profileImage
      if (!registerData.profileImage) {
        delete registerData.profileImage;
      }
      // Ensure coordinates is properly typed as tuple if it exists
      if (
        registerData.location.coordinates &&
        Array.isArray(registerData.location.coordinates)
      ) {
        registerData.location.coordinates = registerData.location.coordinates.slice(
          0,
          2
        ) as [number, number];
      }
      await registerPartner(registerData as PartnerRegisterRequest);
      toast.success('Registration submitted. Waiting for admin approval.', {
        description:
          'You will be able to login once your registration is approved.',
      });
      form.reset();
      // Redirect to home after successful registration
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: unknown) {
      // Handle field-specific errors from API
      const apiError = error as ApiError;
      if (
        apiError.response?.data?.errors &&
        Array.isArray(apiError.response.data.errors)
      ) {
        // Set field errors if API returns field-specific errors
        apiError.response.data.errors.forEach((err) => {
          if (err.field && err.message) {
            // Handle nested fields like location.street
            if (err.field.includes('.')) {
              const fieldPath = err.field.split('.') as [string, ...string[]];
              // Use unknown first for type conversion as TypeScript requires
              form.setError(
                fieldPath as unknown as Parameters<typeof form.setError>[0],
                { message: err.message }
              );
            } else {
              form.setError(err.field as keyof PartnerRegisterFormData, {
                message: err.message,
              });
            }
          }
        });
        // Only show toast if there's a general message
        if (apiError.response.data.message) {
          toast.error(apiError.response.data.message);
        }
      } else {
        // Only show toast for general errors, not field-specific ones
        const errorMessage =
          apiError.response?.data?.message || apiError.message;
        if (errorMessage && !errorMessage.includes('validation')) {
          toast.error(
            errorMessage || 'Registration failed. Please check the form and try again.'
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        
        {/* Hero Header */}
        <div className="bg-[#0B211D] text-white py-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Become a Partner with Offers
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join our platform to reach wider audience and offer your exclusive deals.
              Fill out the form below to get started.
            </p>
          </div>
        </div>

        <main className="flex-1 container mx-auto px-4 pb-20 -mt-10 relative z-10">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-5xl mx-auto border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Section 1: Shop / Business Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shop / Business Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop/Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., AGR textile."
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop/Business type</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Textile / electronics"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location map URL</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="e.g., https://www.google.com/maps?q=..."
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Vavuniya"
                                {...field}
                                disabled={isLoading}
                                className="bg-gray-50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location.district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SRI_LANKAN_DISTRICTS.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2nd cross street"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 43000"
                              maxLength={5}
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 2: Primary Contact Details */}
                <div className="space-y-6 pt-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Primary Contact Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="partnerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Roshany."
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
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
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g., shalu24@gmail.com"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactInfo.mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., +94 75 598 4905"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: Account Security (Hidden/Preserved) */}
                <div className="space-y-6 pt-4 border-t">
                   <h2 className="text-xl font-bold text-gray-900">
                    Account Security
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              disabled={isLoading}
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Profile Image (Optional) */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Profile Image (Optional)</h3>
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader
                            value={field.value || ''}
                            onChange={field.onChange}
                            folder="partner-profiles"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Agreement Checkbox (Visual only to match design) */}
                <div className="flex items-center space-x-2 pt-4">
                  <div className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center">
                     {/* We can't implement real functionality without changing schema, so we just show the text mostly */}
                  </div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                     I agree to the Terms and Conditions and Privacy Policy of Offers Marketing Platform
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    disabled={isLoading}
                    className="w-32"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-48 bg-[#0B211D] hover:bg-[#153e34] text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Need More Help Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Need More Help?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive FAQ section for instant answer to common
              question or visit our Help Center for detailed guides and tutorials.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="min-w-[140px] border-gray-300">
                Visit FAQ
              </Button>
              <Button className="min-w-[180px] bg-[#0B211D] hover:bg-[#153e34] text-white">
                Explore Help Center
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PublicRoute>
  );
}
