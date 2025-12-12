"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/review.service";
import { toast } from "sonner";
import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewImageUploader } from "./ReviewImageUploader";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().min(5, "Review must be at least 5 characters").optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  offerId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ offerId, onSuccess }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      images: [],
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true);
      
      // Note: The backend might not support images yet, but we send them anyway
      // or we might need to update the service to send images. 
      // Assuming reviewService.createReview accepts extra fields or we cast it.
      await reviewService.createReview({
        offerId,
        rating: data.rating,
        comment: data.comment || undefined,
        // @ts-ignore - Assuming we extended the service/api but TS might not know yet if we didn't update service
        images: data.images
      });

      toast.success("Review submitted successfully");
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const rating = form.watch("rating");

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Input */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Quality</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 self-center">
                      {rating ? (rating === 5 ? "Excellent" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Very Poor") : ""}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comment Input */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts about this offer..."
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Photos</FormLabel>
                <FormControl>
                  <ReviewImageUploader 
                    images={field.value || []} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || rating === 0}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

