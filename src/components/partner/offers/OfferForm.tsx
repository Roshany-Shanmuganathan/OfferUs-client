'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/ui/image-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { partnerOfferService } from '@/services/offer.service';
import { toast } from 'sonner';
import type { Offer } from '@/types';
import { useRouter } from 'next/navigation';

const offerFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    description: z.string().min(1, 'Description is required'),
    discount: z.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100%').optional(),
    originalPrice: z.number().min(0, 'Original price must be at least 0'),
    discountedPrice: z.number().min(0, 'Discounted price must be at least 0').optional(),
    category: z.string().min(1, 'Category is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    termsAndConditions: z.string().optional(),
    couponColor: z.string().optional(),
    couponExpiryDays: z.number().min(0, 'Coupon expiry days must be at least 0').optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.discount !== undefined && data.originalPrice && data.discountedPrice !== undefined) {
        const calculatedDiscount = ((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100;
        return Math.abs(calculatedDiscount - data.discount) <= 1;
      }
      return true;
    },
    {
      message: 'Discount percentage does not match price difference',
      path: ['discount'],
    }
  )
  .refine(
    (data) => {
      const expiryDate = new Date(data.expiryDate);
      const now = new Date();
      return expiryDate > now;
    },
    {
      message: 'Expiry date and time must be in the future',
      path: ['expiryDate'],
    }
  );

type OfferFormData = z.infer<typeof offerFormSchema>;

interface OfferFormProps {
  offer?: Offer;
  categories: string[];
  onSuccess?: () => void;
}

export function OfferForm({ offer, categories, onSuccess }: OfferFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingDiscount, setIsCalculatingDiscount] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: offer
      ? {
          title: offer.title,
          description: offer.description,
          discount: offer.discount,
          originalPrice: offer.originalPrice,
          discountedPrice: offer.discountedPrice,
          category: offer.category,
          expiryDate: new Date(offer.expiryDate).toISOString().slice(0, 16),
          imageUrl: offer.imageUrl || '',
          termsAndConditions: offer.termsAndConditions || '',
          couponColor: offer.couponColor || '#c9a962',
          couponExpiryDays: offer.couponExpiryDays ?? null,
        }
      : {
          title: '',
          description: '',
          discount: undefined,
          originalPrice: 0,
          discountedPrice: undefined,
          category: '',
          expiryDate: '',
          imageUrl: '',
          termsAndConditions: '',
          couponColor: '#c9a962',
          couponExpiryDays: null,
        },
  });

  const discount = form.watch('discount');
  const originalPrice = form.watch('originalPrice');
  const discountedPrice = form.watch('discountedPrice');

  useEffect(() => {
    if (isCalculatingDiscount && originalPrice > 0 && discountedPrice !== undefined && discountedPrice >= 0) {
      const calculatedDiscount = ((originalPrice - discountedPrice) / originalPrice) * 100;
      form.setValue('discount', Math.round(calculatedDiscount * 100) / 100, {
        shouldValidate: false,
      });
      setIsCalculatingDiscount(false);
    }
  }, [originalPrice, discountedPrice, isCalculatingDiscount, form]);

  useEffect(() => {
    if (isCalculatingPrice && originalPrice > 0 && discount !== undefined && discount >= 0) {
      const calculatedPrice = originalPrice * (1 - discount / 100);
      form.setValue('discountedPrice', Math.round(calculatedPrice * 100) / 100, {
        shouldValidate: false,
      });
      setIsCalculatingPrice(false);
    }
  }, [originalPrice, discount, isCalculatingPrice, form]);

  const handleDiscountChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue !== undefined && originalPrice > 0) {
      setIsCalculatingPrice(true);
    }
    form.setValue('discount', numValue, { shouldValidate: false });
  };

  const handleDiscountedPriceChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    if (numValue !== undefined && originalPrice > 0) {
      setIsCalculatingDiscount(true);
    }
    form.setValue('discountedPrice', numValue, { shouldValidate: false });
  };

  const handleOriginalPriceChange = (value: number) => {
    const currentDiscount = form.getValues('discount');
    const currentDiscountedPrice = form.getValues('discountedPrice');
    form.setValue('originalPrice', value, { shouldValidate: false });
    if (currentDiscount !== undefined && currentDiscount >= 0) {
      setIsCalculatingPrice(true);
    } else if (currentDiscountedPrice !== undefined && currentDiscountedPrice >= 0) {
      setIsCalculatingDiscount(true);
    }
  };

  const onSubmit = async (data: OfferFormData) => {
    setIsLoading(true);
    try {
      const submitData = {
        title: data.title,
        description: data.description,
        discount: data.discount ?? 0,
        originalPrice: data.originalPrice,
        discountedPrice: data.discountedPrice ?? data.originalPrice,
        category: data.category,
        expiryDate: new Date(data.expiryDate).toISOString(),
        imageUrl: data.imageUrl || undefined,
        termsAndConditions: data.termsAndConditions || undefined,
        couponColor: data.couponColor || '#c9a962',
        couponExpiryDays: data.couponExpiryDays ?? undefined,
      };

      if (offer) {
        await partnerOfferService.updateOffer(offer._id, submitData);
        toast.success('Offer updated successfully!');
      } else {
        await partnerOfferService.createOffer(submitData);
        toast.success('Offer created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/partner/offers');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to save offer';
      toast.error(errorMessage);

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          if (err.field && err.message) {
            form.setError(err.field as keyof OfferFormData, { message: err.message });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter offer title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter offer description" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleOriginalPriceChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      handleDiscountChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discounted Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      handleDiscountedPriceChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date & Time *</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value || ''}
                  onChange={field.onChange}
                  folder="offers"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAndConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms & Conditions</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter terms and conditions" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coupon Customization Section */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">Coupon Customization (Optional)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Customize how coupons for this offer will appear and when they expire
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="couponColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Color</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="h-10 w-20 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#c9a962"
                          className="flex-1 font-mono"
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Choose a color that matches your brand or offer theme
                    </p>
                    {/* Color Presets */}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { name: 'Gold', value: '#c9a962' },
                        { name: 'Blue', value: '#3b82f6' },
                        { name: 'Green', value: '#10b981' },
                        { name: 'Purple', value: '#8b5cf6' },
                        { name: 'Red', value: '#ef4444' },
                        { name: 'Orange', value: '#f97316' },
                        { name: 'Pink', value: '#ec4899' },
                        { name: 'Teal', value: '#14b8a6' },
                      ].map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="couponExpiryDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Validity (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Leave empty to match offer expiry"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value 
                      ? `Coupons will expire ${field.value} days after generation`
                      : 'Coupons will expire when the offer expires'}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : offer ? 'Update Offer' : 'Create Offer'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/partner/offers')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

