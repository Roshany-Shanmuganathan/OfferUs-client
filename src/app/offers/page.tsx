import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { OfferCard } from '@/components/offers/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { fetchOffersServer, partnerOfferService } from '@/services/offer.service';

interface OffersPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    district?: string;
    location?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const { offers, pagination } = await fetchOffersServer({
    page,
    limit: 12,
    search: resolvedSearchParams.search,
    category: resolvedSearchParams.category,
    district: resolvedSearchParams.district,
    location: resolvedSearchParams.location,
    sortBy: resolvedSearchParams.sortBy,
  });

  // Fetch categories for the filter
  // Note: We need a way to get categories server-side without auth if possible, 
  // or we can just fetch them client-side in the filter component.
  // However, passing them as props is better for SEO and initial load.
  // Assuming partnerOfferService.getCategories works or we handle the error gracefully.
  let categories: string[] = [];
  try {
    const categoriesData = await partnerOfferService.getCategories();
    categories = categoriesData.data.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Fallback or empty categories
  }

  // Define all Sri Lankan districts for location filtering
  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Moneragala',
    'Ratnapura',
    'Kegalle',
  ];

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
              <p className="text-muted-foreground mb-8">
                Discover amazing deals from our verified partners
              </p>
              
              <OfferFilters categories={categories} districts={districts} />
            </div>

            {offers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {offers.map((offer) => (
                    <OfferCard key={offer._id} offer={offer} />
                  ))}
                </div>
                
                {/* Simple Pagination - can be enhanced later */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {/* We can add a proper pagination component here later */}
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No offers found matching your criteria.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or search terms.
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

