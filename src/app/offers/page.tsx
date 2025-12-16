import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { OfferCard } from '@/components/offers/OfferCard';
import { FilterSidebar } from '@/components/offers/FilterSidebar';
import { OffersHero } from '@/components/offers/OffersHero';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';
import { fetchOffersServer, fetchCategoriesServer } from '@/services/offer.service';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ArrowUpDown, Search, Home as HomeIcon, ChevronRight } from "lucide-react";
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ... (keep usage of redirect/navigation if needed for simple sort) or better yet, move Sort to a small top-right component? 
// For now, I'll inline a simple Sort selector in the page header.
// MobileFilterTrigger logic is inlined below using Sheet 
// Wait, FilterSidebar is client, so it can be used in Sheet.

interface OffersPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    district?: string;
    location?: string;
    sortBy?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    minDiscount?: string;
    maxDiscount?: string;
    expiresBefore?: string;
  }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const { offers, pagination, facets } = await fetchOffersServer({
    page,
    limit: 12,
    search: resolvedSearchParams.search,
    // category and district can now be comma separated strings, fetchOffersServer might need adjustment if it doesn't just pass them through?
    // Let's check fetchOffersServer in step 171. It does: params.append('category', category).
    // If category is "A,B", it appends "A,B".
    // Backend offerController now splits by comma. So this works perfectly!
    category: resolvedSearchParams.category,
    district: resolvedSearchParams.district,
    location: resolvedSearchParams.location,
    sortBy: resolvedSearchParams.sortBy,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    minDiscount: resolvedSearchParams.minDiscount,
    maxDiscount: resolvedSearchParams.maxDiscount,
    expiresBefore: resolvedSearchParams.expiresBefore,
  });

  // Fetch categories for the filter
  let categories: string[] = [];
  try {
    categories = await fetchCategoriesServer();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
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

  const baseParams = new URLSearchParams();
  if (resolvedSearchParams.search) baseParams.set('search', resolvedSearchParams.search);
  if (resolvedSearchParams.category) baseParams.set('category', resolvedSearchParams.category);
  if (resolvedSearchParams.district) baseParams.set('district', resolvedSearchParams.district);
  if (resolvedSearchParams.location) baseParams.set('location', resolvedSearchParams.location);
  if (resolvedSearchParams.sortBy) baseParams.set('sortBy', resolvedSearchParams.sortBy);
  if (resolvedSearchParams.minPrice) baseParams.set('minPrice', resolvedSearchParams.minPrice);
  if (resolvedSearchParams.maxPrice) baseParams.set('maxPrice', resolvedSearchParams.maxPrice);
  if (resolvedSearchParams.minDiscount) baseParams.set('minDiscount', resolvedSearchParams.minDiscount);
  if (resolvedSearchParams.maxDiscount) baseParams.set('maxDiscount', resolvedSearchParams.maxDiscount);
  if (resolvedSearchParams.expiresBefore) baseParams.set('expiresBefore', resolvedSearchParams.expiresBefore);

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 md:py-8">
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-6">
               <Link href="/" className="hover:text-primary transition-colors flex items-center">
                  <HomeIcon className="w-4 h-4 mr-1" />
                  Home
               </Link>
               <ChevronRight className="w-4 h-4 mx-2" />
               <span className="text-foreground font-medium">Offers</span>
            </div>

            {/* Hero Section */}
            <OffersHero />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" id="offers-grid">
               <div>
                  <h1 className="text-2xl font-bold tracking-tight">Active Offers</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Showing {pagination?.total || 0} results
                  </p>
               </div>
               
               {/* Controls */}
               <div className="flex items-center gap-2">
                  {/* Mobile Search & Filter */}
                   <div className="flex items-center gap-2 lg:hidden w-full md:w-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 gap-2 flex-1">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                            <div className="py-4">
                            <h2 className="text-lg font-semibold mb-4">Filters</h2>
                            <FilterSidebar categories={categories} districts={districts} facets={facets} />
                            </div>
                        </SheetContent>
                    </Sheet>
                   </div>

                   {/* Sort By (Simplified for now - could be a client component for direct interaction) */}
                   {/* We'll use a simple button group or just rely on Sidebar default for now? 
                       Let's add a placeholder select visual for sort if we want, or just keep it clean.
                       The mock says "Filters" is mobile only, sidebar is desktop.
                    */}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar (Desktop) */}
              <div className="hidden lg:block space-y-6">
                <FilterSidebar categories={categories} districts={districts} facets={facets} />
              </div>

              {/* Product Grid */}
              <div className="lg:col-span-3 space-y-8">
                {offers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {offers.map((offer) => (
                        <OfferCard key={offer._id} offer={offer} />
                      ))}
                    </div>

                    {pagination.pages > 1 && (
                      <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                          const params = new URLSearchParams(baseParams);
                          params.set('page', p.toString());
                          return (
                            <Link key={p} href={`/offers?${params.toString()}`}>
                              <Button
                                variant={p === pagination.page ? "default" : "outline"}
                                size="sm"
                                className="w-10 h-10"
                              >
                                {p}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 px-4 bg-muted/30 rounded-lg border border-dashed">
                      <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                         <Search className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No offers found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        We couldn't find any offers matching your criteria. Try adjusting your filters or search for something else.
                      </p>
                      <Button variant="outline" asChild>
                          <Link href="/offers">Clear Filters</Link>
                      </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Newsletter Section */}
            <div className="mt-20">
                <NewsletterSignup />
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </PublicRoute>
  );
}

