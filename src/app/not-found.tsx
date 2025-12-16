import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            
            <div className="mb-12 animate-in fade-in zoom-in duration-700">
               {/* Using Logo instead of generic icon */}
               <div className="transform scale-125 origin-center p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/10 shadow-sm">
                <Logo width={200} height={60} />
               </div>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-8xl font-black text-primary/10 select-none tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 scale-150 blur-[2px]">
                404
              </h1>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Page Not Found
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto leading-relaxed">
              We couldn't find the page you were looking for. It might have been removed, renamed, or currently unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto min-w-[300px]">
              <Button asChild size="lg" className="gap-2 h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 h-12 px-8 text-base transition-all hover:-translate-y-0.5 hover:bg-secondary/50">
                <Link href="/offers">
                  <Search className="w-4 h-4" />
                  Browse Offers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
