'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, MapPin } from 'lucide-react';


// If useDebounce doesn't exist, I'll implement a simple one inside or use a timeout
// Let's assume I need to implement a simple debounce logic here if the hook is missing.
// I'll check for hooks first.

interface OfferFiltersProps {
  categories: string[];
  districts?: string[];
}

export function OfferFilters({ categories, districts = [] }: OfferFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [district, setDistrict] = useState(searchParams.get('district') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

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
    
    if (value && value !== 'all' && value !== '') {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Reset page when filters change
    if (name !== 'page') {
      params.delete('page');
    }

    return params.toString();
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    router.push(`${pathname}?${createQueryString('category', value)}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    router.push(`${pathname}?${createQueryString('sortBy', value)}`);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    router.push(`${pathname}?${createQueryString('district', value)}`);
  };

  const handleLocationSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('location', term);
    } else {
      params.delete('location');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setDistrict('all');
    setLocation('');
    setSortBy('newest');
    router.push(pathname);
  };

  return (
    <div className="bg-card rounded-lg border p-4 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search offers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            className="pl-9 w-[180px]"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {districts.length > 0 && (
          <Select value={district} onValueChange={handleDistrictChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((dist) => (
                <SelectItem key={dist} value={dist}>
                  {dist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
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

        {(search || category !== 'all' || district !== 'all' || location || sortBy !== 'newest') && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
