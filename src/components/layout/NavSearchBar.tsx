"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Tag, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { browseOffers } from "@/services/offer.service";
import { Offer } from "@/types";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";

interface NavSearchBarProps {
  className?: string;
}

export function NavSearchBar({ className }: NavSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await browseOffers({ search: debouncedQuery, limit: 5 });
        setResults(response.offers);
      } catch (error) {
        console.error("Failed to search offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/offers?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleDisplayResult = () => {
    if (query.length > 0) {
        setIsOpen(true);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full max-w-md ${className || ""}`} ref={searchRef}>
      <form 
        onSubmit={handleSearchSubmit} 
        onClick={handleContainerClick}
        className="relative flex items-center w-full rounded-full border border-primary/50 bg-muted/30 hover:bg-muted/50 transition-colors cursor-text h-10"
      >
        <div className="flex items-center pl-4 pr-2 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
            <div className="h-5 w-[1px] bg-border mx-3"></div>
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for items..."
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-full bg-transparent text-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value) setIsOpen(true);
          }}
          onFocus={() => {
              if (query) setIsOpen(true);
          }}
          suppressHydrationWarning
        />
        <div className="p-1">
            <Button 
                type="submit" 
                size="icon" 
                className="rounded-full h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                onClick={(e) => e.stopPropagation()}
                suppressHydrationWarning
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
        </div>
      </form>

      {isOpen && (query.trim().length > 0) && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-popover text-popover-foreground rounded-xl border shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Offers
              </div>
              {results.map((offer) => (
                <Link
                  key={offer._id}
                  href={`/offers/${offer._id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {offer.imageUrl ? (
                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                        <Tag className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{offer.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                       <span className="text-destructive font-medium">-{offer.discount}%</span>
                       {typeof offer.partner === 'object' && offer.partner?.partnerName && (
                        <>
                            <span>•</span>
                            <span className="truncate">{offer.partner.partnerName}</span>
                        </>
                       )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t mt-1">
                <button
                  onClick={(e) => {
                      e.stopPropagation();
                      handleSearchSubmit();
                  }}
                  className="w-full px-4 py-3 text-sm text-primary font-medium hover:bg-accent transition-colors text-left flex items-center justify-center"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No offers found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
