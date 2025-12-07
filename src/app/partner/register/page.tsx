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
      // Ensure coordinates is properly typed as tuple if it exists
      if (registerData.location.coordinates && Array.isArray(registerData.location.coordinates)) {
        registerData.location.coordinates = registerData.location.coordinates.slice(0, 2) as [number, number];
      }
      await registerPartner(registerData as PartnerRegisterRequest);
      toast.success(
        'Registration submitted. Waiting for admin approval.',
        {
          description: 'You will be able to login once your registration is approved.',
        }
      );
      form.reset();
      // Redirect to home after successful registration
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: unknown) {
      // Handle field-specific errors from API
      const apiError = error as ApiError;
      if (apiError.response?.data?.errors && Array.isArray(apiError.response.data.errors)) {
        // Set field errors if API returns field-specific errors
        apiError.response.data.errors.forEach((err) => {
          if (err.field && err.message) {
            // Handle nested fields like location.street
            if (err.field.includes('.')) {
              const fieldPath = err.field.split('.') as [string, ...string[]];
              // Use unknown first for type conversion as TypeScript requires
              form.setError(fieldPath as unknown as Parameters<typeof form.setError>[0], { message: err.message });
            } else {
              form.setError(err.field as keyof PartnerRegisterFormData, { message: err.message });
            }
          }
        });
        // Only show toast if there's a general message
        if (apiError.response.data.message) {
          toast.error(apiError.response.data.message);
        }
      } else {
        // Only show toast for general errors, not field-specific ones
        const errorMessage = apiError.response?.data?.message || apiError.message;
        if (errorMessage && !errorMessage.includes('validation')) {
          toast.error(errorMessage || 'Registration failed. Please check the form and try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Join as Partner</h1>
            <p className="text-muted-foreground">
              Fill in your business details to register as a partner. Your registration will be reviewed by an admin.
            </p>
          </div>

          <div className="border rounded-lg p-8 bg-card shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Account Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="business@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-xl font-semibold">Business Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="partnerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ABC Store"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Retail, Restaurant, etc."
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-xl font-semibold">Location</h2>
                  
                  <FormField
                    control={form.control}
                    name="location.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main Street"
                            {...field}
                            disabled={isLoading}
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
                              placeholder="Colombo"
                              {...field}
                              disabled={isLoading}
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
                              <SelectTrigger>
                                <SelectValue placeholder="Select district" />
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
                          <FormMessage className="text-xs break-words" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00100"
                            maxLength={5}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="contactInfo.mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0771234567"
                            {...field}
                            disabled={isLoading}
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
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link href="/" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer variant="simplified" />
    </div>
    </PublicRoute>
  );
}

