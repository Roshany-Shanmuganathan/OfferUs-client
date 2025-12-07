'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { partnerSettingsService } from '@/services/partner.settings.service';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Partner } from '@/types';

const profileSchema = z.object({
  partnerName: z.string().min(1, 'Owner name is required').max(100, 'Name must be less than 100 characters'),
  shopName: z.string().min(1, 'Business name is required').max(100, 'Business name must be less than 100 characters'),
  email: z.string().email('Invalid email address').optional(),
  mobileNumber: z.string().min(1, 'Phone number is required').regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan mobile number'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  postalCode: z.string().regex(/^[0-9]{5}$/, 'Postal code must be 5 digits'),
  category: z.string().min(1, 'Category is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SettingsProfileFormProps {
  partner: Partner | null;
  categories: string[];
  onSuccess?: () => void;
}

const DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Moneragala',
  'Ratnapura',
  'Kegalle',
];

export function SettingsProfileForm({ partner, categories, onSuccess }: SettingsProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: partner
      ? {
          partnerName: partner.partnerName,
          shopName: partner.shopName,
          mobileNumber: partner.contactInfo.mobileNumber,
          street: partner.location.street,
          city: partner.location.city,
          district: partner.location.district,
          postalCode: partner.location.postalCode,
          category: partner.category,
          website: partner.contactInfo.website || '',
        }
      : {
          partnerName: '',
          shopName: '',
          mobileNumber: '',
          street: '',
          city: '',
          district: '',
          postalCode: '',
          category: '',
          website: '',
        },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      await partnerSettingsService.updatePartnerProfile({
        partnerName: data.partnerName,
        shopName: data.shopName,
        location: {
          street: data.street,
          city: data.city,
          district: data.district,
          postalCode: data.postalCode,
        },
        category: data.category,
        contactInfo: {
          mobileNumber: data.mobileNumber,
          website: data.website || undefined,
        },
      });

      toast.success('Profile updated successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          if (err.field && err.message) {
            form.setError(err.field as keyof ProfileFormData, { message: err.message });
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="partnerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner name" {...field} />
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
                <FormLabel>Business Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {partner && typeof partner.userId === 'object' && partner.userId?.email && (
          <div className="grid gap-6 md:grid-cols-2">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={partner.userId.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </FormItem>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="0771234567" {...field} />
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
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {partner && typeof partner.userId === 'object' && partner.userId?.email && (
          <div className="grid gap-6 md:grid-cols-2">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={partner.userId.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </FormItem>
          </div>
        )}

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DISTRICTS.map((district) => (
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

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" maxLength={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

