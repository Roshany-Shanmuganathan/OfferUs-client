import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';

export default function Home() {
  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Welcome to OfferUs
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your trusted platform for discovering the best offers and deals
                from verified partners.
              </p>
              <div className="flex gap-4 justify-center pt-8">
                <a
                  href="/offers"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Browse Offers
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PublicRoute>
  );
}
