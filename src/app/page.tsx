import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { LoginTrigger } from '@/components/layout/LoginTrigger';
import { OfferCard } from '@/components/offers/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { Button } from '@/components/ui/button';
import { fetchOffersServer, partnerOfferService } from '@/services/offer.service';
import Link from 'next/link';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  
  const { offers } = await fetchOffersServer({
    page,
    limit: 10,
    search: resolvedSearchParams.search,
    category: resolvedSearchParams.category,
    sortBy: resolvedSearchParams.sortBy,
  });

  // Fetch categories for the filter
  let categories: string[] = [];
  try {
    const categoriesData = await partnerOfferService.getCategories();
    categories = categoriesData.data.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <Suspense fallback={null}>
          <LoginTrigger />
        </Suspense>
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

            <div className="mb-8">
              <OfferFilters categories={categories} />
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
                  No offers found matching your criteria.
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
