import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { OfferCard } from '@/components/offers/OfferCard';
import { Button } from '@/components/ui/button';
import { fetchOffersServer } from '@/services/offer.service';
import Link from 'next/link';

export default async function Home() {
  const offers = await fetchOffersServer(10);

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Welcome to OfferUs
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your trusted platform for discovering the best offers and deals
                from verified partners.
              </p>
            </div>

            {offers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                  {offers.map((offer) => (
                    <OfferCard key={offer._id} offer={offer} />
                  ))}
                </div>

                <div className="flex justify-center">
                  <Link href="/offers">
                    <Button size="lg" variant="outline">
                      Browse More
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No offers available at the moment. Check back later!
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PublicRoute>
  );
}
