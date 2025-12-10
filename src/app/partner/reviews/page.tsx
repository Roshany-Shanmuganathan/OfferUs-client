'use client';

import { useState, useEffect } from 'react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { reviewService } from '@/services/review.service';
import { Review } from '@/types';
import { Star, MessageSquare, Calendar, User, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PartnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getPartnerReviews();
      if (response.success && response.data) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return;

    setSubmitting(true);
    try {
      const response = await reviewService.respondToReview(reviewId, responseText);
      if (response.success) {
        toast.success('Response added successfully');
        setReviews(reviews.map(r => 
          r._id === reviewId ? { ...r, partnerResponse: responseText, responseDate: new Date().toISOString() } : r
        ));
        setRespondingTo(null);
        setResponseText('');
      }
    } catch (error) {
      console.error('Error responding to review:', error);
      toast.error('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer reviews for your offers.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border border-dashed">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No reviews yet</h3>
            <p className="text-muted-foreground">
              When customers review your offers, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-card rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {typeof review.member === 'object' && review.member?.email 
                            ? review.member.email.split('@')[0] 
                            : 'Anonymous User'}
                        </span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {renderStars(review.rating)}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-md h-fit">
                    {typeof review.offer === 'object' ? review.offer.title : 'Offer'}
                  </div>
                </div>

                <div className="pl-14">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.comment}
                  </p>

                  {review.partnerResponse ? (
                    <div className="bg-muted/50 rounded-md p-4 mt-4 border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">Your Response</span>
                        <span className="text-xs text-muted-foreground">
                          • {format(new Date(review.responseDate || new Date()), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.partnerResponse}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      {respondingTo === review._id ? (
                        <div className="space-y-3">
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write your response here..."
                            className="w-full min-h-[100px] p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRespond(review._id)}
                              disabled={submitting || !responseText.trim()}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                              {submitting ? 'Posting...' : 'Post Response'}
                            </button>
                            <button
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText('');
                              }}
                              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRespondingTo(review._id)}
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <Reply className="h-4 w-4" />
                          Reply to review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}
