import { Review } from "@/types";
import { ReviewStats } from "./ReviewStats";
import { ReviewList } from "./ReviewList";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  offerId: string;
  reviews: Review[];
  isAuthenticated: boolean;
  onReviewSuccess?: () => void;
  currentUserEmail?: string; // To prevent duplicate reviews or highlight own review
}

export function ReviewSection({ 
  offerId, 
  reviews, 
  isAuthenticated, 
  onReviewSuccess 
}: ReviewSectionProps) {
  
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-8" id="reviews">
      <h2 className="text-xl font-bold text-gray-900">Ratings & Reviews</h2>

      <ReviewStats reviews={reviews} averageRating={averageRating} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            <ReviewList reviews={reviews} />
        </div>
        
        <div className="lg:col-span-4">
            {isAuthenticated ? (
                <div className="sticky top-24">
                   <ReviewForm offerId={offerId} onSuccess={onReviewSuccess} />
                </div>
            ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-4">Please log in to write a review.</p>
                    {/* Add login button or link if needed */}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}


