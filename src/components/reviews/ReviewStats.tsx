import { Star } from "lucide-react";
import { Review } from "@/types";

interface ReviewStatsProps {
  reviews: Review[];
  averageRating: number;
}

export function ReviewStats({ reviews, averageRating }: ReviewStatsProps) {
  const totalReviews = reviews.length;
  
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating as keyof typeof ratingCounts]++;
    }
  });

  return (
    <div className="bg-white rounded-lg p-6 border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-lg">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm">{totalReviews} Ratings</p>
        </div>

        {/* Rating Bars */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating as keyof typeof ratingCounts];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <div className="flex items-center w-8">
                  <span className="font-medium text-gray-700">{rating}</span>
                  <Star className="w-3 h-3 ml-1 fill-gray-400 text-gray-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-10 text-right text-gray-500">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

