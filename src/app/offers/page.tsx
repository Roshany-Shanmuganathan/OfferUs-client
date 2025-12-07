import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { OfferCard } from '@/components/offers/OfferCard';
import { fetchOffersServer } from '@/services/offer.service';

export default async function OffersPage() {
  const offers = await fetchOffersServer(100);

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                All Offers
              </h1>
              <p className="text-muted-foreground">
                Discover amazing deals from our verified partners
              </p>
            </div>

            {offers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {offers.map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))}
              </div>
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

