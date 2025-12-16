"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  X,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OfferFiltersProps {
  categories: string[];
  districts?: string[];
}

export function OfferFilters({
  categories,
  districts = [],
}: OfferFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Normalize category from URL to match options (case-insensitive)
  const paramCategory = searchParams.get("category");
  const matchingCategory = paramCategory 
    ? categories.find(c => c.toLowerCase() === paramCategory.toLowerCase()) || paramCategory
    : "all";

  const [category, setCategory] = useState(matchingCategory);
  const [district, setDistrict] = useState(
    searchParams.get("district") || "all"
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Count active filters
  const activeFiltersCount = [
    category !== "all",
    district !== "all",
    location !== "",
    sortBy !== "newest",
  ].filter(Boolean).length;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLocationSearch(location);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all" && value !== "") {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Reset page when filters change
    if (name !== "page") {
      params.delete("page");
    }

    return params.toString();
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    router.push(`${pathname}?${createQueryString("category", value)}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    router.push(`${pathname}?${createQueryString("sortBy", value)}`);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    router.push(`${pathname}?${createQueryString("district", value)}`);
  };

  const handleLocationSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("location", term);
    } else {
      params.delete("location");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setDistrict("all");
    setLocation("");
    setSortBy("newest");
    router.push(pathname);
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters =
    search ||
    category !== "all" ||
    district !== "all" ||
    location ||
    sortBy !== "newest";

  // Filter Content Component
  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? "space-y-4" : "flex flex-wrap gap-3"}`}>
      {/* Category Filter */}
      <div className={isMobile ? "space-y-2" : ""}>
        {isMobile && <label className="text-sm font-medium">Category</label>}
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger
            className={`${
              isMobile ? "w-full h-11" : "w-[160px]"
            } bg-background`}
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Search */}
      <div className={isMobile ? "space-y-2" : ""}>
        {isMobile && <label className="text-sm font-medium">Location</label>}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            className={`pl-9 bg-background ${
              isMobile ? "w-full h-11" : "w-[160px]"
            }`}
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* District Filter */}
      {districts.length > 0 && (
        <div className={isMobile ? "space-y-2" : ""}>
          {isMobile && <label className="text-sm font-medium">District</label>}
          <Select value={district} onValueChange={handleDistrictChange}>
            <SelectTrigger
              className={`${
                isMobile ? "w-full h-11" : "w-[160px]"
              } bg-background`}
            >
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map(dist => (
                <SelectItem key={dist} value={dist}>
                  {dist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort By */}
      <div className={isMobile ? "space-y-2" : ""}>
        {isMobile && <label className="text-sm font-medium">Sort By</label>}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger
            className={`${
              isMobile ? "w-full h-11" : "w-[160px]"
            } bg-background`}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="discount-high">Highest Discount</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button (Mobile) */}
      {isMobile && hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full h-11 mt-4"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <div className="flex flex-col gap-4">
        {/* Search Row */}
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
              className="pl-9 h-11 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden h-11 w-11 relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto max-h-[80vh] rounded-t-xl"
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center justify-between">
                  Filter Offers
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount} active
                    </Badge>
                  )}
                </SheetTitle>
              </SheetHeader>
              <FilterContent isMobile={true} />
              <div className="mt-6">
                <Button
                  className="w-full h-12 font-medium"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Clear Button (Desktop) */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="Clear filters"
              className="hidden lg:flex h-11 w-11"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <FilterContent isMobile={false} />
        </div>

        {/* Active Filters Tags (Mobile) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 lg:hidden">
            {category !== "all" && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                {category}
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                {location}
                <button
                  onClick={() => setLocation("")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {district !== "all" && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                {district}
                <button
                  onClick={() => handleDistrictChange("all")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                {sortBy.replace("-", " ")}
                <button
                  onClick={() => handleSortChange("newest")}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
