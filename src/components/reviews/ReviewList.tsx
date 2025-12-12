import { useState } from "react";
import { Review } from "@/types";
import { Star, ThumbsUp, CheckCircle, Store } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        reviews.map((review) => (
          <ReviewItem key={review._id} review={review} />
        ))
      )}
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0); // Mock like count

  const memberName = typeof review.member === 'object' 
    ? (review.member.email?.split('@')[0] || "User") 
    : "User";

  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-gray-400 text-sm ml-2">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-900">by {memberName}</span>
            <span className="flex items-center text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified Purchase
            </span>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
          {review.comment}
        </p>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90"
            >
              <Image 
                src={img} 
                alt={`Review image ${idx + 1}`} 
                fill 
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 text-gray-500 hover:text-blue-600 ${liked ? 'text-blue-600' : ''}`}
          onClick={() => {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
          }}
        >
          <ThumbsUp className={`w-4 h-4 mr-1.5 ${liked ? 'fill-current' : ''}`} />
          Helpful {likes > 0 && `(${likes})`}
        </Button>
      </div>

      {/* Partner Response */}
      {review.partnerResponse && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Response from Seller</span>
            {review.responseDate && (
                <span className="text-xs text-gray-400">
                    • {formatDistanceToNow(new Date(review.responseDate), { addSuffix: true })}
                </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {review.partnerResponse}
          </p>
        </div>
      )}
    </div>
  );
}

