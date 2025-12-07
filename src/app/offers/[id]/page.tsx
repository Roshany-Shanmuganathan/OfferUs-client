import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { fetchOfferServer, fetchOfferReviewsServer } from '@/services/offer.service';
import { notFound } from 'next/navigation';
import type { Review } from '@/types';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface OfferDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OfferDetailsPage({ params }: OfferDetailsPageProps) {
  const { id } = await params;
  const offer = await fetchOfferServer(id);
  const reviews = await fetchOfferReviewsServer(id);

  if (!offer) {
    notFound();
  }

  const expiryDate = new Date(offer.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const expiresSoon = daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-6">
              <Link href="/offers">
                <Button variant="ghost" size="sm">
                  ← Back to Offers
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                {offer.imageUrl ? (
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {offer.title}
                    </h1>
                    {expiresSoon && (
                      <Badge variant="destructive" className="bg-red-500/90 text-white">
                        Expires Soon
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold text-primary">
                      ${offer.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {offer.discount}% OFF
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Category:</span> {offer.category}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {formatDateShort(expiryDate)}
                    </div>
                    <div>
                      <span className="font-medium">Views:</span> {offer.analytics.views}
                    </div>
                    <div>
                      <span className="font-medium">Clicks:</span> {offer.analytics.clicks}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{offer.description}</p>
                </div>

                {offer.termsAndConditions && (
                  <div className="pt-4 border-t">
                    <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {offer.termsAndConditions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
                {reviews.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= Math.round(averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-muted-foreground">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                )}
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {typeof review.member === 'object' ? review.member.email : 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDateShort(review.createdAt)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    )}
                    {review.partnerResponse && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium mb-1">Partner Response:</p>
                        <p className="text-sm text-muted-foreground">{review.partnerResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PublicRoute>
  );
}

